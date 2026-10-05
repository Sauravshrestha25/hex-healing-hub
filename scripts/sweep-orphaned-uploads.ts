import { DeleteObjectsCommand, ListObjectsV2Command, S3Client, type _Object } from "@aws-sdk/client-s3";
import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";
import { imagesInHtml } from "../features/content/lib/images-in-html";
import { requireDatabaseUrl } from "../prisma/database-url";

/**
 * Deletes uploads that no content uses: photos picked in a form that was then cancelled,
 * replaced before saving, or abandoned. Only files older than --min-age-hours (default 24)
 * are touched, so nothing someone is still editing disappears. Run nightly via cron.
 *
 *   tsx scripts/sweep-orphaned-uploads.ts [--dry-run] [--min-age-hours=24]
 */
loadEnvConfig(process.cwd());
const dryRun = process.argv.includes("--dry-run");

// The bucket is shared with local development, whose database doesn't know about live uploads.
// Only the production database can tell which live files are unused.
if (process.env.NODE_ENV !== "production") {
  throw new Error("Run this only on the live server (NODE_ENV=production), where the database matches the live uploads.");
}
const minAgeHours = Number(process.argv.find((arg) => arg.startsWith("--min-age-hours="))?.split("=")[1] ?? 24);

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE_URL } = process.env;
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_BASE_URL) {
  throw new Error("Set all R2_* variables first.");
}
if (!Number.isFinite(minAgeHours) || minAgeHours < 0) throw new Error("--min-age-hours must be a number of 0 or more.");

const publicPrefix = `${R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/`;
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  requestChecksumCalculation: "WHEN_REQUIRED",
});
const db = new PrismaClient({ datasourceUrl: requireDatabaseUrl() });

/** Object keys that some blog, service, portfolio item, testimonial or healer points at. */
async function referencedKeys() {
  const [blogs, services, gallery, testimonials, healers] = await Promise.all([
    db.blog.findMany({ select: { coverImage: true, content: true } }),
    db.service.findMany({ select: { image: true, content: true } }),
    db.galleryItem.findMany({ select: { image: true } }),
    db.testimonial.findMany({ select: { photo: true } }),
    db.healer.findMany({ select: { photo: true } }),
  ]);
  // Guard against an empty or wrong database, which would make every file look unused.
  if (blogs.length + services.length + gallery.length === 0) {
    throw new Error("The database has no content at all; refusing to delete anything.");
  }
  const urls = [
    ...blogs.flatMap((b) => [b.coverImage, ...imagesInHtml(b.content)]),
    ...services.flatMap((s) => [s.image, ...imagesInHtml(s.content)]),
    ...gallery.map((g) => g.image),
    ...testimonials.flatMap((t) => (t.photo ? [t.photo] : [])),
    ...healers.flatMap((h) => (h.photo ? [h.photo] : [])),
  ];
  return new Set(
    urls
      .filter((url) => url.startsWith(publicPrefix))
      .map((url) => decodeURIComponent(url.slice(publicPrefix.length).split(/[?#]/)[0]!)),
  );
}

async function listUploads() {
  const objects: _Object[] = [];
  let token: string | undefined;
  do {
    const page = await s3.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: "uploads/", ContinuationToken: token }));
    objects.push(...(page.Contents ?? []));
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);
  return objects;
}

async function main() {
  const [used, uploads] = await Promise.all([referencedKeys(), listUploads()]);
  const cutoff = Date.now() - minAgeHours * 60 * 60 * 1000;
  const unused = uploads.filter((o) => o.Key && !used.has(o.Key));
  const orphans = unused.filter((o) => (o.LastModified?.getTime() ?? Date.now()) < cutoff);

  for (const o of orphans) console.log(`${dryRun ? "would delete" : "deleting"} ${o.Key} (${o.LastModified?.toISOString()})`);

  if (!dryRun) {
    for (let i = 0; i < orphans.length; i += 1000) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: R2_BUCKET,
          Delete: { Objects: orphans.slice(i, i + 1000).map((o) => ({ Key: o.Key! })), Quiet: true },
        }),
      );
    }
  }

  console.log(
    `${new Date().toISOString()} ${dryRun ? "[dry run] " : ""}uploads: ${uploads.length}, in use: ${uploads.length - unused.length}, ` +
      `${dryRun ? "would delete" : "deleted"}: ${orphans.length}, unused but newer than ${minAgeHours}h (kept): ${unused.length - orphans.length}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
