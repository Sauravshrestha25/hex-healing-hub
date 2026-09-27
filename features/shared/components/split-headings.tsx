"use client";

import { gsap, SplitText, useGSAP } from "@/features/shared/lib/gsap";

/** Masked line-by-line reveal for every element marked `data-split` on the page. */
export function SplitHeadings() {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.2,
            stagger: 0.09,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }),
      });
    });
  });

  return null;
}
