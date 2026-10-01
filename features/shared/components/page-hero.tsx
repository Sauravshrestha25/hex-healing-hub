import Image from "next/image";

/**
 * Hero for the About, Services, Portfolio and Blogs pages: a full-bleed photo 60% of the screen tall,
 * with a centred title and short intro set on the photo. Page content follows directly below.
 */
export function PageHero({
  id,
  title,
  intro,
  image,
}: {
  id: string;
  title: React.ReactNode;
  intro: string;
  image: { src: string; alt: string; position?: string };
}) {
  return (
    <section aria-labelledby={id} className="relative isolate flex h-[60svh] min-h-[420px] items-center overflow-hidden">
      {/* Taller than the band so the scroll parallax never reveals an edge. */}
      <div data-parallax className="absolute inset-x-0 -top-[10%] -bottom-[10%] -z-10">
        <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className={`object-cover ${image.position ?? ""}`} />
      </div>
      {/* Flat brand tint so the cream title reads on any photo. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand-purple/45" />
      {/* pt clears the fixed navbar so the text centres in the visible part of the photo. */}
      <div className="page-reveal mx-auto flex w-[90%] flex-col items-center pt-16 text-center">
        <h1 id={id} className="max-w-3xl font-heading text-4xl font-semibold leading-tight tracking-tight text-brand-cream sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-cream/85 sm:text-lg">{intro}</p>
      </div>
    </section>
  );
}
