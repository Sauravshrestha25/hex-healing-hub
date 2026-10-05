import Image from "next/image";
import Link from "next/link";
import { formatRupees } from "@/features/healers/lib/slots";
import type { HealerCard as Healer } from "@/features/shared/lib/data";

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]!.toUpperCase()).join("");

/** "★ 4.8 (12)": the average of published reviews; nothing until there is one. */
export function HealerRating({ rating, count, className = "" }: { rating: number | null; count: number; className?: string }) {
  if (rating === null) return null;
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`Rated ${rating} out of 5 from ${count} ${count === 1 ? "review" : "reviews"}`}>
      <span aria-hidden="true">★</span>
      <span aria-hidden="true">
        {rating.toFixed(1)} ({count})
      </span>
    </span>
  );
}

/**
 * A healer on a card. `offer` replaces the "from" price with the exact price and length for one
 * service (service pages) and carries that service into the booking link.
 */
export function HealerCard({ healer, offer }: { healer: Healer; offer?: { price: number; durationMinutes: number; serviceSlug: string } }) {
  const href = `/healers/${healer.slug}`;
  return (
    <article className="page-reveal h-full">
      <div className="card-hover-cream group flex h-full flex-col p-3">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-brand-purple">
          {healer.photo ? (
            <Image
              src={healer.photo}
              alt=""
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
            />
          ) : (
            <span className="grid h-full place-items-center font-heading text-6xl text-brand-cream">{initials(healer.name)}</span>
          )}
        </Link>
        <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
          <h3 className="font-heading text-xl font-semibold">
            <Link href={href}>{healer.name}</Link>
          </h3>
          <p className="mt-1 text-sm text-lavender">{healer.title}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <HealerRating rating={healer.rating} count={healer.reviewCount} />
            {healer.experienceYears > 0 && (
              <span>
                {healer.experienceYears} {healer.experienceYears === 1 ? "year" : "years"}
              </span>
            )}
            <span className="text-lavender">{healer.places.join(" · ")}</span>
          </p>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
            <p className="text-sm">
              {offer ? (
                <>
                  <span className="block font-heading text-lg">{formatRupees(offer.price)}</span>
                  <span className="text-lavender">{offer.durationMinutes} min session</span>
                </>
              ) : healer.fromPrice !== null ? (
                <>
                  <span className="text-lavender">from </span>
                  <span className="font-heading text-lg">{formatRupees(healer.fromPrice)}</span>
                </>
              ) : null}
            </p>
            <Link
              href={offer ? `${href}?service=${offer.serviceSlug}#book` : `${href}#book`}
              aria-label={`Book with ${healer.name}`}
              className="btn-gold rounded-full px-5 py-2.5 text-sm font-medium"
            >
              Book
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
