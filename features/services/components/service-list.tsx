import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/features/shared/lib/data";

export function ServiceList({ services }: { services: Service[] }) {
  return (
    <section
      id="our-services"
      aria-labelledby="offerings-title"
      className="scroll-mt-24"
    >
      <div className="mx-auto w-[90%] pb-24 pt-14 lg:pb-32 lg:pt-20">
        <div className="page-reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h2
            id="offerings-title"
            className="font-heading text-3xl text-brand-cream"
          >
            Support that meets you where you are.
          </h2>
        </div>

        <nav
          aria-label="Jump to a service"
          className="page-reveal mt-8 flex flex-wrap gap-2"
        >
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="rounded-full bg-ivory/5 px-4 py-2 text-sm text-ivory/85 transition-colors hover:bg-brand-cream hover:text-brand-purple"
            >
              {service.title}
            </Link>
          ))}
        </nav>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.id}
              id={service.slug}
              className="page-reveal card-hover-cream flex scroll-mt-28 flex-col p-3"
            >
              <Link
                href={`/services/${service.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-purple"
              >
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                <span className="font-heading text-sm text-lavender">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-heading text-xl font-semibold">
                  <Link href={`/services/${service.slug}`}>
                    {service.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-lavender">
                  {service.description}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-1 pt-6">
                  <Link
                    href={`/services/${service.slug}`}
                    aria-label={`Learn more about ${service.title}`}
                    className="inline-flex items-center gap-3 py-1 text-sm font-medium"
                  >
                    Learn more <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href={`/book?service=${service.slug}`}
                    aria-label={`Book ${service.title}`}
                    className="inline-flex items-center gap-3 py-1 text-sm text-lavender"
                  >
                    Book now <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
