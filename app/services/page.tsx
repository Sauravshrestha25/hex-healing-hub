import type { Metadata } from "next";
import { ServicesHero } from "@/features/services/components/hero";
import { ServiceList } from "@/features/services/components/service-list";
import { PageClosing } from "@/features/shared/components/page-closing";
import { PageMotion } from "@/features/shared/components/page-motion";
import { getServices } from "@/features/shared/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore HEX Healing Hub's spiritual healing, energy work, hypnotherapy and meditation offerings.",
};

export default function ServicesPage() {
  const services = getServices();

  return (
    <PageMotion>
      <ServicesHero />
      <ServiceList services={services} />
      <PageClosing
        eyebrow="Here to Help"
        title="Not sure where"
        emphasis="to begin?"
        body="Tell us what you're looking for and we'll help you understand the options."
        label="Talk to HEX"
      />
    </PageMotion>
  );
}
