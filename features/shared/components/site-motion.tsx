"use client";

import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/features/shared/lib/gsap";

const EASE = "power3.out";

/**
 * One motion language for every public page, re-applied on each navigation:
 * - section and page titles rise line by line from behind a mask;
 * - blocks marked `.page-reveal` drift up and fade in, staggered as they enter together;
 * - card images settle from a slight zoom; `[data-parallax]` layers drift with the scroll.
 * Elements inside `[data-motion="own"]` run their own animation and are left alone.
 * Everything is skipped for visitors who prefer reduced motion.
 */
export function SiteMotion() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const main = document.querySelector("main");
        if (!main) return;
        const own = (el: Element) => !el.closest('[data-motion="own"]');

        // Titles: masked line reveal.
        gsap.utils
          .toArray<HTMLElement>(main.querySelectorAll("h1, h2:not(.sr-only)"))
          .filter(own)
          .forEach((el) => {
            SplitText.create(el, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 105,
                  duration: 1.1,
                  stagger: 0.08,
                  ease: "power4.out",
                  scrollTrigger: { trigger: el, start: "top 90%", once: true },
                }),
            });
          });

        // Content blocks: fade and rise, staggered per batch entering together.
        const blocks = gsap.utils.toArray<HTMLElement>(main.querySelectorAll(".page-reveal")).filter(own);
        gsap.set(blocks, { opacity: 0, y: 32 });
        ScrollTrigger.batch(blocks, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: EASE, stagger: 0.09, overwrite: true, clearProps: "transform" }),
        });

        // Card images: settle from a slight zoom (cleared afterwards so CSS hover zoom still works).
        gsap.utils
          .toArray<HTMLElement>(main.querySelectorAll(".card-hover-cream img, .card-plain img, [data-reveal-image] img"))
          .filter(own)
          .forEach((img) => {
            gsap.from(img, {
              scale: 1.12,
              duration: 1.6,
              ease: EASE,
              clearProps: "transform",
              scrollTrigger: { trigger: img, start: "top 95%", once: true },
            });
          });

        // Parallax layers (hero photos): a gentle drift tied to scroll position.
        gsap.utils
          .toArray<HTMLElement>(main.querySelectorAll("[data-parallax]"))
          .filter(own)
          .forEach((layer) => {
            gsap.fromTo(
              layer,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: { trigger: layer.parentElement ?? layer, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          });

        ScrollTrigger.refresh();
      });
      return () => media.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
