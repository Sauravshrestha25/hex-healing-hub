import "server-only";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import type { R2StorageService } from "@/features/admin/server/storage.service";
import type { ImageJanitor } from "@/features/content/server/image-janitor.service";
import { imageField, parseOrThrow } from "@/features/content/server/validation";
import { ValidationError } from "@/features/shared/server/errors";
import type { RateLimiter } from "@/features/shared/server/rate-limiter";

const SETTINGS_ID = "default";
/** Visitors' payment screenshots live apart from site images. */
const PROOF_FOLDER = "payments/";

const settingsSchema = z.object({
  qrImage: z.union([z.literal("").transform(() => null), imageField]).optional().transform((v) => v ?? null),
  instructions: z.string().max(500).default("").transform((v) => v.replace(/\r\n?/g, "\n").trim()),
  // Switch: present ("on") when ticked, absent otherwise.
  required: z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean()),
});

/** What the booking form shows when the business takes payment by QR. */
export type PaymentOffer = { qrImage: string; instructions: string; required: boolean };

/** Paying by QR when booking: the business's QR code, and the screenshots visitors send as proof. */
export class PaymentService {
  constructor(
    private readonly db: PrismaClient,
    private readonly images: ImageJanitor,
    private readonly storage: R2StorageService,
    private readonly proofUploads: RateLimiter,
  ) {}

  async settings() {
    const row = await this.db.paymentSettings.findUnique({ where: { id: SETTINGS_ID } });
    return { qrImage: row?.qrImage ?? null, instructions: row?.instructions ?? "", required: row?.required ?? false };
  }

  /** Null until a QR is uploaded: without one there is nothing to pay to, so nothing is asked. */
  async offer(): Promise<PaymentOffer | null> {
    const { qrImage, instructions, required } = await this.settings();
    return qrImage ? { qrImage, instructions, required } : null;
  }

  async save(input: unknown) {
    const data = parseOrThrow(settingsSchema, input);
    if (data.required && !data.qrImage) throw new ValidationError("Upload the QR code before making payment required.");
    const previous = await this.settings();
    await this.db.paymentSettings.upsert({ where: { id: SETTINGS_ID }, create: { id: SETTINGS_ID, ...data }, update: data });
    if (previous.qrImage && previous.qrImage !== data.qrImage) await this.images.release([previous.qrImage]);
  }

  /**
   * Where a visitor's browser may upload one payment screenshot. Open to the public, so it is
   * limited per IP and only offered while a QR is set.
   */
  async createProofUpload(input: unknown, ip: string) {
    if (!(await this.offer())) throw new ValidationError("Online payment isn't available right now.");
    if (await this.proofUploads.isLimited(ip)) throw new ValidationError("Too many uploads. Please try again in a few minutes.");
    const upload = await this.storage.createImageUpload(input, PROOF_FOLDER);
    await this.proofUploads.hit(ip);
    return upload;
  }

  /** Only our own freshly uploaded screenshots are accepted on a booking, never an arbitrary link. */
  isProof(url: string) {
    return this.storage.ownsUrl(url, PROOF_FOLDER);
  }

  /** A deleted booking takes its screenshot with it. */
  async removeProof(url: string) {
    if (this.isProof(url)) await this.storage.removeImages([url]);
  }
}
