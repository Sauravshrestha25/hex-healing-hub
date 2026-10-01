import Image from "next/image";
import Link from "next/link";
import { LOCATIONS } from "@/features/shared/lib/data";

export function Community() {
  return (
    <section
      aria-labelledby="community-title"
      className="relative isolate overflow-hidden"
    >
      <Image
        src="/images/himalaya.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-ink via-ink/85 to-ink/95"
      />
      <div className="mx-auto w-[90%] py-24 lg:py-36">
        <div className="page-reveal mx-auto max-w-3xl text-center">
          <h2
            id="community-title"
            className="font-heading text-3xl leading-tight text-brand-cream"
          >
            Three places.
            <br />
            The same welcome.
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-lavender">
            Find HEX Healing Hub in Butwal, Pokhara and Kapilvastu. Connect with
            a center for details, class schedules and appointments.
          </p>
        </div>
        <ul className="page-reveal mt-14 grid gap-4 md:grid-cols-3">
          {LOCATIONS.map((location) => (
            <li
              key={location.city}
              >
              <a
                href={`tel:${location.phone}`}
                className="card-hover-cream group flex items-center justify-between gap-5 px-6 py-7 sm:px-8"
              >
                <div>
                  <h3 className="font-heading text-xl">{location.city}</h3>
                  <p className="mt-2 text-sm text-lavender">{location.phone}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="text-xl transition-transform motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className="page-reveal mt-16 text-center">
          <p className="font-heading text-2xl sm:text-3xl">
            Your next chapter can begin with a conversation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="btn-gold rounded-full px-8 py-4 text-sm font-medium"
            >
              Book a Session
            </Link>
            <Link
              href="/services"
              className="btn-ghost rounded-full px-8 py-4 text-sm font-medium"
            >
              Explore Our Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
