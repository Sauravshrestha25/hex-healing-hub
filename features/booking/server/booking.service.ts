import "server-only";
import { Prisma, type BookingStatus, type PrismaClient } from "@prisma/client";
import { randomInt } from "node:crypto";
import { z } from "zod";
import { formatMinute, isDateString, nepalInstant } from "@/features/healers/lib/slots";
import { findFreeSlots } from "@/features/healers/server/slot-finder";
import { BOOKING_PLACES, TIMES_OF_DAY } from "@/features/shared/lib/data";
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
    (v) => v === null || (BOOKING_PLACES as readonly string[]).includes(v),
    "Please choose one of our centres, or online.",
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

/** A booking with a named healer in a real time slot (the healer pages). */
const slotBookingSchema = z.object({
  healerId: z.string().min(1, "Please choose a healer."),
  serviceId: z.string().min(1, "Please choose a service."),
  date: z.string().refine(isDateString, "Please choose a date."),
  start: z.coerce.number().int().min(0).max(24 * 60),
  place: z.string().trim().min(1, "Please choose where you'd like the session.").max(40),
  name: bookingSchema.shape.name,
  phone: bookingSchema.shape.phone,
  email: bookingSchema.shape.email,
  note: optionalText(2000),
  company: z.string().max(0).optional(),
});

export type NewBooking = Omit<z.infer<typeof bookingSchema>, "company"> & {
  reference: string;
  /** Set for slot bookings with a healer. */
  healerName?: string;
  startsAt?: Date;
  durationMinutes?: number;
  price?: number;
};

// No 0/O/1/I: references get read out over the phone.
const REFERENCE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
function newReference() {
  return `HEX-${Array.from({ length: 6 }, () => REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)]).join("")}`;
}

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
    const booking: NewBooking = { name, phone, email, service, centre, preferredDate, timeOfDay, note, reference: newReference() };
    await this.db.booking.create({
      data: { ...booking, preferredDate: booking.preferredDate ? new Date(`${booking.preferredDate}T00:00:00Z`) : null },
    });
    await this.submissions.hit(ip);
    await this.notifyTeam(booking);
    return booking;
  }

  /**
   * Books a healer's time slot. The slot is held from this moment (status NEW). A per-healer database
   * lock plus a re-check inside the transaction means two people can never hold the same time.
   */
  async bookSlot(input: Record<string, unknown>, ip: string): Promise<NewBooking | null> {
    const parsed = slotBookingSchema.safeParse(input);
    if (!parsed.success) {
      if (parsed.error.issues.some((issue) => issue.path[0] === "company")) return null;
      throw new ValidationError(parsed.error.issues[0]?.message ?? "Please check the form and try again.");
    }
    if (await this.submissions.isLimited(ip)) {
      throw new ValidationError("You've sent several requests recently. Please try again in a few minutes.");
    }
    const { healerId, serviceId, date, start, place, name, phone, email, note } = parsed.data;

    const booking = await this.db.$transaction(async (tx) => {
      // Serialise bookings per healer for the length of this transaction.
      await tx.$executeRaw(Prisma.sql`SELECT pg_advisory_xact_lock(hashtext(${healerId}))`);
      const found = await findFreeSlots(tx, healerId, serviceId, date);
      if (!found) throw new ValidationError("That day can no longer be booked. Please choose another.");
      if (!found.healer.places.includes(place)) throw new ValidationError("Please choose one of the places this healer works.");
      if (!found.starts.includes(start)) {
        throw new ValidationError("Sorry, that time was just taken. Please choose another time.");
      }
      const created: NewBooking = {
        name,
        phone,
        email,
        note,
        service: found.offering.title,
        centre: place,
        preferredDate: date,
        timeOfDay: formatMinute(start),
        reference: newReference(),
        healerName: found.healer.name,
        startsAt: nepalInstant(date, start),
        durationMinutes: found.offering.durationMinutes,
        price: found.offering.price,
      };
      // The row links the healer by id; healerName travels only in the notification.
      const row = { ...created, healerId, preferredDate: new Date(`${date}T00:00:00Z`) };
      delete row.healerName;
      await tx.booking.create({ data: row });
      return created;
    });

    await this.submissions.hit(ip);
    await this.notifyTeam(booking);
    return booking;
  }

  private async notifyTeam(booking: NewBooking) {
    try {
      await this.notifier.notify(booking);
    } catch (error) {
      // Already saved: a mail failure must not lose the booking or fail the visitor.
      console.error("Booking email notification failed", error);
    }
  }

  list(filter: BookingFilter) {
    const where =
      filter === "open" ? { status: { in: OPEN } } : filter === "done" ? { status: { in: DONE } } : {};
    return this.db.booking.findMany({ where, orderBy: { createdAt: "desc" }, take: 200, include: { healer: { select: { name: true } } } });
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
    return this.db.booking.findUnique({ where: { id }, include: { healer: { select: { name: true, slug: true } } } });
  }

  async setStatus(id: string, status: BookingStatus) {
    if (![...OPEN, ...DONE].includes(status)) throw new ValidationError("Invalid status.");
    const before = await this.findById(id);
    if (!before) throw new NotFoundError("That booking no longer exists.");
    await this.db.booking.update({ where: { id }, data: { status } });

    // First time it becomes Confirmed: tell the visitor, if they left an email.
    if (status === "CONFIRMED" && before.status !== "CONFIRMED" && before.email) {
      try {
        await this.notifier.confirmToVisitor({ ...before, email: before.email, healerName: before.healer?.name ?? null });
      } catch (error) {
        console.error("Booking confirmation email failed", error);
      }
    }
  }

  async remove(id: string) {
    const { count } = await this.db.booking.deleteMany({ where: { id } });
    if (count === 0) throw new NotFoundError("That booking no longer exists.");
  }
}
