import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/features/shared/lib/data";

export function ServiceList({ services }: { services: Service[] }) {
  return (
    <section id="our-services" aria-labelledby="offerings-title" className="scroll-mt-24 border-t hairline-gold">
      <div className="mx-auto w-[90%] py-20 lg:py-28">
        <div className="page-reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h2 id="offerings-title" className="mt-6 font-heading text-3xl sm:text-4xl">Support that meets you <span className="text-gold-light">where you are.</span></h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-lavender">Choose a practice below, or get in touch if you would like help exploring the options.</p>
        </div>
        <nav aria-label="Jump to a service" className="page-reveal mt-10 flex flex-wrap gap-3">
          {services.map(service => (
            <Link key={service.id} href={`/services/${service.slug}`} className="rounded-full border border-gold/25 px-4 py-2.5 text-xs text-ivory/80 transition-colors hover:border-gold hover:text-gold-light">{service.title}</Link>
          ))}
        </nav>
        <div className="mt-14 grid gap-x-12 gap-y-16 md:grid-cols-2 lg:gap-x-20 lg:gap-y-24">
          {services.map((service, index) => (
            <article key={service.id} id={service.slug} className="page-reveal scroll-mt-28">
              <Link href={`/services/${service.slug}`} tabIndex={-1} aria-hidden="true" className="group relative block aspect-[3/2] overflow-hidden bg-purple">
                <Image src={service.image} alt="" fill sizes="(min-width: 768px) 43vw, 90vw" className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-ink/60 font-heading text-xs text-gold-light backdrop-blur-sm">{String(index + 1).padStart(2, "0")}</span>
              </Link>
              <div className="border-b hairline-gold pb-7 pt-7">
                <h3 className="font-heading text-2xl font-semibold sm:text-3xl">
                  <Link href={`/services/${service.slug}`} className="hover:text-gold-light">{service.title}</Link>
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-loose text-lavender sm:text-base">{service.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2">
                  <Link href={`/services/${service.slug}`} aria-label={`Learn more about ${service.title}`} className="inline-flex items-center gap-4 py-2 text-sm text-gold-light transition-colors hover:text-white">
                    Learn More <span aria-hidden="true">→</span>
                  </Link>
                  <Link href="/contact" aria-label={`Ask about ${service.title}`} className="inline-flex items-center gap-4 py-2 text-sm text-ivory/70 transition-colors hover:text-white">
                    Ask About This Practice <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="page-reveal mt-16 max-w-3xl border-l border-gold/40 pl-6 text-sm leading-relaxed text-lavender">
          Our services are complementary and supportive. They do not replace professional medical or
          psychological care, and individual experiences vary. Please seek appropriate professional care when needed.
        </p>
      </div>
    </section>
  );
}
