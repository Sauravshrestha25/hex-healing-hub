import Link from "next/link";
import { Reveal } from "@/features/shared/components/reveal";

export function Closing() {
  return (
    <section className="relative overflow-hidden text-ivory">
      <div className="gold-aura absolute inset-0" />

      <Reveal className="relative mx-auto grid w-[90%] grid-cols-1 items-end gap-12 py-40 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20 lg:py-48">
        <h2 data-split className="font-heading text-[2.6rem] leading-[1.04] min-[380px]:text-5xl sm:text-7xl">
          Your path inward starts with <span className="text-gold-light">one conversation.</span>
        </h2>
        <div className="lg:pb-3">
          <p className="max-w-md text-lg font-light leading-relaxed text-lavender">
            For details, class schedules and appointments, reach out to HEX Healing Hub. We&apos;ll help you find
            the right place to begin.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/contact" className="btn-gold rounded-full px-9 py-4 text-sm font-medium tracking-wide">
              Contact Us
            </Link>
            <Link
              href="/services"
              className="py-3 text-sm text-gold-light underline decoration-gold/40 underline-offset-8 transition-colors hover:text-ivory"
            >
              Browse services
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
