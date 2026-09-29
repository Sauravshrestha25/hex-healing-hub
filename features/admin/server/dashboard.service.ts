import "server-only";
import type { PrismaClient } from "@prisma/client";

export class DashboardService {
  constructor(private readonly db: PrismaClient) {}

  async stats() {
    const [newInquiries, publishedPosts, draftPosts, services, galleryImages, recentInquiries, recentPosts] = await Promise.all([
      this.db.inquiry.count({ where: { status: "NEW" } }),
      this.db.blog.count({ where: { published: true } }),
      this.db.blog.count({ where: { published: false } }),
      this.db.service.count(),
      this.db.galleryItem.count(),
      this.db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      this.db.blog.findMany({
        orderBy: { updatedAt: "desc" },
        take: 4,
        select: { id: true, title: true, coverImage: true, published: true, updatedAt: true },
      }),
    ]);
    return { newInquiries, publishedPosts, draftPosts, services, galleryImages, recentInquiries, recentPosts };
  }
}
