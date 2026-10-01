"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, SplitText, useGSAP } from "@/features/shared/lib/gsap";
import { PRELOADER_EXIT_DELAY } from "@/features/shared/components/preloader";

/**
 * Home hero: an oversized, editorial headline over the singing-bowl film, with the promise and the
 * two ways in centred at the bottom. On scroll the headline lines drift apart and the film settles
 * into a rounded frame. Reduced motion drops the choreography.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current!;
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const preloading = !document.documentElement.classList.contains("hex-preloaded") && document.querySelector("[data-preloader]");
        const lines = SplitText.create(".hero-line", { type: "words", mask: "words" });
        // Give each word's mask room for descenders (the tail of the "y"), so the reveal never clips them.
        (lines.masks as HTMLElement[]).forEach((mask) => {
          mask.style.paddingBottom = "0.2em";
          mask.style.marginBottom = "-0.2em";
        });

        gsap
          .timeline({ delay: preloading ? PRELOADER_EXIT_DELAY + 0.9 : 0.1, defaults: { ease: "power4.out" } })
          .from(".hero-film", { scale: 1.18, duration: 2.2, ease: "expo.out" })
          .from(lines.words, { yPercent: 115, duration: 1.3, stagger: 0.09 }, "<0.15")
          .from(".hero-bar > *", { opacity: 0, y: 20, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=0.8");

        // Scroll: the two lines part ways, the film settles into a rounded frame.
        gsap
          .timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.5 } })
          .to(".hero-line-a", { xPercent: -18, opacity: 0, ease: "none" }, 0)
          .to(".hero-line-b", { xPercent: 18, opacity: 0, ease: "none" }, 0)
          .to(".hero-bar", { opacity: 0, y: -30, ease: "none" }, 0)
          .to(".hero-frame", { scale: 0.88, borderRadius: 48, ease: "none" }, 0);

        return () => lines.revert();
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-motion="own"
      aria-labelledby="hero-title"
      className="relative isolate h-svh min-h-[640px] overflow-hidden bg-brand-purple text-brand-cream"
    >
      {/* The film, framed so it can settle into a rounded card on scroll. */}
      <div aria-hidden="true" className="hero-frame absolute inset-0 overflow-hidden">
        <video
          className="hero-film absolute inset-0 size-full object-cover"
          src="/videos/healing-panel.mp4"
          poster="/videos/healing-panel-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-brand-purple/55" />
      </div>

      {/*
        Headline, composed like a poster: one block whose width is capped by both the screen width and
        the screen height, with every size inside it in container units (cqw, % of the block's width).
        The composition is therefore identical at any width or zoom level, and on short screens it
        shrinks rather than running into the buttons below.
      */}
      <h1
        id="hero-title"
        className="pointer-events-none absolute inset-x-0 top-20 bottom-48 flex items-center justify-center font-heading tracking-tight sm:bottom-44"
      >
        <span className="block w-[min(90vw,120svh)] leading-[1.02] [container-type:inline-size]">
          <span className="hero-line hero-line-a block text-[12.5cqw] font-light">Come back</span>
          <span className="hero-line hero-line-b block text-right text-[12.5cqw] font-semibold">to yourself.</span>
        </span>
      </h1>

      {/* Bottom: the promise and the two ways in, centred. */}
      <div className="hero-bar absolute inset-x-0 bottom-0 flex flex-col items-center gap-6 px-[5vw] pb-10 text-center sm:pb-12">
        <p className="max-w-md text-base leading-relaxed text-brand-cream/80">
          A space for healing, reflection and restoration. Reconnect with your body, your mind and yourself.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/book" className="btn-gold rounded-full px-7 py-3.5 text-sm font-medium">
            Book a Session
          </Link>
          <Link href="/services" className="btn-ghost rounded-full px-7 py-3.5 text-sm font-medium">
            Explore Services
          </Link>
        </div>
      </div>
    </section>
  );
}
