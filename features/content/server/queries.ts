import "server-only";
import { connection } from "next/server";
import { cache } from "react";
import { container } from "@/features/shared/server/container";

// Public read API for the site's pages. connection() renders these pages per request, so the
// Docker image builds without a database and always shows the live content.
// ponytail: a few tiny queries per page view; add Redis/"use cache" caching if traffic grows.
export async function getServices() {
  await connection();
  return container().services.list();
}

export async function getPublishedBlogs() {
  await connection();
  return container().blogs.listPublished();
}

export async function getGallery() {
  await connection();
  return container().gallery.list();
}

// cache(): generateMetadata and the page share one query per request.
export const getPublishedBlog = cache(async (slug: string) => {
  await connection();
  return container().blogs.findPublishedBySlug(slug);
});
