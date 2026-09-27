"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/features/shared/lib/data";
import { ScrollTrigger, useGSAP } from "@/features/shared/lib/gsap";

export function ServicesShowcase({ services }: { services: Service[] }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      ref
        .current!.querySelectorAll<HTMLElement>("[data-service]")
        .forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="text-ivory">
      <div className="mx-auto flex w-[90%] flex-col justify-between gap-10 border-b hairline-gold pb-16 pt-36 lg:flex-row lg:items-end">
        <div>
          <h2
            data-split
            className="mt-8 max-w-3xl font-heading text-4xl leading-[1.05] sm:text-6xl"
          >
            Six paths toward{" "}
            <span className="text-gold-light">inner balance.</span>
          </h2>
        </div>
      </div>

      <div className="mx-auto grid w-[90%] gap-20 pb-36 lg:grid-cols-[1fr_1.15fr]">
        <ol>
          {services.map((s, i) => (
            <li
              key={s.id}
              data-service
              className={`relative flex min-h-[72vh] flex-col justify-center py-16 transition-opacity duration-700 lg:pl-10 ${
                active === i ? "" : "lg:opacity-25"
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 hidden h-24 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-gold to-transparent transition-opacity duration-700 lg:block ${
                  active === i ? "opacity-100" : "opacity-0"
                }`}
              />
              <div className="relative mb-10 aspect-[4/3] overflow-hidden lg:hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="90vw"
                  className="object-cover"
                />
              </div>
              <div className="glass p-8 sm:p-12">
                <h3 className="font-heading text-4xl sm:text-5xl">
                  {s.title}
                </h3>
                <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-lavender">
                  {s.description}
                </p>
                <Link
                  href={`/services#${s.slug}`}
                  className="group mt-10 inline-flex w-fit items-center gap-3 text-sm font-medium tracking-wide text-gold-light"
                >
                  Explore {s.title}
                  <span className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-14" />
                </Link>
              </div>
            </li>
          ))}
        </ol>

        <div className="hidden lg:block">
          <div className="sticky top-[12vh] h-[76vh] overflow-hidden">
            {services.map((s, i) => (
              <div
                key={s.id}
                className={`absolute inset-0 transition-all duration-[1400ms] ease-out ${
                  active === i
                    ? "scale-100 opacity-100"
                    : "scale-[1.06] opacity-0"
                }`}
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/30" />
            <div className="pointer-events-none absolute inset-5 border hairline-gold" />
            <div className="absolute bottom-12 right-12">
              <div className="flex gap-2">
                {services.map((s, i) => (
                  <span
                    key={s.id}
                    className={`h-px transition-all duration-700 ${active === i ? "w-10 bg-gold" : "w-4 bg-ivory/30"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
