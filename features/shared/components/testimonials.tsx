import Image from "next/image";
import type { Testimonial } from "@/features/shared/lib/data";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]!.toUpperCase()).join("");
}

/** Visitor testimonials (managed in the dashboard). Renders nothing until at least one is published. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-title">
      <div className="mx-auto w-[90%] py-24 lg:py-32">
        <h2 id="testimonials-title" className="page-reveal max-w-2xl font-heading text-3xl leading-tight text-brand-cream">
          In their words.
        </h2>
        <ul className="mt-12 gap-5 md:columns-2 lg:columns-3">
          {items.map((item) => (
            <li key={item.id} className="page-reveal card-plain mb-5 flex break-inside-avoid flex-col p-7">
              <p className="text-brand-cream" aria-label={`${item.rating} out of 5 stars`}>
                <span aria-hidden="true" className="tracking-[0.2em]">
                  {"★".repeat(item.rating)}
                  <span className="opacity-25">{"★".repeat(5 - item.rating)}</span>
                </span>
              </p>
              <blockquote className="mt-5 text-lg leading-relaxed text-ivory/90">“{item.quote}”</blockquote>
              <div className="mt-7 flex items-center gap-3">
                {item.photo ? (
                  <Image src={item.photo} alt="" width={48} height={48} className="size-12 rounded-full object-cover" />
                ) : (
                  <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-brand-cream font-heading text-base text-brand-purple">
                    {initials(item.name)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-heading text-lg">{item.name}</p>
                  {(item.service || item.centre) && (
                    <p className="truncate text-sm text-lavender">{[item.service, item.centre].filter(Boolean).join(" · ")}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
