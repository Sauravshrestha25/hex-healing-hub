import Image from "next/image";
import { LOCATIONS, CONTACT_EMAIL } from "@/features/shared/lib/data";
import { Reveal } from "@/features/shared/components/reveal";

export function Centers() {
  return (
    <section className="text-ivory">
      <div className="mx-auto grid w-[90%] grid-cols-1 items-center gap-16 py-36 lg:grid-cols-[0.85fr_1.15fr] lg:gap-28">
        <Reveal>
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="/images/prayer-flags.jpg"
              alt="Prayer flags over the hills of Nepal"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <div className="pointer-events-none absolute inset-5 border hairline-gold" />
          </div>
        </Reveal>

        <Reveal className="glass p-8 sm:p-14">
          <h2 data-split className="mt-8 font-heading text-4xl leading-[1.05] sm:text-6xl">
            Three homes <span className="text-gold-light">across Nepal.</span>
          </h2>
          <ul className="mt-16 border-t hairline-gold">
            {LOCATIONS.map((l) => (
              <li key={l.city}>
                <a
                  href={`tel:${l.phone}`}
                  className="group flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b hairline-gold py-8"
                >
                  <span className="flex items-baseline gap-6">
                    <span className="font-heading text-3xl transition-colors duration-500 group-hover:text-gold-light sm:text-4xl">
                      {l.city}
                    </span>
                  </span>
                  <span className="flex items-center gap-4 text-sm font-light tracking-wide text-lavender transition-colors duration-500 group-hover:text-gold-light">
                    {l.phone}
                    <span className="h-px w-6 bg-gold transition-all duration-500 group-hover:w-10" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="break-all mt-10 inline-block text-sm font-light tracking-wide text-lavender transition-colors hover:text-gold-light"
          >
            {CONTACT_EMAIL}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
