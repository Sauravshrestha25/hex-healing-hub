import Link from "next/link";

export function GradientCta({
  title,
  body,
  primaryLabel,
  primaryHref = "/contact",
}: {
  title: string;
  body?: string;
  primaryLabel: string;
  primaryHref?: string;
}) {
  return (
    <section className="brand-gradient">
      <div className="mx-auto max-w-2xl px-6 py-28 text-center text-white sm:px-10">
        <h2 className="font-heading text-3xl sm:text-4xl leading-snug">{title}</h2>
        {body && <p className="mt-5 text-white/75">{body}</p>}
        <Link
          href={primaryHref}
          className="mt-10 inline-block rounded-full bg-accent px-8 py-3.5 font-medium text-purple hover:opacity-90 transition-opacity"
        >
          {primaryLabel}
        </Link>
      </div>
    </section>
  );
}
