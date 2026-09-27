import Image from "next/image";
import Link from "next/link";

const APPROACH = [
  { title: "Space to pause", body: "Slow down and make room for self-reflection, in a calm environment shaped by compassion and respect." },
  { title: "Guidance to explore", body: "Explore meditation, spiritual learning and complementary healing practices with an open mind and clear expectations." },
  { title: "Room to grow", body: "Build awareness through learning and steady practice, with space to follow your own pace and personal interests." },
];

export function Approach() {
  return (
    <section aria-labelledby="approach-title" className="relative bg-[linear-gradient(135deg,#24104F55,transparent_65%)]">
      <div className="mx-auto grid w-[90%] items-center gap-14 py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:py-36">
        <div className="page-reveal relative">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src="/images/prayer-flags.jpg" alt="Prayer flags above a peaceful mountain valley in Nepal" fill sizes="(min-width: 1024px) 38vw, 90vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
            <div aria-hidden="true" className="absolute inset-5 border border-white/25" />
            <p className="absolute bottom-10 left-10 right-10 font-heading text-2xl leading-snug text-white sm:text-3xl">
              Grounded in care.<br /><span className="font-light text-gold-light">Guided by awareness.</span>
            </p>
          </div>
        </div>
        <div className="page-reveal">
          <h2 id="approach-title" className="mt-7 font-heading text-4xl leading-tight sm:text-5xl">
            Your journey.<br /><span className="text-gold-light">Thoughtful support.</span>
          </h2>
          <ol className="mt-10 divide-y divide-gold/20">
            {APPROACH.map((item) => (
              <li key={item.title} className="flex gap-5 py-6">
                <div>
                  <h3 className="font-heading text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-lavender">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/services" className="mt-5 inline-flex items-center gap-5 py-3 text-sm text-gold-light underline decoration-gold/40 underline-offset-8 transition-colors hover:text-white">
            Explore Our Services <span aria-hidden="true">↗</span>
          </Link>
          <p className="mt-7 max-w-lg border-t border-gold/20 pt-6 text-xs leading-relaxed text-lavender">
            Our practices are complementary and supportive. They do not replace professional medical or
            psychological care, and we do not promise guaranteed outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}
