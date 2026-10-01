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
      tl.from(".hero-title", { opacity: 0, y: 30, duration: 1.2 })
        .from(".hero-body", { opacity: 0, y: 20, duration: 1 }, "-=0.7")
        .from(".hero-cta", { opacity: 0, y: 16, duration: 0.9 }, "-=0.6");
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-motion="own"
      className="grain relative h-screen min-h-[640px] overflow-hidden bg-ink"
    >
      <div ref={imgRef} className="absolute inset-0 scale-100">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-ink/85 via-purple/50 to-ink" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-brand-cream sm:px-10">
        <h1 className="hero-title font-heading text-6xl font-medium leading-[0.98] sm:text-7xl lg:text-7xl max-w-5xl">
          Come Back to Yourself.
        </h1>
        <p className="hero-body mt-8 max-w-xl text-lg font-light leading-relaxed text-ivory/75">
          A space for healing, reflection and restoration. A place to reconnect
          with your body, your mind and yourself.
        </p>
        <div className="hero-cta mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/book"
            className="btn-gold rounded-full px-9 py-4 text-sm font-medium tracking-wide"
          >
            Book a Session
          </Link>
          <Link
            href="/services"
            className="btn-ghost rounded-full px-9 py-4 text-sm font-medium tracking-wide"
          >
            Explore Healing Experiences
          </Link>
        </div>
      </div>
    </section>
  );
}
