import "server-only";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import type { ImageJanitor } from "@/features/content/server/image-janitor.service";
import { imageField, orderField, parseOrThrow, withUniqueGuard } from "@/features/content/server/validation";
import { bookableDates, isDateString, nepalDate, nepalInstant, nepalMinuteOfDay, freeSlotStarts, weekdayOf, type MinuteRange } from "@/features/healers/lib/slots";
import { BOOKING_PLACES, type HealerCard, type HealerProfile } from "@/features/shared/lib/data";
import { slugify } from "@/features/shared/lib/slugify";
import { NotFoundError, ValidationError } from "@/features/shared/server/errors";
import { findFreeSlots, HOLDING_STATUSES } from "./slot-finder";

const healerSchema = z
  .object({
    name: z.string().trim().min(1, "Add the healer's name.").max(120),
    slug: z.string().trim().max(80).optional(),
    title: z.string().trim().min(1, "Add a speciality line.").max(160),
    // Browsers submit textarea line breaks as \r\n; store plain \n so paragraphs split reliably.
    bio: z.string().max(4000).transform((v) => v.replace(/\r\n?/g, "\n").trim()).pipe(z.string().min(1, "Add a short bio.")),
    photo: z.union([z.literal("").transform(() => null), imageField]).optional().transform((v) => v ?? null),
    experienceYears: z.coerce.number().int().min(0, "Experience can't be negative.").max(80).default(0),
    qualifications: z.string().max(2000).default("").transform((v) => v.replace(/\r\n?/g, "\n").trim()),
    languages: z.string().trim().max(200).default(""),
    places: z.array(z.enum(BOOKING_PLACES)).min(1, "Choose at least one place this healer works (a centre or Online)."),
    // Switch: present ("on") when ticked, absent otherwise.
    published: z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean()),
    order: orderField,
    services: z.array(
      z.object({
        serviceId: z.string().min(1),
        price: z.coerce.number().int("Prices are whole rupees.").min(0, "A price can't be negative.").max(1_000_000),
        durationMinutes: z.coerce.number().int().min(15, "Sessions are at least 15 minutes.").max(480, "Sessions are at most 8 hours."),
      }),
    ),
    availability: z.array(
      z
        .object({ weekday: z.number().int().min(0).max(6), startMinute: z.number().int().min(0), endMinute: z.number().int().max(24 * 60) })
        .refine((day) => day.startMinute < day.endMinute, "A working day must end after it starts."),
    ),
    timeOff: z.array(z.string().refine(isDateString, "Days off must be valid dates.")),
  })
  .refine((h) => !h.published || h.services.length > 0, "Add at least one service with a price before publishing.")
  .refine((h) => !h.published || h.availability.length > 0, "Add at least one working day before publishing.");

export type HealerInput = z.input<typeof healerSchema>;

const average = (ratings: number[]) => (ratings.length ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : null);
const splitList = (text: string, separator: RegExp) => text.split(separator).map((part) => part.trim()).filter(Boolean);

const cardSelect = {
  id: true,
  name: true,
  slug: true,
  title: true,
  photo: true,
  experienceYears: true,
  places: true,
  services: { select: { price: true, service: { select: { title: true, order: true } } } },
  testimonials: { where: { published: true }, select: { rating: true } },
} as const;

type CardRow = {
  id: string;
  name: string;
  slug: string;
  title: string;
  photo: string | null;
  experienceYears: number;
  places: string[];
  services: { price: number; service: { title: string; order: number } }[];
  testimonials: { rating: number }[];
};

function toCard(row: CardRow): HealerCard {
  const services = [...row.services].sort((a, b) => a.service.order - b.service.order);
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    title: row.title,
    photo: row.photo,
    experienceYears: row.experienceYears,
    places: row.places,
    fromPrice: services.length ? Math.min(...services.map((s) => s.price)) : null,
    rating: average(row.testimonials.map((t) => t.rating)),
    reviewCount: row.testimonials.length,
    services: services.map((s) => s.service.title),
  };
}

/** The "Our Healers" module: profiles, what each offers and charges, when they work, and free slots. */
export class HealerService {
  constructor(
    private readonly db: PrismaClient,
    private readonly images: ImageJanitor,
  ) {}

  // ---- Public site ----

  async listPublished(): Promise<HealerCard[]> {
    const rows = await this.db.healer.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: cardSelect,
    });
    return rows.map(toCard);
  }

  /** Published healers offering one service, with their price and session length for it. */
  async listForService(serviceId: string) {
    const rows = await this.db.healer.findMany({
      where: { published: true, services: { some: { serviceId } } },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { ...cardSelect, services: { select: { serviceId: true, price: true, durationMinutes: true, service: { select: { title: true, order: true } } } } },
    });
    return rows.map((row) => {
      const offering = row.services.find((s) => s.serviceId === serviceId)!;
      return { ...toCard(row), price: offering.price, durationMinutes: offering.durationMinutes };
    });
  }

  async findPublishedBySlug(slug: string): Promise<HealerProfile | null> {
    const row = await this.db.healer.findFirst({
      where: { slug, published: true },
      select: {
        ...cardSelect,
        bio: true,
        qualifications: true,
        languages: true,
        services: {
          select: { serviceId: true, price: true, durationMinutes: true, service: { select: { title: true, slug: true, order: true } } },
        },
        availability: { orderBy: { weekday: "asc" }, select: { weekday: true, startMinute: true, endMinute: true } },
        testimonials: {
          where: { published: true },
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
          select: { id: true, name: true, quote: true, photo: true, service: true, centre: true, rating: true },
        },
        _count: { select: { bookings: { where: { status: "COMPLETED" } } } },
      },
    });
    if (!row) return null;
    const offerings = [...row.services]
      .sort((a, b) => a.service.order - b.service.order)
      .map((s) => ({ serviceId: s.serviceId, title: s.service.title, slug: s.service.slug, price: s.price, durationMinutes: s.durationMinutes }));
    return {
      ...toCard(row),
      bio: row.bio,
      qualifications: splitList(row.qualifications, /\n+/),
      languages: splitList(row.languages, /,+/),
      offerings,
      hours: row.availability,
      reviews: row.testimonials,
      sessionsCompleted: row._count.bookings,
    };
  }

  /** Free start times (minutes from Nepal midnight) for a healer, service and day. */
  async slots(healerId: string, serviceId: string, date: string) {
    return (await findFreeSlots(this.db, healerId, serviceId, date))?.starts ?? [];
  }

  /** Days in the booking window that still have at least one free slot for this healer and service. */
  async availableDates(healerId: string, serviceId: string) {
    const dates = bookableDates();
    const healer = await this.db.healer.findFirst({
      where: { id: healerId, published: true },
      select: {
        services: { where: { serviceId }, select: { durationMinutes: true } },
        availability: { select: { weekday: true, startMinute: true, endMinute: true } },
        timeOff: { select: { date: true } },
        bookings: {
          where: {
            status: { in: [...HOLDING_STATUSES] },
            startsAt: { gte: nepalInstant(dates[0]!, 0), lt: nepalInstant(dates.at(-1)!, 24 * 60) },
          },
          select: { startsAt: true, durationMinutes: true },
        },
      },
    });
    const duration = healer?.services[0]?.durationMinutes;
    if (!healer || !duration) return [];

    const off = new Set(healer.timeOff.map((t) => t.date.toISOString().slice(0, 10)));
    const busyByDate = new Map<string, MinuteRange[]>();
    for (const booking of healer.bookings) {
      if (!booking.startsAt) continue;
      const start = nepalMinuteOfDay(booking.startsAt);
      const day = nepalDate(booking.startsAt);
      busyByDate.set(day, [...(busyByDate.get(day) ?? []), { start, end: start + (booking.durationMinutes ?? 60) }]);
    }
    return dates.filter((date) => {
      const window = healer.availability.find((a) => a.weekday === weekdayOf(date));
      if (!window || off.has(date)) return false;
      return freeSlotStarts({ start: window.startMinute, end: window.endMinute }, duration, busyByDate.get(date) ?? []).length > 0;
    });
  }

  // ---- Dashboard ----

  listForAdmin() {
    return this.db.healer.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, title: true, photo: true, published: true, order: true, places: true, _count: { select: { services: true } } },
    });
  }

  /** Names for pickers (testimonial form). */
  listNames() {
    return this.db.healer.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true, name: true } });
  }

  findById(id: string) {
    return this.db.healer.findUnique({
      where: { id },
      include: { services: true, availability: true, timeOff: { orderBy: { date: "asc" } } },
    });
  }

  count() {
    return this.db.healer.count();
  }

  async save(id: string | undefined, input: unknown) {
    const { services, availability, timeOff, slug: rawSlug, ...fields } = parseOrThrow(healerSchema, input);
    const slug = slugify(rawSlug || fields.name);
    if (!slug) throw new ValidationError("Add a name or URL with letters or numbers.");

    const previous = id ? await this.db.healer.findUnique({ where: { id }, select: { photo: true } }) : null;
    if (id && !previous) throw new NotFoundError("That healer no longer exists.");

    const today = nepalDate(new Date());
    const relations = {
      services: { create: services },
      availability: { create: availability },
      // Past days off no longer matter; drop them and any duplicates.
      timeOff: { create: [...new Set(timeOff)].filter((date) => date >= today).map((date) => ({ date: new Date(`${date}T00:00:00Z`) })) },
    };
    const data = { ...fields, slug };

    await withUniqueGuard(async () => {
      if (id) {
        await this.db.$transaction([
          this.db.healerService.deleteMany({ where: { healerId: id } }),
          this.db.healerAvailability.deleteMany({ where: { healerId: id } }),
          this.db.healerTimeOff.deleteMany({ where: { healerId: id } }),
          this.db.healer.update({ where: { id }, data: { ...data, ...relations } }),
        ]);
      } else {
        await this.db.healer.create({ data: { ...data, ...relations } });
      }
    }, "Another healer already uses that URL.");
    if (previous?.photo && previous.photo !== data.photo) await this.images.release([previous.photo]);
  }

  async remove(id: string) {
    const healer = await this.db.healer.findUnique({ where: { id }, select: { photo: true } });
    const { count } = await this.db.healer.deleteMany({ where: { id } });
    if (count === 0 || !healer) throw new NotFoundError("That healer no longer exists.");
    if (healer.photo) await this.images.release([healer.photo]);
  }
}
