import "server-only";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import type { GalleryItem } from "@/features/shared/lib/data";
import { NotFoundError } from "@/features/shared/server/errors";
import type { ImageJanitor } from "./image-janitor.service";
import { imageField, orderField, parseOrThrow } from "./validation";

const gallerySchema = z.object({
  image: imageField,
  title: z.string().trim().min(1, "Add a title.").max(120),
  category: z.string().trim().min(1, "Add a category.").max(80),
  alt: z.string().trim().min(1, "Describe the image for screen readers.").max(300),
  order: orderField,
});

export class GalleryService {
  constructor(
    private readonly db: PrismaClient,
    private readonly images: ImageJanitor,
  ) {}

  list(): Promise<GalleryItem[]> {
    return this.db.galleryItem.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, image: true, title: true, category: true, alt: true },
    });
  }

  listForAdmin() {
    return this.db.galleryItem.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  }

  findById(id: string) {
    return this.db.galleryItem.findUnique({ where: { id } });
  }

  async save(id: string | undefined, input: Record<string, unknown>) {
    const data = parseOrThrow(gallerySchema, input);
    if (id) {
      const previous = await this.findById(id);
      if (!previous) throw new NotFoundError("That image no longer exists.");
      await this.db.galleryItem.update({ where: { id }, data });
      if (previous.image !== data.image) await this.images.release([previous.image]);
    } else {
      await this.db.galleryItem.create({ data });
    }
  }

  async remove(id: string) {
    const item = await this.findById(id);
    const { count } = await this.db.galleryItem.deleteMany({ where: { id } });
    if (count === 0 || !item) throw new NotFoundError("That image no longer exists.");
    await this.images.release([item.image]);
  }
}
