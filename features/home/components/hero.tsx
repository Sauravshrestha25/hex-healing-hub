"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BellRing } from "lucide-react";
import { gsap, SplitText, useGSAP } from "@/features/shared/lib/gsap";
import { PRELOADER_EXIT_DELAY } from "@/features/shared/components/preloader";
import { BowlAudio } from "@/features/singing-bowl/lib/bowl-sound";

/**
 * "Ring the bowl": the singing-bowl film behind an oversized, editorial headline. Tapping anywhere on
 * the hero rings a real (synthesised) singing bowl and sends ripples out from the tap; a soft cursor
 * ring invites it on desktop. On scroll the headline lines drift apart and the film settles into a
 * rounded frame. Reduced motion keeps the tap-to-ring but drops the choreography.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const audio = useRef<BowlAudio | null>(null);
  const ring = useRef({ level: 0, pan: 0, frame: 0 });
  const [rung, setRung] = useState(false);

  useEffect(
    () => () => {
      cancelAnimationFrame(ring.current.frame);
      audio.current?.dispose();
    },
    [],
  );

  /** One strike, then the resonance decays over ~7s; the audio thread sleeps again afterwards. */
  async function ringBowl(x: number, y: number) {
    const root = rootRef.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    spawnRipples(root, x - box.left, y - box.top);
    setRung(true);

    audio.current ??= new BowlAudio();
    if (!(await audio.current.unlock())) return;
    const state = ring.current;
    state.level = Math.min(1, state.level + 0.85);
    state.pan = ((x - box.left) / box.width) * 2 - 1;
    audio.current.strike(0.9);
    cancelAnimationFrame(state.frame);
    const step = () => {
      state.level *= 0.992;
      audio.current?.update({ energy: 0, strike: state.level, friction: 0, pressure: 0, angle: 0, pan: state.pan * 0.6 });
      if (state.level > 0.002) state.frame = requestAnimationFrame(step);
      else audio.current?.suspend();
    };
    state.frame = requestAnimationFrame(step);
  }

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

        // Cursor ring (fine pointers): follows the pointer over the hero, steps aside over links.
        if (!window.matchMedia("(pointer: fine)").matches) return;
        const cursor = root.querySelector<HTMLElement>(".hero-cursor")!;
        const x = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3.out" });
        const y = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3.out" });
        const onMove = (event: PointerEvent) => {
          const box = root.getBoundingClientRect();
          x(event.clientX - box.left);
          y(event.clientY - box.top);
          const overLink = (event.target as Element).closest("a, button");
          gsap.to(cursor, { opacity: overLink ? 0 : 1, scale: overLink ? 0.4 : 1, duration: 0.3, overwrite: "auto" });
        };
        const onLeave = () => gsap.to(cursor, { opacity: 0, scale: 0.4, duration: 0.3 });
        root.addEventListener("pointermove", onMove);
        root.addEventListener("pointerleave", onLeave);
        return () => {
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
          lines.revert();
        };
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
      onPointerDown={(event) => {
        if ((event.target as Element).closest("a, button")) return;
        void ringBowl(event.clientX, event.clientY);
      }}
      className="relative isolate h-svh min-h-[640px] cursor-pointer overflow-hidden bg-brand-purple text-brand-cream md:cursor-none"
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

      {/* Headline: oversized and editorial, the two lines set at opposite corners. */}
      <h1
        id="hero-title"
        className="pointer-events-none absolute inset-x-0 top-0 flex h-full flex-col justify-start px-[5vw] pt-36 font-heading leading-[0.9] tracking-tight sm:justify-center sm:pt-16"
      >
        <span className="hero-line hero-line-a block text-[clamp(3.25rem,11.5vw,11rem)] font-light">Come back</span>
        <span className="hero-line hero-line-b block self-end text-right text-[clamp(3.25rem,11.5vw,11rem)] font-semibold">
          to yourself.
        </span>
      </h1>

      {/* Bottom bar: the promise, the invitation to ring, and the way in. */}
      <div className="hero-bar absolute inset-x-0 bottom-0 grid gap-6 px-[5vw] pb-8 sm:pb-10 lg:grid-cols-3 lg:items-end">
        <p className="max-w-sm text-base leading-relaxed text-brand-cream/80">
          A space for healing, reflection and restoration. Reconnect with your body, your mind and yourself.
        </p>
        <p className="flex items-center gap-3 text-sm tracking-[0.2em] text-brand-cream/80 uppercase sm:tracking-[0.25em] lg:justify-center" aria-live="polite">
          <BellRing className="size-4 shrink-0" aria-hidden="true" />
          {rung ? (
            "Listen. Let it fade."
          ) : (
            <span>
              Tap <span className="hidden sm:inline">anywhere </span>to ring the bowl
            </span>
          )}
        </p>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link href="/book" className="btn-gold rounded-full px-7 py-3.5 text-sm font-medium">
            Book a Session
          </Link>
          <Link href="/services" className="btn-ghost rounded-full px-7 py-3.5 text-sm font-medium">
            Explore Services
          </Link>
        </div>
      </div>

      {/* Cursor ring (desktop): an invitation to ring the bowl. */}
      <div
        aria-hidden="true"
        className="hero-cursor pointer-events-none absolute top-0 left-0 z-20 hidden size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand-cream/70 text-xs tracking-[0.3em] uppercase opacity-0 md:grid"
      >
        Ring
      </div>
    </section>
  );
}

/** Three cream rings expanding from the tap point, like sound leaving the bowl. */
function spawnRipples(root: HTMLElement, x: number, y: number) {
  for (let i = 0; i < 3; i++) {
    const ripple = document.createElement("span");
    ripple.className = "hero-ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.animationDelay = `${i * 0.35}s`;
    ripple.addEventListener("animationend", () => ripple.remove());
    root.appendChild(ripple);
  }
}
