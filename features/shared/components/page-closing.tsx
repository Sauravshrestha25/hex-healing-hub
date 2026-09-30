import Link from "next/link";

export function PageClosing({ title, emphasis, body, href = "/book", label = "Book a Session" }: {
  title: string;
  emphasis: string;
  body: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="section-cream relative overflow-hidden">
      <div className="page-reveal mx-auto flex w-[90%] max-w-4xl flex-col items-center py-24 text-center lg:py-36">
        <h2 className="font-heading text-3xl leading-tight">
          {title} {emphasis}
        </h2>
        <p className="mt-7 max-w-xl text-base leading-relaxed text-lavender">{body}</p>
        <Link href={href} className="btn-gold mt-9 rounded-full px-8 py-4 text-sm font-medium">
          {label} <span aria-hidden="true" className="ml-3">↗</span>
        </Link>
      </div>
    </section>
  );
}
