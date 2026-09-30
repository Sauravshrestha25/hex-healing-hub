"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Service } from "@/features/shared/lib/data";

const COUNT_WORDS = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
];

export function ServicesShowcase({ services }: { services: Service[] }) {
  const video = useRef<HTMLVideoElement>(null);
  // The heading counts the services, so adding one in the dashboard keeps it true.
  const count = COUNT_WORDS[services.length] ?? String(services.length);

  // Play only while on screen (saves battery and data); reduced-motion visitors see the still poster.
  useEffect(() => {
    const el = video.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void el.play().catch(() => undefined);
        else el.pause();
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink text-ivory">
      {/* Right half: the video fills the section edge to edge, top to bottom. */}
      <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/healing-panel.mp4"
          poster="/videos/healing-panel-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        {/* A light wash of the brand purple over the footage. */}
        <div className="absolute inset-0 bg-linear-to-b from-ink/35 via-ink/10 to-ink/40" />
      </div>

      <div className="mx-auto w-[90%] py-28 lg:py-36">
        <div className="lg:w-1/2 lg:pr-16">
          <h2
            data-split
            className="max-w-xl font-heading text-brand-cream text-4xl leading-[1.05] sm:text-5xl"
          >
            {count} {services.length === 1 ? "path" : "paths"} toward inner
            balance.
          </h2>

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
            {services.map((s, i) => (
              <li key={s.id} className="min-w-0">
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-brand-cream/25 bg-transparent p-5 transition-colors duration-300 hover:border-brand-cream hover:bg-brand-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream sm:p-6"
                >
                  <span className="font-heading text-xs text-brand-cream/80 transition-colors duration-300 group-hover:text-brand-purple/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-3 font-heading text-lg leading-snug transition-colors duration-300 group-hover:text-brand-purple sm:text-xl">
                    {s.title}
                  </span>
                  <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-lavender transition-colors duration-300 group-hover:text-brand-purple/80">
                    {s.description}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-auto pt-5 text-brand-cream transition duration-300 group-hover:translate-x-1 group-hover:text-brand-purple"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/services"
            className="mt-8 inline-block text-sm text-gold-light underline decoration-gold/40 underline-offset-8 transition-colors hover:text-ivory"
          >
            See all services
          </Link>
        </div>
      </div>
    </section>
  );
}
