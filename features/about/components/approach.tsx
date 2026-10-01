import Image from "next/image";
import Link from "next/link";

const APPROACH = [
  {
    title: "Space to pause",
    body: "Slow down and make room for self-reflection, in a calm environment shaped by compassion and respect.",
  },
  {
    title: "Guidance to explore",
    body: "Explore meditation, spiritual learning and complementary healing practices with an open mind and clear expectations.",
  },
  {
    title: "Room to grow",
    body: "Build awareness through learning and steady practice, with space to follow your own pace and personal interests.",
  },
];

export function Approach() {
  return (
    <section aria-labelledby="approach-title">
      <div className="mx-auto grid w-[90%] items-center gap-12 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-32">
        <div className="page-reveal relative aspect-[4/5] overflow-hidden rounded-3xl">
          <Image
            src="/images/prayer-flags.jpg"
            alt="Prayer flags above a peaceful mountain valley in Nepal"
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </div>
        <div className="page-reveal">
          <h2
            id="approach-title"
            className="font-heading text-3xl leading-tight text-brand-cream"
          >
            Your journey.
            <br />
            Thoughtful support.
          </h2>
          <ol className="mt-10 grid gap-4">
            {APPROACH.map((item, index) => (
              <li key={item.title} className="card-plain flex gap-5 p-6">
                <span className="font-heading text-sm text-lavender">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-lavender">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <Link
            href="/services"
            className="btn-ghost mt-8 inline-flex rounded-full px-7 py-4 text-sm font-medium"
          >
            Explore Our Services{" "}
            <span aria-hidden="true" className="ml-3">
              ↗
            </span>
          </Link>
          <p className="mt-8 max-w-lg text-xs leading-relaxed text-lavender">
            Our practices are complementary and supportive. They do not replace
            professional medical or psychological care, and we do not promise
            guaranteed outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}
