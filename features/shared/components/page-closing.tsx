import Link from "next/link";

export function PageClosing({ title, emphasis, body, href = "/contact", label = "Let's Connect" }: {
  title: string;
  emphasis: string;
  body: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t hairline-gold bg-[radial-gradient(ellipse_at_center,#243B8F33,transparent_70%)]">
      <div className="page-reveal mx-auto flex w-[90%] max-w-4xl flex-col items-center py-24 text-center lg:py-36">
        <h2 className="font-heading text-4xl leading-tight sm:text-6xl">
          {title} <span className="text-gold-light">{emphasis}</span>
        </h2>
        <p className="mt-7 max-w-xl text-base leading-relaxed text-lavender">{body}</p>
        <Link href={href} className="btn-gold mt-9 rounded-full px-8 py-4 text-sm font-medium">
          {label} <span aria-hidden="true" className="ml-3">↗</span>
        </Link>
      </div>
    </section>
  );
}
