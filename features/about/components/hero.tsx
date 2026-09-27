import Image from "next/image";
import Link from "next/link";

export function AboutHero() {
  return (
    <section aria-labelledby="about-title" className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,#243B8F55,transparent_65%)]">
      <div className="mx-auto grid w-[90%] items-center gap-14 pb-16 pt-36 sm:pt-44 lg:min-h-[90svh] lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:pb-24">
        <div className="page-reveal relative z-10">
          <h1 id="about-title" className="mt-8 max-w-3xl font-heading text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl xl:text-7xl">
            A little stillness.
            <br />
            A deeper <span className="text-gold-light">connection.</span>
          </h1>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-lavender sm:text-lg">
            We are a spiritual wellness and learning center. A calm place to pause, explore your inner
            world and grow at your own pace.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/contact" className="btn-gold rounded-full px-7 py-4 text-sm font-medium">
              Get to Know Us <span aria-hidden="true" className="ml-3">↗</span>
            </Link>
            <a href="#our-purpose" className="py-3 text-sm text-ivory/80 underline decoration-gold/40 underline-offset-8 transition-colors hover:text-gold-light">
              Discover Our Purpose <span aria-hidden="true" className="ml-2">↓</span>
            </a>
          </div>
        </div>
        <figure className="page-reveal mx-auto w-full max-w-lg lg:pl-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[48%] border border-gold/25 p-3">
            <div className="relative h-full overflow-hidden rounded-t-[48%]">
              <Image
                src="/images/meditation-classes.jpg"
                alt="A young monk seated peacefully in meditation outdoors"
                fill
                preload
                sizes="(min-width: 1024px) 38vw, (min-width: 640px) 512px, 90vw"
                className="object-cover object-[65%_center]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
