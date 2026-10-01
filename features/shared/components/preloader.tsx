"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/features/shared/lib/gsap";

const SEEN_KEY = "hex-preloaded";
/** Seconds the curtain starts lifting after first paint at the earliest; the hero waits for it. */
export const PRELOADER_EXIT_DELAY = 1.3;

/**
 * Brand preloader for the first page load of a visit: a #330b36 curtain with the HEX symbol breathing,
 * the name rising in and a cream line filling as the page loads, then the curtain lifts away.
 * Later loads in the same visit skip it before paint (inline script in the site layout adds
 * `hex-preloaded` to <html>). A CSS failsafe hides it even if this script never runs.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || document.documentElement.classList.contains(SEEN_KEY)) return;

    const finish = () => {
      el.style.display = "none";
      document.documentElement.classList.add(SEEN_KEY);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Private mode: the preloader simply shows again next load.
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.to(el, { opacity: 0, duration: 0.4, delay: 0.3, onComplete: finish });
      return;
    }

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(".pl-mark", { opacity: 0, scale: 0.85, duration: 0.8 })
        .from(".pl-name", { opacity: 0, y: 14, duration: 0.7 }, "-=0.45")
        .to(".pl-bar", { scaleX: 0.7, duration: 0.9, ease: "power2.out" }, "-=0.6");

      // Lift once the page has loaded (or after a cap, so a slow image never holds the visitor).
      let lifted = false;
      const lift = () => {
        if (lifted) return;
        lifted = true;
        gsap
          .timeline({ delay: Math.max(0, PRELOADER_EXIT_DELAY - intro.time()), onComplete: finish })
          .to(".pl-bar", { scaleX: 1, duration: 0.35, ease: "power2.inOut" })
          .to(".pl-content", { opacity: 0, y: -16, duration: 0.45, ease: "power2.in" }, "+=0.05")
          .to(el, { yPercent: -100, duration: 0.95, ease: "power4.inOut" }, "-=0.15");
      };
      if (document.readyState === "complete") lift();
      else window.addEventListener("load", lift, { once: true });
      gsap.delayedCall(2.4, lift);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} data-preloader aria-hidden="true" className="preloader fixed inset-0 z-[100] grid place-items-center bg-brand-purple text-brand-cream">
      <div className="pl-content flex flex-col items-center">
        <Image src="/images/hex-mark.svg" alt="" width={84} height={84} priority className="pl-mark preloader-breathe size-20" />
        <p className="pl-name mt-6 font-heading text-lg tracking-[0.35em] uppercase">HEX Healing Hub</p>
        <span className="mt-6 block h-px w-40 overflow-hidden bg-brand-cream/20">
          <span className="pl-bar block h-full w-full origin-left scale-x-0 bg-brand-cream" />
        </span>
      </div>
    </div>
  );
}
