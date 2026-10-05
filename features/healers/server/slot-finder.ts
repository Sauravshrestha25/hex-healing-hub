import "server-only";
import type { Prisma, PrismaClient } from "@prisma/client";
import { freeSlotStarts, isBookableDate, nepalInstant, nepalMinuteOfDay, weekdayOf, type MinuteRange } from "@/features/healers/lib/slots";

type Db = PrismaClient | Prisma.TransactionClient;

/** Bookings in these states hold their slot; cancelling frees it. */
export const HOLDING_STATUSES = ["NEW", "CONFIRMED"] as const;

/**
 * Free start times (minutes from Nepal midnight) for one healer, service and day, plus what was
 * looked up to compute them. Null when the combination can't be booked at all (unpublished healer,
 * service not offered, day off, outside the booking window).
 */
export async function findFreeSlots(db: Db, healerId: string, serviceId: string, date: string, now = new Date()) {
  if (!isBookableDate(date, now)) return null;
  const healer = await db.healer.findFirst({
    where: { id: healerId, published: true },
    select: {
      id: true,
      name: true,
      places: true,
      services: { where: { serviceId }, select: { price: true, durationMinutes: true, service: { select: { title: true } } } },
      availability: { where: { weekday: weekdayOf(date) }, select: { startMinute: true, endMinute: true } },
      timeOff: { where: { date: new Date(`${date}T00:00:00Z`) }, select: { id: true } },
    },
  });
  const offering = healer?.services[0];
  const window = healer?.availability[0];
  if (!healer || !offering || !window || healer.timeOff.length > 0) return null;

  const taken = await db.booking.findMany({
    where: {
      healerId,
      status: { in: [...HOLDING_STATUSES] },
      startsAt: { gte: nepalInstant(date, 0), lt: nepalInstant(date, 24 * 60) },
    },
    select: { startsAt: true, durationMinutes: true },
  });
  const busy: MinuteRange[] = taken.flatMap((b) => {
    if (!b.startsAt) return [];
    const start = nepalMinuteOfDay(b.startsAt);
    return [{ start, end: start + (b.durationMinutes ?? 60) }];
  });

  return {
    healer: { id: healer.id, name: healer.name, places: healer.places },
    offering: { title: offering.service.title, price: offering.price, durationMinutes: offering.durationMinutes },
    starts: freeSlotStarts({ start: window.startMinute, end: window.endMinute }, offering.durationMinutes, busy),
  };
}
