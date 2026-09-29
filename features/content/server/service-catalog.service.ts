import "server-only";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { slugify } from "@/features/shared/lib/slugify";
import type { Service } from "@/features/shared/lib/data";
import { NotFoundError, ValidationError } from "@/features/shared/server/errors";
import type { ImageJanitor } from "./image-janitor.service";
import { imageField, orderField, parseOrThrow, withUniqueGuard } from "./validation";

const serviceSchema = z.object({
  title: z.string().trim().min(1, "Add a title.").max(120),
  slug: z.string().trim().max(80).optional(),
  description: z.string().trim().min(1, "Add a description.").max(600),
  image: imageField,
  order: orderField,
});

/** The healing services offered (the `Service` model): shown on the homepage and /services. */
export class ServiceCatalogService {
  constructor(
    private readonly db: PrismaClient,
    private readonly images: ImageJanitor,
  ) {}

  list(): Promise<Service[]> {
    return this.db.service.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, title: true, slug: true, description: true, image: true },
    });
  }

  listForAdmin() {
    return this.db.service.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  }

  findById(id: string) {
    return this.db.service.findUnique({ where: { id } });
  }

  async save(id: string | undefined, input: Record<string, unknown>) {
    const fields = parseOrThrow(serviceSchema, input);
    const slug = slugify(fields.slug || fields.title);
    if (!slug) throw new ValidationError("Add a title or slug with letters or numbers.");
    const data = { ...fields, slug };

    const previous = id ? await this.findById(id) : null;
    if (id && !previous) throw new NotFoundError("That service no longer exists.");
    await withUniqueGuard(
      () => (id ? this.db.service.update({ where: { id }, data }) : this.db.service.create({ data })),
      "Another service already uses that slug.",
    );
    if (previous && previous.image !== data.image) await this.images.release([previous.image]);
  }

  async remove(id: string) {
    const service = await this.findById(id);
    const { count } = await this.db.service.deleteMany({ where: { id } });
    if (count === 0 || !service) throw new NotFoundError("That service no longer exists.");
    await this.images.release([service.image]);
  }
}
