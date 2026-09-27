import type { Metadata } from "next";
import Image from "next/image";
import { Gallery } from "@/features/portfolio/components/gallery";
import { PageMotion } from "@/features/shared/components/page-motion";
import { PageClosing } from "@/features/shared/components/page-closing";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore HEX Healing Hub's visual collection inspired by mindfulness, nature and spiritual tradition.",
};

export default function PortfolioPage() {
  return (
    <PageMotion>
      <section aria-labelledby="portfolio-title" className="relative isolate flex min-h-[75svh] items-end overflow-hidden">
        <Image src="/images/himalaya.jpg" alt="" fill preload sizes="100vw" className="-z-20 object-cover object-center" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/65 via-ink/45 to-ink" />
        <div className="page-reveal mx-auto grid w-[90%] items-end gap-8 pb-16 pt-44 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:pb-24">
          <div>
            <p className="eyebrow">Our Portfolio</p>
            <h1 id="portfolio-title" className="mt-8 font-heading text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl xl:text-7xl">The art of<br /><span className="font-light italic text-gold-metal">slowing down.</span></h1>
          </div>
          <div className="max-w-md">
            <p className="text-base leading-relaxed text-ivory/80 sm:text-lg">A visual collection of stillness, spiritual tradition and natural beauty. The images and ideas that inspire our approach.</p>
            <a href="#gallery" className="mt-7 inline-flex items-center gap-5 py-3 text-sm text-gold-light underline decoration-gold/40 underline-offset-8">Explore the Gallery <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>
      <Gallery />
      <PageClosing eyebrow="From Inspiration to Practice" title="Make space for" emphasis="your own journey." body="Explore our sessions and classes, and find a starting point that feels right for you." href="/services" label="Discover Our Services" />
    </PageMotion>
  );
}
