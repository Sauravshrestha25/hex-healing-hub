import { SingingBowl } from "@/features/singing-bowl/components/singing-bowl";

export function BowlExperience() {
  return (
    <section aria-labelledby="bowl-title" className="section-cream overflow-hidden">
      <div className="mx-auto w-[90%] py-24 lg:py-32">
        <h2 id="bowl-title" data-split className="text-center font-heading text-4xl leading-[1.05] sm:text-5xl">
          Play the bowl. <span className="text-gold-light">Listen inward.</span>
        </h2>
        <div className="mx-auto mt-10 max-w-[620px]">
          <SingingBowl />
        </div>
      </div>
    </section>
  );
}
