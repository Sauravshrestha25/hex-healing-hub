"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/features/shared/lib/data";

export function ServicesShowcase({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);

  return (
    <section className="text-ivory">
      <div className="mx-auto grid w-[90%] grid-cols-1 items-start gap-14 py-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20 lg:py-40">
        <div className="glass p-8 sm:p-12">
          <h2 data-split className="max-w-xl font-heading text-4xl leading-[1.05] sm:text-5xl">
            Six paths toward <span className="text-gold-light">inner balance.</span>
          </h2>

          <ul className="mt-12 border-t hairline-gold">
            {services.map((s, i) => {
              const isActive = active === i;
              return (
                <li
                  key={s.id}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="border-b hairline-gold"
                >
                  <Link href={`/services#${s.slug}`} className="flex items-center gap-5 py-5">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden lg:hidden">
                      <Image src={s.image} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block font-heading text-2xl transition-colors duration-300 sm:text-3xl ${
                          isActive ? "lg:text-gold-light" : "lg:text-ivory/60"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span
                        className={`grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out ${
                          isActive ? "lg:grid-rows-[1fr]" : "lg:grid-rows-[0fr]"
                        }`}
                      >
                        <span className="overflow-hidden">
                          <span className="block pt-2 text-sm leading-relaxed text-lavender sm:text-base">
                            {s.description}
                          </span>
                        </span>
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`hidden text-gold transition-all duration-300 lg:block ${
                        isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                      }`}
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/services"
            className="mt-10 inline-block text-sm text-gold-light underline decoration-gold/40 underline-offset-8 transition-colors hover:text-ivory"
          >
            See all services
          </Link>
        </div>

        <div className="hidden lg:sticky lg:top-28 lg:block">
          <div className="relative aspect-[4/5] overflow-hidden">
            {services.map((s, i) => (
              <div
                key={s.id}
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  active === i ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                }`}
              >
                <Image src={s.image} alt={s.title} fill sizes="45vw" className="object-cover" />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-5 border hairline-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}
