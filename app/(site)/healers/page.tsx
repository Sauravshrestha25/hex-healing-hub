import type { Metadata } from "next";
import { getHealers } from "@/features/content/server/queries";
import { HealerCard } from "@/features/healers/components/healer-card";
import { PageClosing } from "@/features/shared/components/page-closing";
import { PageHero } from "@/features/shared/components/page-hero";
import { PageMotion } from "@/features/shared/components/page-motion";

export const metadata: Metadata = {
  title: "Our Healers",
  description: "Meet the healers of HEX Healing Hub: their experience, the services they offer, their fees, and times you can book online.",
};

export default async function HealersPage() {
  const healers = await getHealers();
  return (
    <PageMotion>
      <PageHero
        id="healers-title"
        title="The people who hold the space."
        intro="Meet our healers: what they offer, what it costs, and when you can sit with them."
        image={{ src: "/images/meditation-classes.jpg", alt: "A young monk seated peacefully in meditation outdoors", position: "object-[70%_15%]" }}
      />
      <section aria-labelledby="healers-list-title">
        <div className="mx-auto w-[90%] pt-14 pb-24 lg:pt-20 lg:pb-32">
          <h2 id="healers-list-title" className="page-reveal font-heading text-3xl text-brand-cream">
            Choose who you&apos;d like to sit with.
          </h2>
          {healers.length === 0 ? (
            <p className="page-reveal card-plain mt-12 px-6 py-16 text-center text-lavender">Our healers&apos; profiles are on their way. Message us on WhatsApp and we&apos;ll introduce you.</p>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {healers.map((healer) => (
                <HealerCard key={healer.id} healer={healer} />
              ))}
            </div>
          )}
        </div>
      </section>
      <PageClosing
        title="Not sure who"
        emphasis="is right for you?"
        body="Tell us what you're looking for and we'll suggest a healer and a first step."
        href="/contact"
        label="Talk to HEX"
      />
    </PageMotion>
  );
}
