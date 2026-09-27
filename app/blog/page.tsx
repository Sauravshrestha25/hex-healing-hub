import type { Metadata } from "next";
import { getBlogs } from "@/features/shared/lib/data";
import { BlogHero } from "@/features/blog/components/hero";
import { BlogList } from "@/features/blog/components/blog-list";
import { PageMotion } from "@/features/shared/components/page-motion";
import { PageClosing } from "@/features/shared/components/page-closing";

export const metadata: Metadata = {
  title: "Blogs",
  description: "HEX Blogs — reflections on mindfulness, spiritual wellbeing, healing practices and self-awareness.",
};

export default function BlogPage() {
  const blogs = [...getBlogs()].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

  return (
    <PageMotion>
      <BlogHero />
      <BlogList blogs={blogs} />
      <PageClosing title="Let curiosity be" emphasis="your starting point." body="Explore our sessions and classes, or reach out with a question. Your journey can begin at your own pace." href="/services" label="Explore Our Services" />
    </PageMotion>
  );
}
