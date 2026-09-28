import type { Metadata } from "next";
import { getPublishedBlogs } from "@/features/content/server/queries";
import { BlogHero } from "@/features/blog/components/hero";
import { BlogList } from "@/features/blog/components/blog-list";
import { PageMotion } from "@/features/shared/components/page-motion";
import { PageClosing } from "@/features/shared/components/page-closing";

export const metadata: Metadata = {
  title: "Blogs",
  description: "HEX Blogs — reflections on mindfulness, spiritual wellbeing, healing practices and self-awareness.",
};

export default async function BlogPage() {
  const blogs = await getPublishedBlogs();

  return (
    <PageMotion>
      <BlogHero />
      <BlogList blogs={blogs} />
      <PageClosing title="Let curiosity be" emphasis="your starting point." body="Explore our sessions and classes, or reach out with a question. Your journey can begin at your own pace." href="/services" label="Explore Our Services" />
    </PageMotion>
  );
}
