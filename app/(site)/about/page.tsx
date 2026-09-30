import type { Metadata } from "next";
import { AboutHero } from "@/features/about/components/hero";
import { Overview } from "@/features/about/components/overview";
import { Values } from "@/features/about/components/values";
import { Approach } from "@/features/about/components/approach";
import { Community } from "@/features/about/components/community";
import { PageMotion } from "@/features/shared/components/page-motion";
import { Testimonials } from "@/features/shared/components/testimonials";
import { getTestimonials } from "@/features/content/server/queries";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "HEX Healing Hub is a spiritual wellness and learning center offering meditation, energy-focused practices, hypnotherapy and spiritual education.",
};

export default async function AboutPage() {
  const testimonials = await getTestimonials();
  return (
    <PageMotion>
      <AboutHero />
      <Overview />
      <Approach />
      <Values />
      <Testimonials items={testimonials} />
      <Community />
    </PageMotion>
  );
}
