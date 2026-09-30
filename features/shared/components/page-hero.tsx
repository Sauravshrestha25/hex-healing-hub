import Image from "next/image";

/**
 * Full-screen cream hero for every page except home. The title sits in the cream band on top;
 * the photo runs edge to edge across the bottom 60% of the screen.
 */
export function PageHero({
  id,
  title,
  image,
}: {
  id: string;
  title: React.ReactNode;
  image: { src: string; alt: string; position?: string };
}) {
  return (
    <section aria-labelledby={id} className="section-cream flex min-h-svh flex-col">
      <div className="page-reveal mx-auto flex w-[90%] flex-1 items-center pb-12 pt-28">
        <h1 id={id} className="font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {title}
        </h1>
      </div>

      <div className="relative h-[60svh] w-full shrink-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          preload
          sizes="100vw"
          className={`object-cover ${image.position ?? ""}`}
        />
      </div>
    </section>
  );
}
