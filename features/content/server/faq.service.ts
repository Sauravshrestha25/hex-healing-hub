import "server-only";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { NotFoundError } from "@/features/shared/server/errors";
import { orderField, parseOrThrow } from "./validation";

const faqSchema = z.object({
  question: z.string().trim().min(1, "Add the question.").max(200),
  answer: z.string().trim().min(1, "Add the answer.").max(2000),
  // Checkbox: present ("on") when ticked, absent otherwise.
  published: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
  order: orderField,
});

export class FaqService {
  constructor(private readonly db: PrismaClient) {}

  listPublished() {
    return this.db.faq.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, question: true, answer: true },
    });
  }

  listForAdmin() {
    return this.db.faq.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  }

  findById(id: string) {
    return this.db.faq.findUnique({ where: { id } });
  }

  async save(id: string | undefined, input: Record<string, unknown>) {
    const data = parseOrThrow(faqSchema, input);
    if (id) {
      const { count } = await this.db.faq.updateMany({ where: { id }, data });
      if (count === 0) throw new NotFoundError("That question no longer exists.");
    } else {
      await this.db.faq.create({ data });
    }
  }

  async remove(id: string) {
    const { count } = await this.db.faq.deleteMany({ where: { id } });
    if (count === 0) throw new NotFoundError("That question no longer exists.");
  }
}
