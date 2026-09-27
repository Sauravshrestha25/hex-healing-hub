"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/features/shared/lib/gsap";

const LEAD = "A calm, supportive and spiritually oriented space";
const REST =
  "for learning, self-reflection, meditation and complementary healing. Slow down, turn inward and grow at your own pace.";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".mf-word",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 65%", scrub: true },
        },
      );
    },
    { scope: ref },
  );

  const words = (text: string, cls: string) =>
    text.split(" ").map((w, i) => (
      <span key={cls + i} className={`mf-word ${cls}`}>
        {w}{" "}
      </span>
    ));

  return (
    <section ref={ref} className="relative text-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-b from-ink to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_60%_50%,rgb(14_6_33/0.7),transparent_75%)]" />
      <div className="relative mx-auto w-[90%] py-40 lg:py-56">
        <p className="max-w-5xl font-heading text-3xl leading-[1.28] sm:text-5xl lg:text-[3.6rem]">
          {words(LEAD, "font-semibold")}
          {words(REST, "font-normal text-ivory/75")}
        </p>
      </div>
    </section>
  );
}
