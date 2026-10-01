import "server-only";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { LOCATIONS, type Testimonial } from "@/features/shared/lib/data";
import { NotFoundError } from "@/features/shared/server/errors";
import type { ImageJanitor } from "./image-janitor.service";
import { imageField, orderField, parseOrThrow } from "./validation";

const optional = (max: number) => z.string().trim().max(max).optional().transform((v) => v || null);

const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Add the person's name.").max(120),
  quote: z.string().trim().min(1, "Add what they said.").max(2000),
  photo: z.union([z.literal("").transform(() => null), imageField]).optional().transform((v) => v ?? null),
  service: optional(120),
  centre: optional(40).refine((v) => v === null || LOCATIONS.some((l) => l.city === v), "Choose one of the centres."),
  rating: z.coerce.number().int().min(1, "Rating is 1 to 5 stars.").max(5, "Rating is 1 to 5 stars.").default(5),
  // Checkbox: present ("on") when ticked, absent otherwise.
  published: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
  order: orderField,
});

export class TestimonialService {
  constructor(
    private readonly db: PrismaClient,
    private readonly images: ImageJanitor,
  ) {}

  listPublished(): Promise<Testimonial[]> {
    return this.db.testimonial.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: { id: true, name: true, quote: true, photo: true, service: true, centre: true, rating: true },
    });
  }

  listForAdmin() {
    return this.db.testimonial.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  }

  findById(id: string) {
    return this.db.testimonial.findUnique({ where: { id } });
  }

  async save(id: string | undefined, input: Record<string, unknown>) {
    const data = parseOrThrow(testimonialSchema, input);
    if (id) {
      const previous = await this.findById(id);
      if (!previous) throw new NotFoundError("That testimonial no longer exists.");
      await this.db.testimonial.update({ where: { id }, data });
      if (previous.photo && previous.photo !== data.photo) await this.images.release([previous.photo]);
    } else {
      await this.db.testimonial.create({ data });
    }
  }

  async remove(id: string) {
    const item = await this.findById(id);
    const { count } = await this.db.testimonial.deleteMany({ where: { id } });
    if (count === 0 || !item) throw new NotFoundError("That testimonial no longer exists.");
    if (item.photo) await this.images.release([item.photo]);
  }
}
