import "server-only";
import type { PrismaClient } from "@prisma/client";
import type { R2StorageService } from "@/features/admin/server/storage.service";

import { imagesInHtml } from "@/features/content/lib/images-in-html";

export { imagesInHtml };

/**
 * Removes image files from storage once no content refers to them any more.
 * Call it after the database write, with the URLs that were dropped or replaced.
 */
export class ImageJanitor {
  constructor(
    private readonly db: PrismaClient,
    private readonly storage: R2StorageService,
  ) {}

  async release(urls: Iterable<string>) {
    const candidates = [...new Set(urls)].filter(Boolean);
    const orphaned: string[] = [];
    for (const url of candidates) {
      if (!(await this.isInUse(url))) orphaned.push(url);
    }
    await this.storage.removeImages(orphaned);
  }

  private async isInUse(url: string) {
    const [blogs, services, gallery, testimonials, healers] = await Promise.all([
      this.db.blog.count({ where: { OR: [{ coverImage: url }, { content: { contains: url } }] } }),
      this.db.service.count({ where: { image: url } }),
      this.db.galleryItem.count({ where: { image: url } }),
      this.db.testimonial.count({ where: { photo: url } }),
      this.db.healer.count({ where: { photo: url } }),
    ]);
    return blogs + services + gallery + testimonials + healers > 0;
  }
}
