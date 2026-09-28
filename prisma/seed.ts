import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";
import { requireDatabaseUrl } from "./database-url";
import { BLOGS, GALLERY, SERVICES } from "./seed-content";

// Same env loading as Next.js, so `\$` escapes in the password hash resolve identically.
loadEnvConfig(process.cwd());
const prisma = new PrismaClient({ datasourceUrl: requireDatabaseUrl() });

/**
 * The owner account exists only here: the dashboard can never create, list (for admins) or delete it.
 * Existing owner is left untouched unless SUPERADMIN_RESET=1, which re-applies email, name and password
 * and signs out its sessions.
 */
async function seedSuperAdmin() {
  const email = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
  // Accept both forms: `\$`-escaped (Next.js .env files) and raw (Docker env_file with single quotes).
  const passwordHash = process.env.SUPERADMIN_PASSWORD_HASH?.replace(/\\\$/g, "$");
  const name = process.env.SUPERADMIN_NAME?.trim() || "Site Owner";
  if (!email || !passwordHash) {
    console.warn("SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD_HASH not set: skipped owner account.");
    return;
  }
  if (!/^\$2[aby]\$\d{2}\$.{53}$/.test(passwordHash)) {
    throw new Error("SUPERADMIN_PASSWORD_HASH is not a bcrypt hash. Generate it with `pnpm admin:hash` and keep the \\$ escapes.");
  }

  const existing = await prisma.user.findFirst({ where: { role: "SUPERADMIN" } });
  if (!existing) {
    await prisma.user.create({ data: { email, name, passwordHash, role: "SUPERADMIN" } });
    console.log("Owner account created.");
  } else if (process.env.SUPERADMIN_RESET === "1") {
    await prisma.user.update({
      where: { id: existing.id },
      data: { email, name, passwordHash, sessionVersion: { increment: 1 } },
    });
    console.log("Owner account reset from env.");
  } else {
    console.log("Owner account exists: unchanged (set SUPERADMIN_RESET=1 to re-apply env).");
  }
}

const toHtml = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => `<p>${p.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
    .join("");

async function main() {
  await seedSuperAdmin();

  // Idempotent: only seeds tables that are still empty, so re-running never clobbers admin edits.
  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({
      data: SERVICES.map((s, order) => ({
        title: s.title,
        slug: s.slug,
        description: s.description,
        image: s.image,
        order,
      })),
    });
  }

  if ((await prisma.blog.count()) === 0) {
    await prisma.blog.createMany({
      data: BLOGS.map((b) => ({
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        category: b.category,
        coverImage: b.image,
        content: toHtml(b.content),
        published: true,
        publishedAt: b.publishedAt ? new Date(b.publishedAt) : new Date(),
      })),
    });
  }

  if ((await prisma.galleryItem.count()) === 0) {
    await prisma.galleryItem.createMany({
      data: GALLERY.map((g, order) => ({ ...g, order })),
    });
  }

  console.log(
    `Seeded: ${await prisma.service.count()} services, ${await prisma.blog.count()} blogs, ${await prisma.galleryItem.count()} gallery items`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
