import "server-only";
import type { BookingStatus, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { LOCATIONS, TIMES_OF_DAY } from "@/features/shared/lib/data";
import { NotFoundError, ValidationError } from "@/features/shared/server/errors";
import type { RateLimiter } from "@/features/shared/server/rate-limiter";
import type { BookingNotifier } from "./booking-notifier";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().transform((v) => v || null);

/** Today's date in Nepal as YYYY-MM-DD, so "no past dates" matches the visitor's calendar. */
function todayInNepal() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kathmandu" }).format(new Date());
}

const bookingSchema = z.object({
  name: z.string().trim().min(1, "Please add your name.").max(120),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v.replace(/\D/g, "").length >= 7, "Please add a phone number we can reach you on."),
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => v || null)
    .refine((v) => v === null || z.string().email().safeParse(v).success, "Please add a valid email address."),
  service: z.string().trim().min(1, "Please choose a service.").max(120),
  centre: optionalText(40).refine(
    (v) => v === null || LOCATIONS.some((l) => l.city === v),
    "Please choose one of our centres.",
  ),
  preferredDate: optionalText(10).refine(
    (v) => v === null || (/^\d{4}-\d{2}-\d{2}$/.test(v) && v >= todayInNepal()),
    "Please choose today or a later date.",
  ),
  timeOfDay: optionalText(20).refine(
    (v) => v === null || (TIMES_OF_DAY as readonly string[]).includes(v),
    "Please choose a time of day.",
  ),
  note: optionalText(2000),
  // Honeypot: hidden from people, filled in by bots.
  company: z.string().max(0).optional(),
});

export type NewBooking = Omit<z.infer<typeof bookingSchema>, "company">;

export type BookingFilter = "open" | "done" | "all";

const OPEN: BookingStatus[] = ["NEW", "CONFIRMED"];
const DONE: BookingStatus[] = ["COMPLETED", "CANCELLED"];

export class BookingService {
  constructor(
    private readonly db: PrismaClient,
    private readonly notifier: BookingNotifier,
    private readonly submissions: RateLimiter,
  ) {}

  /** Public booking form. Returns the saved booking, or null for a silently-dropped bot submission. */
  async submit(input: Record<string, unknown>, ip: string): Promise<NewBooking | null> {
    const parsed = bookingSchema.safeParse(input);
    if (!parsed.success) {
      // A filled honeypot gets a quiet "success" so bots learn nothing.
      if (parsed.error.issues.some((issue) => issue.path[0] === "company")) return null;
      throw new ValidationError(parsed.error.issues[0]?.message ?? "Please check the form and try again.");
    }
    if (await this.submissions.isLimited(ip)) {
      throw new ValidationError("You've sent several requests recently. Please try again in a few minutes.");
    }

    const { name, phone, email, service, centre, preferredDate, timeOfDay, note } = parsed.data;
    const booking: NewBooking = { name, phone, email, service, centre, preferredDate, timeOfDay, note };
    await this.db.booking.create({
      data: { ...booking, preferredDate: booking.preferredDate ? new Date(`${booking.preferredDate}T00:00:00Z`) : null },
    });
    await this.submissions.hit(ip);

    try {
      await this.notifier.notify(booking);
    } catch (error) {
      // Already saved: a mail failure must not lose the booking or fail the visitor.
      console.error("Booking email notification failed", error);
    }
    return booking;
  }

  list(filter: BookingFilter) {
    const where =
      filter === "open" ? { status: { in: OPEN } } : filter === "done" ? { status: { in: DONE } } : {};
    return this.db.booking.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });
  }

  async counts() {
    const [open, done] = await Promise.all([
      this.db.booking.count({ where: { status: { in: OPEN } } }),
      this.db.booking.count({ where: { status: { in: DONE } } }),
    ]);
    return { open, done, all: open + done };
  }

  countNew() {
    return this.db.booking.count({ where: { status: "NEW" } });
  }

  findById(id: string) {
    return this.db.booking.findUnique({ where: { id } });
  }

  async setStatus(id: string, status: BookingStatus) {
    if (![...OPEN, ...DONE].includes(status)) throw new ValidationError("Invalid status.");
    const { count } = await this.db.booking.updateMany({ where: { id }, data: { status } });
    if (count === 0) throw new NotFoundError("That booking no longer exists.");
  }

  async remove(id: string) {
    const { count } = await this.db.booking.deleteMany({ where: { id } });
    if (count === 0) throw new NotFoundError("That booking no longer exists.");
  }
}
