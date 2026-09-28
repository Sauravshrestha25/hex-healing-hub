import type { MetadataRoute } from "next";
import { getPublishedBlogs } from "@/features/content/server/queries";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getPublishedBlogs();

  const staticRoutes = ["", "/about", "/services", "/portfolio", "/contact", "/blog"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const blogRoutes = blogs.map((blog) => ({
    url: `${SITE_URL}/blog/${blog.slug}`,
    lastModified: blog.publishedAt ? new Date(blog.publishedAt) : new Date(),
  }));

  return [...staticRoutes, ...blogRoutes];
}
