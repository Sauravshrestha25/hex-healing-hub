import Image from "next/image";

export function ServicesHero() {
  return (
    <section aria-labelledby="services-title" className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,#24104F,transparent_70%)]">
      <div className="mx-auto w-[90%] pb-16 pt-36 sm:pt-44 lg:pb-24">
        <div className="page-reveal grid items-end gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
          <div>
            <p className="eyebrow">Our Services</p>
            <h1 id="services-title" className="mt-8 font-heading text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl xl:text-7xl">
              Many ways inward.<br /><span className="font-light italic text-gold-metal">A path of your own.</span>
            </h1>
          </div>
          <div className="max-w-md">
            <p className="text-base leading-relaxed text-lavender sm:text-lg">
              Explore six ways to learn, reflect and reconnect. Thoughtful support for your spiritual
              wellbeing, wherever you are in your journey.
            </p>
            <a href="#our-services" className="mt-7 inline-flex items-center gap-5 py-3 text-sm text-gold-light underline decoration-gold/40 underline-offset-8">
              Find Your Starting Point <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="page-reveal relative mt-14 h-64 overflow-hidden sm:h-80 lg:h-[420px]">
          <Image src="/images/spiritual-awakening.jpg" alt="A person welcoming the morning light over a misty landscape" fill preload sizes="90vw" className="object-cover object-[center_45%]" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <div aria-hidden="true" className="absolute inset-4 border border-white/20 sm:inset-6" />
          <p className="absolute bottom-8 left-8 right-8 text-xs uppercase tracking-[0.25em] text-white/85 sm:bottom-10 sm:left-10">Reflect. Reconnect. Learn.</p>
        </div>
      </div>
    </section>
  );
}
