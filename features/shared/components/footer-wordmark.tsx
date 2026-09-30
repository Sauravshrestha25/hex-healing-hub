"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/features/shared/lib/gsap";

const WORDMARK = "HEX HEALING HUB";

/** Oversized footer wordmark: letters rise into place, one after another, when the footer scrolls in. */
export function FooterWordmark() {
  const root = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".wordmark-char", {
          yPercent: 110,
          opacity: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.045,
          scrollTrigger: {
            trigger: root.current,
            start: "top 95%",
            once: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    // Scales with the viewport (the container is 90vw), so it spans the full width at every size.
    // overflow-clip masks the letters while they rise from below the baseline.
    <p
      ref={root}
      aria-hidden="true"
      className="mt-16 select-none overflow-clip whitespace-nowrap font-heading text-[9.45vw] font-semibold leading-[0.9] tracking-tight text-brand-cream"
    >
      {[...WORDMARK].map((char, index) => (
        <span key={index} className="wordmark-char inline-block">
          {char === " " ? " " : char}
        </span>
      ))}
    </p>
  );
}
