import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHealer } from "@/features/content/server/queries";
import { HealerBooking } from "@/features/healers/components/healer-booking";
import { HealerRating } from "@/features/healers/components/healer-card";
import { formatMinute, formatRupees, WEEKDAYS } from "@/features/healers/lib/slots";
import { PageMotion } from "@/features/shared/components/page-motion";

export async function generateMetadata(props: PageProps<"/healers/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const healer = await getHealer(slug);
  if (!healer) return {};
  return { title: healer.name, description: `${healer.title}. ${healer.bio.slice(0, 140)}` };
}

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]!.toUpperCase()).join("");

export default async function HealerPage(props: PageProps<"/healers/[slug]">) {
  const [{ slug }, { service }] = await Promise.all([props.params, props.searchParams]);
  const healer = await getHealer(slug);
  if (!healer) notFound();

  const firstName = healer.name.split(/\s+/)[0];
  // ?service=<slug> (from a service page) preselects that service in the booking form.
  const preselected = healer.offerings.find((o) => o.slug === service)?.serviceId;
  const facts = [
    healer.experienceYears > 0 && { label: "Experience", value: `${healer.experienceYears} ${healer.experienceYears === 1 ? "year" : "years"}` },
    healer.sessionsCompleted > 0 && { label: "Sessions completed", value: String(healer.sessionsCompleted) },
    healer.languages.length > 0 && { label: "Languages", value: healer.languages.join(", ") },
    { label: "Sessions", value: healer.places.map((p) => (p === "Online" ? "Online" : p)).join(" · ") },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <PageMotion>
      <article>
        {/* Profile */}
        <header className="mx-auto grid w-[90%] items-start gap-10 pt-32 pb-20 sm:pt-40 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:pb-28">
          <div className="page-reveal relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-brand-cream">
            {healer.photo ? (
              <Image src={healer.photo} alt={`Portrait of ${healer.name}`} fill preload sizes="(min-width: 1024px) 36vw, 90vw" className="object-cover" />
            ) : (
              <span aria-hidden="true" className="grid h-full place-items-center font-heading text-8xl text-brand-purple">
                {initials(healer.name)}
              </span>
            )}
          </div>
          <div className="page-reveal">
            <Link href="/healers" className="inline-flex items-center gap-3 py-2 text-sm text-lavender transition-colors hover:text-brand-cream">
              <span aria-hidden="true">←</span> Our Healers
            </Link>
            <h1 className="mt-4 font-heading text-4xl leading-tight font-semibold tracking-tight text-brand-cream sm:text-5xl">{healer.name}</h1>
            <p className="mt-3 text-lg text-ivory/90">{healer.title}</p>
            <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-base text-brand-cream">
              <HealerRating rating={healer.rating} count={healer.reviewCount} />
              {healer.fromPrice !== null && <span>from {formatRupees(healer.fromPrice)}</span>}
            </p>

            <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-sm text-lavender">{fact.label}</dt>
                  <dd className="mt-1 font-heading text-lg text-brand-cream">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 grid gap-4 text-base leading-relaxed text-ivory/85">
              {healer.bio.split(/(?:\r?\n){2,}/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <a href="#book" className="btn-gold mt-9 inline-flex rounded-full px-7 py-4 text-sm font-medium">
              Book with {firstName}
            </a>
          </div>
        </header>

        {/* Services and pricing */}
        <section aria-labelledby="pricing-title" className="mx-auto w-[90%] pb-20 lg:pb-28">
          <h2 id="pricing-title" className="page-reveal font-heading text-3xl text-brand-cream">
            Services and pricing
          </h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {healer.offerings.map((offering) => (
              <li key={offering.serviceId} className="page-reveal card-plain flex flex-col p-7">
                <h3 className="font-heading text-xl font-semibold">{offering.title}</h3>
                <p className="mt-2 text-sm text-lavender">{offering.durationMinutes} minute session</p>
                <p className="mt-6 font-heading text-2xl">{formatRupees(offering.price)}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                  <Link href={`/healers/${healer.slug}?service=${offering.slug}#book`} className="btn-gold rounded-full px-5 py-2.5 text-sm font-medium">
                    Book
                  </Link>
                  <Link href={`/services/${offering.slug}`} className="text-sm underline decoration-brand-purple/30 underline-offset-8">
                    About this service
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Availability and training */}
        <section aria-label="Availability and training" className="mx-auto grid w-[90%] gap-12 pb-20 lg:grid-cols-2 lg:gap-16 lg:pb-28">
          <div className="page-reveal">
            <h2 className="font-heading text-3xl text-brand-cream">Availability</h2>
            <dl className="mt-8 grid gap-3">
              {WEEKDAYS.map((label, weekday) => {
                const hours = healer.hours.find((h) => h.weekday === weekday);
                return (
                  <div key={label} className="flex items-baseline justify-between gap-6 border-b border-ivory/10 pb-3 text-base">
                    <dt className={hours ? "text-ivory" : "text-lavender"}>{label}</dt>
                    <dd className={hours ? "text-brand-cream" : "text-lavender"}>
                      {hours ? `${formatMinute(hours.startMinute)} – ${formatMinute(hours.endMinute)}` : "Not available"}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-4 text-sm text-lavender">Nepal time. Free time slots are shown when you book.</p>
          </div>
          {healer.qualifications.length > 0 && (
            <div className="page-reveal">
              <h2 className="font-heading text-3xl text-brand-cream">Qualifications and training</h2>
              <ul className="mt-8 grid gap-3">
                {healer.qualifications.map((item) => (
                  <li key={item} className="flex gap-3 border-b border-ivory/10 pb-3 text-base text-ivory/90">
                    <span aria-hidden="true" className="text-brand-cream">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Reviews */}
        {healer.reviews.length > 0 && (
          <section aria-labelledby="reviews-title" className="mx-auto w-[90%] pb-20 lg:pb-28">
            <div className="page-reveal flex flex-wrap items-end justify-between gap-4">
              <h2 id="reviews-title" className="font-heading text-3xl text-brand-cream">
                Reviews
              </h2>
              <HealerRating rating={healer.rating} count={healer.reviewCount} className="text-lg text-brand-cream" />
            </div>
            <ul className="mt-10 gap-5 md:columns-2 lg:columns-3">
              {healer.reviews.map((review) => (
                <li key={review.id} className="page-reveal card-plain mb-5 flex break-inside-avoid flex-col p-7">
                  <p className="text-sm text-brand-purple" aria-label={`${review.rating} out of 5 stars`}>
                    <span aria-hidden="true">
                      {"★".repeat(review.rating)}
                      <span className="opacity-25">{"★".repeat(5 - review.rating)}</span>
                    </span>
                  </p>
                  <blockquote className="mt-4 text-base leading-relaxed">{review.quote}</blockquote>
                  <p className="mt-5 font-heading text-base">{review.name}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {/* Booking */}
      <section id="book" aria-labelledby="book-title" className="section-cream scroll-mt-20">
        <div className="mx-auto w-[90%] max-w-4xl py-20 lg:py-28">
          <div className="page-reveal mb-10 text-center">
            <h2 id="book-title" className="font-heading text-3xl leading-tight">
              Book a session with {firstName}.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-lavender">
              Choose a service and a free time. We hold it for you straight away and confirm by phone, WhatsApp or email.
            </p>
          </div>
          <div className="page-reveal">
            <HealerBooking healer={{ id: healer.id, name: healer.name, places: healer.places, offerings: healer.offerings }} preselectedServiceId={preselected} />
          </div>
        </div>
      </section>
    </PageMotion>
  );
}
