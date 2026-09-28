import type { Metadata } from "next";
import Link from "next/link";
import { ContactHero } from "@/features/contact/components/hero";
import { ContactForm } from "@/features/contact/components/contact-form";
import { getServices } from "@/features/content/server/queries";
import { ContactInfo } from "@/features/contact/components/info";
import { PageMotion } from "@/features/shared/components/page-motion";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Connect with HEX Healing Hub in Butwal, Pokhara or Kapilvastu for details, class schedules and appointments.",
};

export default async function ContactPage() {
  const interests = (await getServices()).map((service) => service.title);
  return (
    <PageMotion>
      <ContactHero />
      <section id="inquiry" aria-label="Contact details and inquiry form" className="scroll-mt-24 border-t hairline-gold">
        <div className="mx-auto grid w-[90%] items-start gap-14 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:py-28">
          <ContactInfo />
          <ContactForm interests={interests} />
        </div>
      </section>
      <section className="border-t hairline-gold bg-purple/30">
        <div className="page-reveal mx-auto flex w-[90%] flex-col justify-between gap-8 py-14 sm:flex-row sm:items-center">
          <div><h2 className="mt-5 font-heading text-2xl sm:text-3xl">Still finding your <span className="text-gold-light">starting point?</span></h2></div>
          <Link href="/services" className="btn-ghost w-fit shrink-0 rounded-full px-7 py-4 text-sm">Explore Our Services <span aria-hidden="true" className="ml-3">↗</span></Link>
        </div>
      </section>
    </PageMotion>
  );
}
