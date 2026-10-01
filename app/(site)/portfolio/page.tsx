import type { Metadata } from "next";
import { Gallery } from "@/features/portfolio/components/gallery";
import { getGallery } from "@/features/content/server/queries";
import { PageMotion } from "@/features/shared/components/page-motion";
import { PageClosing } from "@/features/shared/components/page-closing";
import { PageHero } from "@/features/shared/components/page-hero";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore HEX Healing Hub's visual collection inspired by mindfulness, nature and spiritual tradition.",
};

export default async function PortfolioPage() {
  const items = await getGallery();
  return (
    <PageMotion>
      <PageHero
        id="portfolio-title"
        title={
          <>
            The art of
            <br />
            slowing down.
          </>
        }
        intro="Stillness, spiritual tradition and natural beauty: the moments that inspire our approach."
        image={{ src: "/images/prayer-flags.jpg", alt: "Prayer flags moving in the mountain wind" }}
      />
      <Gallery items={items} />
      <PageClosing
        title="Make space for"
        emphasis="your own journey."
        body="Explore our sessions and classes, and find a starting point that feels right for you."
        href="/services"
        label="Discover Our Services"
      />
    </PageMotion>
  );
}
