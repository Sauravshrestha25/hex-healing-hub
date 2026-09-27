import Link from "next/link";
import { Reveal } from "@/features/shared/components/reveal";

export function Closing() {
  return (
    <section className="relative overflow-hidden text-ivory">
      <div className="gold-aura absolute inset-0" />

      <Reveal className="relative mx-auto flex w-[90%] max-w-4xl flex-col items-center py-48 text-center">
        <h2 data-split className="mt-10 font-heading text-5xl leading-[1.04] sm:text-7xl">
          Your path inward starts with <span className="text-gold-light">one conversation.</span>
        </h2>
        <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-lavender">
          For details, class schedules and appointments, reach out to HEX Healing Hub.
        </p>
        <Link href="/contact" className="btn-gold mt-14 rounded-full px-10 py-4 text-sm font-medium tracking-wide">
          Contact Us
        </Link>
      </Reveal>
    </section>
  );
}
