import { readFile } from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";
import { requireDatabaseUrl } from "../prisma/database-url";

/**
 * One-time move of the launch photos (served from /public/images) into R2.
 * Uploads each file the database still points at, then rewrites those URLs to R2.
 * Safe to re-run: rows already on R2 are left alone. `--dry-run` only reports.
 *
 *   tsx scripts/migrate-images-to-r2.ts [--dry-run]
 */
loadEnvConfig(process.cwd());
const dryRun = process.argv.includes("--dry-run");

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE_URL } = process.env;
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_BASE_URL) {
  throw new Error("Set all R2_* variables first.");
}
const publicBase = R2_PUBLIC_BASE_URL.replace(/\/$/, "");
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  requestChecksumCalculation: "WHEN_REQUIRED",
});
const db = new PrismaClient({ datasourceUrl: requireDatabaseUrl() });

const TYPES: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif" };
const LOCAL = /\/images\/[\w.-]+\.(?:jpe?g|png|webp|avif)/gi;
const uploaded = new Map<string, string>(); // local path -> R2 URL

async function toR2(localPath: string) {
  const cached = uploaded.get(localPath);
  if (cached) return cached;
  const file = path.basename(localPath);
  const key = `uploads/launch/${file}`;
  const url = `${publicBase}/${key}`;
  if (!dryRun) {
    const body = await readFile(path.join(process.cwd(), "public", localPath));
    await s3.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body, ContentType: TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream" }));
  }
  console.log(`${dryRun ? "would upload" : "uploaded"} ${localPath} -> ${key}`);
  uploaded.set(localPath, url);
  return url;
}

async function rewriteHtml(html: string) {
  let result = html;
  for (const localPath of new Set(html.match(LOCAL) ?? [])) result = result.split(`"${localPath}"`).join(`"${await toR2(localPath)}"`);
  return result;
}

const isLocal = (url: string) => url.startsWith("/images/");

async function main() {
  let rows = 0;

  for (const blog of await db.blog.findMany({ select: { id: true, coverImage: true, content: true } })) {
    const coverImage = isLocal(blog.coverImage) ? await toR2(blog.coverImage) : blog.coverImage;
    const content = await rewriteHtml(blog.content);
    if (coverImage !== blog.coverImage || content !== blog.content) {
      rows++;
      if (!dryRun) await db.blog.update({ where: { id: blog.id }, data: { coverImage, content } });
    }
  }

  for (const service of await db.service.findMany({ select: { id: true, image: true, content: true } })) {
    const image = isLocal(service.image) ? await toR2(service.image) : service.image;
    const content = await rewriteHtml(service.content);
    if (image !== service.image || content !== service.content) {
      rows++;
      if (!dryRun) await db.service.update({ where: { id: service.id }, data: { image, content } });
    }
  }

  for (const item of await db.galleryItem.findMany({ select: { id: true, image: true } })) {
    if (!isLocal(item.image)) continue;
    const image = await toR2(item.image);
    rows++;
    if (!dryRun) await db.galleryItem.update({ where: { id: item.id }, data: { image } });
  }

  console.log(`${dryRun ? "Dry run: would update" : "Updated"} ${rows} rows, ${uploaded.size} files.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
