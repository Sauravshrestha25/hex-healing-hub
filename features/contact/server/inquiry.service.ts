import "server-only";
import type { InquiryStatus, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { NotFoundError, ValidationError } from "@/features/shared/server/errors";
import type { RateLimiter } from "@/features/shared/server/rate-limiter";
import type { InquiryNotifier } from "./inquiry-notifier";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Please add your name.").max(120),
  email: z.string().trim().email("Please add a valid email address.").max(200),
  phone: z.string().trim().max(40).optional().transform((v) => v || null),
  interest: z.string().trim().max(120).optional().transform((v) => v || null),
  message: z.string().trim().min(1, "Please add a short message.").max(5000),
  // Honeypot: hidden from people, filled in by bots.
  company: z.string().max(0).optional(),
});

export type InquiryFilter = "open" | "resolved" | "all";

export class InquiryService {
  constructor(
    private readonly db: PrismaClient,
    private readonly notifier: InquiryNotifier,
    private readonly submissions: RateLimiter,
  ) {}

  /** Public contact form. Returns false for silently-dropped bot submissions. */
  async submit(input: Record<string, unknown>, ip: string): Promise<boolean> {
    const parsed = inquirySchema.safeParse(input);
    if (!parsed.success) {
      // A filled honeypot gets a quiet "success" so bots learn nothing.
      if (parsed.error.issues.some((issue) => issue.path[0] === "company")) return false;
      throw new ValidationError(parsed.error.issues[0]?.message ?? "Please check the form and try again.");
    }
    if (await this.submissions.isLimited(ip)) {
      throw new ValidationError("You've sent several messages recently. Please try again in a few minutes.");
    }

    const { name, email, phone, interest, message } = parsed.data;
    const data = { name, email, phone, interest, message };
    await this.db.inquiry.create({ data });
    await this.submissions.hit(ip);

    try {
      await this.notifier.notify(data);
    } catch (error) {
      // Already saved: a mail failure must not lose the inquiry or fail the visitor.
      console.error("Inquiry email notification failed", error);
    }
    return true;
  }

  list(filter: InquiryFilter) {
    const where =
      filter === "open"
        ? { status: { in: ["NEW", "READ"] as InquiryStatus[] } }
        : filter === "resolved"
          ? { status: "RESOLVED" as const }
          : {};
    return this.db.inquiry.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });
  }

  recent(take = 5) {
    return this.db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take });
  }

  async counts() {
    const [open, resolved] = await Promise.all([
      this.db.inquiry.count({ where: { status: { in: ["NEW", "READ"] } } }),
      this.db.inquiry.count({ where: { status: "RESOLVED" } }),
    ]);
    return { open, resolved, all: open + resolved };
  }

  countNew() {
    return this.db.inquiry.count({ where: { status: "NEW" } });
  }

  findById(id: string) {
    return this.db.inquiry.findUnique({ where: { id } });
  }

  async setStatus(id: string, status: InquiryStatus) {
    if (!["NEW", "READ", "RESOLVED"].includes(status)) throw new ValidationError("Invalid status.");
    const { count } = await this.db.inquiry.updateMany({ where: { id }, data: { status } });
    if (count === 0) throw new NotFoundError("That inquiry no longer exists.");
  }

  async remove(id: string) {
    const { count } = await this.db.inquiry.deleteMany({ where: { id } });
    if (count === 0) throw new NotFoundError("That inquiry no longer exists.");
  }
}
