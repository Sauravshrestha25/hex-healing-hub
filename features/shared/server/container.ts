import "server-only";
import { R2StorageService } from "@/features/admin/server/storage.service";
import { DashboardService } from "@/features/admin/server/dashboard.service";
import { SessionCodec } from "@/features/auth/lib/session-codec";
import { AuthService } from "@/features/auth/server/auth.service";
import { PasswordHasher } from "@/features/auth/server/password";
import { SessionService } from "@/features/auth/server/session.service";
import { InquiryService } from "@/features/contact/server/inquiry.service";
import { SmtpInquiryNotifier } from "@/features/contact/server/inquiry-notifier";
import { BlogService } from "@/features/content/server/blog.service";
import { GalleryService } from "@/features/content/server/gallery.service";
import { ServiceCatalogService } from "@/features/content/server/service-catalog.service";
import { UserService } from "@/features/users/server/user.service";
import { db } from "./db";
import { MemoryRateLimiter, RedisRateLimiter } from "./rate-limiter";
import { redisFromEnv } from "./redis";

/** Composition root: every server-side service, wired once with its dependencies. */
function createContainer() {
  const redis = redisFromEnv();
  const limiter = (name: string, limit: number, windowMs: number) =>
    redis ? new RedisRateLimiter(redis, name, limit, windowMs) : new MemoryRateLimiter(limit, windowMs);
  const hasher = new PasswordHasher();
  const sessions = new SessionService(db, new SessionCodec(process.env.SESSION_SECRET));

  return {
    sessions,
    auth: new AuthService(db, sessions, hasher, limiter("login", 5, 15 * 60 * 1000)),
    users: new UserService(db, hasher),
    blogs: new BlogService(db),
    services: new ServiceCatalogService(db),
    gallery: new GalleryService(db),
    inquiries: new InquiryService(db, SmtpInquiryNotifier.fromEnv(), limiter("inquiry", 5, 10 * 60 * 1000)),
    storage: R2StorageService.fromEnv(),
    dashboard: new DashboardService(db),
  };
}

type Container = ReturnType<typeof createContainer>;
let instance: Container | undefined;

/** Built lazily on first use, so `next build` doesn't need runtime secrets like SESSION_SECRET. */
export function container(): Container {
  instance ??= createContainer();
  return instance;
}
