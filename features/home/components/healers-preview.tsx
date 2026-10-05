import Link from "next/link";
import { HealerCard } from "@/features/healers/components/healer-card";
import type { HealerCard as Healer } from "@/features/shared/lib/data";

/** Homepage row of healers. Renders nothing until at least one healer is published. */
export function HealersPreview({ healers }: { healers: Healer[] }) {
  if (healers.length === 0) return null;
  return (
    <section aria-labelledby="home-healers-title">
      <div className="mx-auto w-[90%] py-24 lg:py-32">
        <div className="page-reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 id="home-healers-title" className="font-heading text-3xl leading-tight text-brand-cream">
              Meet our healers.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-lavender">
              See who you&apos;ll be sitting with, what they offer and when they&apos;re free, then book a time online.
            </p>
          </div>
          <Link href="/healers" className="btn-ghost inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-medium whitespace-nowrap">
            All healers <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {healers.slice(0, 3).map((healer) => (
            <HealerCard key={healer.id} healer={healer} />
          ))}
        </div>
      </div>
    </section>
  );
}
