import "server-only";
import type { PrismaClient } from "@prisma/client";

export class DashboardService {
  constructor(private readonly db: PrismaClient) {}

  async stats() {
    const [
      newBookings,
      confirmedBookings,
      publishedPosts,
      draftPosts,
      services,
      galleryImages,
      testimonialsShown,
      testimonialsHidden,
      recentBookings,
      recentPosts,
    ] = await Promise.all([
      this.db.booking.count({ where: { status: "NEW" } }),
      this.db.booking.count({ where: { status: "CONFIRMED" } }),
      this.db.blog.count({ where: { published: true } }),
      this.db.blog.count({ where: { published: false } }),
      this.db.service.count(),
      this.db.galleryItem.count(),
      this.db.testimonial.count({ where: { published: true } }),
      this.db.testimonial.count({ where: { published: false } }),
      this.db.booking.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      this.db.blog.findMany({
        orderBy: { updatedAt: "desc" },
        take: 4,
        select: { id: true, title: true, coverImage: true, published: true, updatedAt: true },
      }),
    ]);
    return {
      newBookings,
      confirmedBookings,
      publishedPosts,
      draftPosts,
      services,
      galleryImages,
      testimonialsShown,
      testimonialsHidden,
      recentBookings,
      recentPosts,
    };
  }
}
