"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/features/shared/lib/gsap";

// Dusk → night → dawn. Mixkit clips (Stock Video Free License): 3350, 4148, 4281, 4040, 4999.
const PHASES = ["/videos/scene-1.mp4", "/videos/scene-2.mp4", "/videos/scene-3.mp4", "/videos/scene-4.mp4", "/videos/scene-5.mp4"];

/** Fixed full-screen scene; each `[data-phase="n"]` section cross-fades to video n. */
export function VideoBackground() {
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    document.querySelectorAll<HTMLElement>("[data-phase]").forEach((el) => {
      const phase = Number(el.dataset.phase);
      ScrollTrigger.create({
        trigger: el,
        start: "top 60%",
        end: "bottom 60%",
        onToggle: (self) => self.isActive && setActive(phase),
      });
    });
  });

  // Only the visible scene plays; the rest pause once faded out.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers = videos.current.map((v, i) => {
      if (!v) return undefined;
      if (i === active) {
        v.play().catch(() => {});
        return undefined;
      }
      return setTimeout(() => v.pause(), 1400);
    });
    return () => timers.forEach((t) => t && clearTimeout(t));
  }, [active]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      {PHASES.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            videos.current[i] = el;
          }}
          src={src}
          muted
          loop
          playsInline
          preload={i < 2 ? "auto" : "metadata"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
            active === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* readability: gentle vignette + darker base, keeps the scene visible */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(14_6_33/0.55)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/25 to-ink/70" />
    </div>
  );
}
