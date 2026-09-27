"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/features/shared/lib/gsap";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(imgRef.current, {
        scale: 1.08,
        duration: 18,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-eyebrow", { opacity: 0, y: 16, duration: 1 })
        .from(".hero-title", { opacity: 0, y: 30, duration: 1.2 }, "-=0.6")
        .from(".hero-body", { opacity: 0, y: 20, duration: 1 }, "-=0.7")
        .from(".hero-cta", { opacity: 0, y: 16, duration: 0.9 }, "-=0.6")
        .from(".hero-scroll-cue", { opacity: 0, duration: 1 }, "-=0.4");

      gsap.to(".hero-scroll-cue-dot", {
        y: 10,
        opacity: 0.3,
        duration: 1.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="grain relative h-screen min-h-[640px] overflow-hidden bg-ink">
      <div ref={imgRef} className="absolute inset-0 scale-100">
        <Image src="/images/hero.jpg" alt="" fill priority className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-purple/50 to-ink" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-ivory sm:px-10">
        <p className="hero-eyebrow eyebrow mb-8">Heal Within • Awaken • Transform</p>
        <h1 className="hero-title font-heading text-6xl font-medium leading-[0.98] sm:text-7xl lg:text-[7.5rem] max-w-5xl">
          Come Back to <span className="font-light italic text-gold-metal">Yourself.</span>
        </h1>
        <p className="hero-body mt-8 max-w-xl text-lg font-light leading-relaxed text-ivory/75">
          A space for healing, reflection, restoration and deeper connection — with your body, your mind and
          yourself.
        </p>
        <div className="hero-cta mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="btn-gold rounded-full px-9 py-4 text-sm font-medium tracking-wide"
          >
            Begin Your Journey
          </Link>
          <Link
            href="/services"
            className="btn-ghost rounded-full px-9 py-4 text-sm font-medium tracking-wide"
          >
            Explore Healing Experiences
          </Link>
        </div>
      </div>

      <div className="hero-scroll-cue absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[0.65rem] uppercase tracking-[0.35em] text-ivory/50">Scroll</span>
        <span className="hero-scroll-cue-dot block h-2 w-2 rounded-full bg-gold" />
      </div>
    </section>
  );
}
