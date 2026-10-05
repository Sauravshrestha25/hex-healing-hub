import type { MetadataRoute } from "next";
import { getHealers, getPublishedBlogs, getServices } from "@/features/content/server/queries";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, services, healers] = await Promise.all([getPublishedBlogs(), getServices(), getHealers()]);

  const staticRoutes = ["", "/about", "/services", "/healers", "/portfolio", "/contact", "/book", "/blog"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const blogRoutes = blogs.map((blog) => ({
    url: `${SITE_URL}/blog/${blog.slug}`,
    lastModified: blog.publishedAt ? new Date(blog.publishedAt) : new Date(),
  }));

  const serviceRoutes = services.map((service) => ({ url: `${SITE_URL}/services/${service.slug}`, lastModified: new Date() }));

  const healerRoutes = healers.map((healer) => ({ url: `${SITE_URL}/healers/${healer.slug}`, lastModified: new Date() }));

  return [...staticRoutes, ...serviceRoutes, ...healerRoutes, ...blogRoutes];
}
