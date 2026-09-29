import "server-only";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { sanitizeBlogHtml } from "@/features/content/lib/sanitize";
import { slugify } from "@/features/shared/lib/slugify";
import type { Blog } from "@/features/shared/lib/data";
import { NotFoundError, ValidationError } from "@/features/shared/server/errors";
import { type ImageJanitor, imagesInHtml } from "./image-janitor.service";
import { imageField, parseOrThrow, withUniqueGuard } from "./validation";

const blogSchema = z.object({
  title: z.string().trim().min(1, "Add a title.").max(200),
  slug: z.string().trim().max(80).optional(),
  excerpt: z.string().trim().min(1, "Add a short excerpt.").max(400),
  category: z.string().trim().min(1, "Add a category.").max(80),
  coverImage: imageField,
  content: z.string().max(200_000),
  published: z.literal("on").optional(),
});

const publicFields = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  category: true,
  coverImage: true,
  content: true,
  publishedAt: true,
} as const;

export class BlogService {
  constructor(
    private readonly db: PrismaClient,
    private readonly images: ImageJanitor,
  ) {}

  async listPublished(): Promise<Blog[]> {
    const rows = await this.db.blog.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, select: publicFields });
    return rows.map(BlogService.toPublic);
  }

  async findPublishedBySlug(slug: string): Promise<Blog | null> {
    const row = await this.db.blog.findFirst({ where: { slug, published: true }, select: publicFields });
    return row ? BlogService.toPublic(row) : null;
  }

  listForAdmin() {
    return this.db.blog.findMany({
      orderBy: [{ published: "asc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
      select: { id: true, title: true, category: true, coverImage: true, published: true, publishedAt: true, updatedAt: true },
    });
  }

  findById(id: string) {
    return this.db.blog.findUnique({ where: { id } });
  }

  async save(id: string | undefined, input: Record<string, unknown>) {
    const { published, ...fields } = parseOrThrow(blogSchema, input);
    const slug = slugify(fields.slug || fields.title);
    if (!slug) throw new ValidationError("Add a title or slug with letters or numbers.");
    const content = sanitizeBlogHtml(fields.content);
    if (!content.replace(/<[^>]+>/g, "").trim()) throw new ValidationError("Write the article before saving.");

    const existing = id
      ? await this.db.blog.findUnique({ where: { id }, select: { publishedAt: true, coverImage: true, content: true } })
      : null;
    if (id && !existing) throw new NotFoundError("That post no longer exists.");

    const isPublished = published === "on";
    const data = {
      ...fields,
      slug,
      content,
      published: isPublished,
      // Keep the original date when re-saving; set it the first time a post goes live.
      publishedAt: isPublished ? (existing?.publishedAt ?? new Date()) : (existing?.publishedAt ?? null),
    };

    await withUniqueGuard(
      () => (id ? this.db.blog.update({ where: { id }, data }) : this.db.blog.create({ data })),
      "Another post already uses that slug.",
    );

    if (existing) {
      const kept = new Set([data.coverImage, ...imagesInHtml(content)]);
      await this.images.release([existing.coverImage, ...imagesInHtml(existing.content)].filter((url) => !kept.has(url)));
    }
  }

  async remove(id: string) {
    const blog = await this.db.blog.findUnique({ where: { id }, select: { coverImage: true, content: true } });
    const { count } = await this.db.blog.deleteMany({ where: { id } });
    if (count === 0 || !blog) throw new NotFoundError("That post no longer exists.");
    await this.images.release([blog.coverImage, ...imagesInHtml(blog.content)]);
  }

  private static toPublic({ coverImage, publishedAt, ...rest }: {
    id: string; title: string; slug: string; excerpt: string; category: string; coverImage: string; content: string; publishedAt: Date | null;
  }): Blog {
    return { ...rest, image: coverImage, publishedAt: publishedAt?.toISOString() ?? null };
  }
}
