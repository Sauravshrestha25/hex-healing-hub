"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/features/shared/lib/gsap";

const WORDS = [
  { w: "Heal Within", c: "font-medium text-brand-purple" },
  { w: "Awaken", c: "text-gold-light" },
  { w: "Transform", c: "font-medium text-brand-purple" },
];

export function Tagline() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".tg-word", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 65%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative h-[110vh] overflow-hidden text-brand-purple bg-brand-cream"
    >
      <div className="relative mx-auto flex h-full text-brand-purple w-[90%] flex-col items-start justify-center text-left">
        {WORDS.map(({ w, c }) => (
          <div key={w} className="overflow-hidden pb-2">
            <p
              className={`tg-word font-heading text-[2.6rem] text-brand-purple uppercase min-[380px]:text-5xl leading-[1.02] tracking-tight sm:text-8xl lg:text-[7.5rem] ${c}`}
            >
              {w}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
