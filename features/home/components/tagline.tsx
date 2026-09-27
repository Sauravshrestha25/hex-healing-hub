"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/features/shared/lib/gsap";

const WORDS = [
  { w: "Heal Within", c: "font-medium text-ivory" },
  { w: "Awaken", c: "font-light italic text-gold-metal" },
  { w: "Transform", c: "font-medium text-ivory" },
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
    <section ref={ref} className="relative h-[110vh] overflow-hidden text-ivory">
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        {WORDS.map(({ w, c }) => (
          <div key={w} className="overflow-hidden pb-2">
            <p className={`tg-word font-heading text-6xl uppercase leading-[1.02] tracking-tight sm:text-8xl lg:text-[7.5rem] ${c}`}>
              {w}
            </p>
          </div>
        ))}
        <p className="eyebrow mt-14">Butwal · Pokhara · Kapilvastu</p>
      </div>
    </section>
  );
}
