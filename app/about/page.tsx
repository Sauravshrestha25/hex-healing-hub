import type { Metadata } from "next";
import { AboutHero } from "@/features/about/components/hero";
import { Overview } from "@/features/about/components/overview";
import { Values } from "@/features/about/components/values";
import { Approach } from "@/features/about/components/approach";
import { Community } from "@/features/about/components/community";
import { PageMotion } from "@/features/shared/components/page-motion";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "HEX Healing Hub is a spiritual wellness and learning center offering meditation, energy-focused practices, hypnotherapy and spiritual education.",
};

export default function AboutPage() {
  return (
    <PageMotion>
      <AboutHero />
      <Overview />
      <Approach />
      <Values />
      <Community />
    </PageMotion>
  );
}
