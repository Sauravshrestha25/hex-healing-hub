"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/features/shared/lib/gsap";

export function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".page-reveal", root.current).forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 24,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 92%", once: true },
        });
      });
    });
    return () => media.revert();
  }, { scope: root });

  return <div ref={root} className="bg-ink text-ivory">{children}</div>;
}
