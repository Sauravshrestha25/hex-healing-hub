export function BlogHero() {
  return (
    <section aria-labelledby="blogs-title" className="bg-[radial-gradient(ellipse_at_top_right,#243B8F44,transparent_65%)]">
      <div className="page-reveal mx-auto grid w-[90%] items-end gap-8 pb-14 pt-36 sm:pt-44 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:pb-20">
        <div>
          <h1 id="blogs-title" className="mt-8 font-heading text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl xl:text-7xl">
            A little insight.<br /><span className="text-gold-light">A deeper awareness.</span>
          </h1>
        </div>
        <div className="max-w-md">
          <p className="text-base leading-relaxed text-lavender sm:text-lg">Reflections on mindfulness, spiritual wellbeing and the everyday practice of understanding yourself. Take a moment. Find something that speaks to you.</p>
          <a href="#latest-articles" className="mt-7 inline-flex items-center gap-5 py-3 text-sm text-gold-light underline decoration-gold/40 underline-offset-8">Explore the Articles <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  );
}
