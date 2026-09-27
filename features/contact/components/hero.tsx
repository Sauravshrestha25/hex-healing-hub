import Image from "next/image";

export function ContactHero() {
  return (
    <section aria-labelledby="contact-title" className="bg-[radial-gradient(ellipse_at_top_right,#243B8F44,transparent_65%)]">
      <div className="mx-auto grid w-[90%] items-center gap-12 pb-16 pt-36 sm:pt-44 lg:grid-cols-[1.3fr_0.7fr] lg:gap-24 lg:pb-24">
        <div className="page-reveal min-w-0">
          <h1 id="contact-title" className="mt-8 font-heading text-[2.5rem] font-bold leading-[1.08] tracking-tight sm:text-6xl xl:text-7xl">A conversation.<br /><span className="text-gold-light">A beginning.</span></h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-lavender sm:text-lg">A question, a little curiosity, or a wish to begin. Reach out for details, class schedules and appointments. We&apos;re here to help you explore.</p>
          <a href="#inquiry" className="mt-7 inline-flex items-center gap-5 py-3 text-sm text-gold-light underline decoration-gold/40 underline-offset-8">Start a Conversation <span aria-hidden="true">↓</span></a>
        </div>
        <div className="page-reveal relative aspect-[4/3] overflow-hidden lg:aspect-[4/5]">
          <Image src="/images/contact.jpg" alt="Soft sunlight illuminating a peaceful forest path" fill preload sizes="(min-width: 1024px) 32vw, 90vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          <div aria-hidden="true" className="absolute inset-4 border border-white/25" />
        </div>
      </div>
    </section>
  );
}
