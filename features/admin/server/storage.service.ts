import "server-only";
import { randomUUID } from "node:crypto";
import { DeleteObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { uploadPrefix } from "@/features/shared/lib/upload-prefix";
import { AppError, ValidationError } from "@/features/shared/server/errors";

const EXTENSIONS = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as const;
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const uploadRequestSchema = z.object({
  contentType: z.enum(Object.keys(EXTENSIONS) as [keyof typeof EXTENSIONS, ...(keyof typeof EXTENSIONS)[]]),
  size: z.number().int().positive().max(MAX_UPLOAD_BYTES),
});

type R2Config = { accountId: string; accessKeyId: string; secretAccessKey: string; bucket: string; publicUrl: string };

export class StorageNotConfiguredError extends AppError {
  constructor() {
    super("Image storage (Cloudflare R2) is not configured yet.");
  }
}

/** Cloudflare R2 (S3-compatible). The browser uploads directly using a short-lived signed URL. */
export class R2StorageService {
  private client: S3Client | null = null;

  constructor(private readonly config: R2Config | null) {}

  static fromEnv() {
    const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE_URL } = process.env;
    const complete = R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET && R2_PUBLIC_BASE_URL;
    return new R2StorageService(
      complete
        ? {
            accountId: R2_ACCOUNT_ID,
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
            bucket: R2_BUCKET,
            publicUrl: R2_PUBLIC_BASE_URL.replace(/\/$/, ""),
          }
        : null,
    );
  }

  get isConfigured() {
    return this.config !== null;
  }

  /** Validates the request, then returns where to PUT the file and the public URL to store. */
  async createImageUpload(input: unknown) {
    if (!this.config) throw new StorageNotConfiguredError();
    const parsed = uploadRequestSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError("Use a JPEG, PNG, WebP or AVIF image up to 10 MB.");

    const { contentType, size } = parsed.data;
    const now = new Date();
    const key = `${uploadPrefix()}${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${EXTENSIONS[contentType]}`;

    // ContentType and ContentLength are signed, so the upload must match what was approved.
    const uploadUrl = await getSignedUrl(
      this.s3(),
      new PutObjectCommand({ Bucket: this.config.bucket, Key: key, ContentType: contentType, ContentLength: size }),
      { expiresIn: 60 },
    );
    return { uploadUrl, publicUrl: `${this.config.publicUrl}/${key}` };
  }

  /**
   * Deletes uploaded files by their public URL. Only files in this environment's own folder
   * (see uploadPrefix) are touched; site images, other hosts and the other environment's files are ignored. Never throws: a leftover file is
   * harmless, a failed save is not.
   */
  async removeImages(urls: Iterable<string>) {
    if (!this.config) return;
    const prefix = `${this.config.publicUrl}/`;
    const keys = [...new Set(urls)]
      .filter((url) => url.startsWith(`${prefix}${uploadPrefix()}`))
      .map((url) => decodeURIComponent(url.slice(prefix.length).split(/[?#]/)[0]!));
    if (keys.length === 0) return;
    try {
      await this.s3().send(
        new DeleteObjectsCommand({ Bucket: this.config.bucket, Delete: { Objects: keys.map((Key) => ({ Key })), Quiet: true } }),
      );
    } catch (error) {
      console.error("Couldn't delete images from R2", keys, error);
    }
  }

  private s3() {
    if (!this.config) throw new StorageNotConfiguredError();
    this.client ??= new S3Client({
      region: "auto",
      endpoint: `https://${this.config.accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: this.config.accessKeyId, secretAccessKey: this.config.secretAccessKey },
      // The SDK otherwise signs a CRC32 of the (empty) request into presigned URLs, and R2 then
      // rejects the browser's real upload as a checksum mismatch. Only send checksums when required.
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });
    return this.client;
  }
}
