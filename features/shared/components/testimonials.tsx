import Image from "next/image";
import { GOOGLE_REVIEWS_URL, type Testimonial } from "@/features/shared/lib/data";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]!.toUpperCase()).join("");
}

/** Visitor testimonials (managed in the dashboard). Renders nothing until at least one is published. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-title">
      <div className="mx-auto w-[90%] py-20 lg:py-28">
        <div className="page-reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 id="testimonials-title" className="font-heading text-3xl leading-tight text-brand-cream">
              In their words.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-lavender">
              Real reviews from people who have sat with us, as they shared them on Google.
            </p>
          </div>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium"
          >
            Read all reviews on Google <span aria-hidden="true">↗</span>
          </a>
        </div>

        <ul className="mt-12 gap-5 md:columns-2 lg:mt-14 lg:columns-3">
          {items.map((item) => (
            <li key={item.id} className="page-reveal card-plain mb-5 flex break-inside-avoid flex-col p-7">
              <span aria-hidden="true" className="block h-7 font-heading text-6xl leading-none text-brand-purple/50">
                “
              </span>
              <blockquote className="mt-3 text-base leading-relaxed sm:text-lg">{item.quote}</blockquote>
              <div className="mt-7 flex items-center gap-3 border-t border-brand-purple/15 pt-5">
                {item.photo ? (
                  <Image src={item.photo} alt="" width={44} height={44} className="size-11 shrink-0 rounded-full object-cover" />
                ) : (
                  <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-purple font-heading text-base text-brand-cream">
                    {initials(item.name)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-heading text-base">{item.name}</p>
                  {(item.service || item.centre) && (
                    <p className="truncate text-sm text-lavender">{[item.service, item.centre].filter(Boolean).join(" · ")}</p>
                  )}
                </div>
                <p className="shrink-0 text-sm text-brand-purple" aria-label={`${item.rating} out of 5 stars`}>
                  <span aria-hidden="true">
                    {"★".repeat(item.rating)}
                    <span className="opacity-25">{"★".repeat(5 - item.rating)}</span>
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
