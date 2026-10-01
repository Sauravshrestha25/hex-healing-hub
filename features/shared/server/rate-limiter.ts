import "server-only";
import type Redis from "ioredis";

/** Fixed-window counter keyed by an arbitrary string (usually an IP address). */
export interface RateLimiter {
  /** Attempts allowed per window. */
  readonly limit: number;
  isLimited(key: string): Promise<boolean>;
  /** Attempts used in the current window and time until it resets (0 when no window is open). */
  status(key: string): Promise<{ used: number; resetInMs: number }>;
  hit(key: string): Promise<void>;
  clear(key: string): Promise<void>;
}

/** Per-process fallback for local development when Redis isn't configured. */
export class MemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, { count: number; resetAt: number }>();

  constructor(
    readonly limit: number,
    private readonly windowMs: number,
  ) {}

  async isLimited(key: string) {
    return (this.current(key)?.count ?? 0) >= this.limit;
  }

  async status(key: string) {
    const bucket = this.current(key);
    return bucket ? { used: bucket.count, resetInMs: Math.max(0, bucket.resetAt - Date.now()) } : { used: 0, resetInMs: 0 };
  }

  async hit(key: string) {
    const bucket = this.current(key);
    if (bucket) bucket.count += 1;
    else this.buckets.set(key, { count: 1, resetAt: Date.now() + this.windowMs });
  }

  async clear(key: string) {
    this.buckets.delete(key);
  }

  private current(key: string) {
    const bucket = this.buckets.get(key);
    if (bucket && bucket.resetAt < Date.now()) {
      this.buckets.delete(key);
      return undefined;
    }
    return bucket;
  }
}

/**
 * Shared across processes and restarts. If Redis is unreachable it fails open (logs, allows the request):
 * a Redis outage must not take down login or the contact form. Passwords are still bcrypt-slow.
 */
export class RedisRateLimiter implements RateLimiter {
  constructor(
    private readonly redis: Redis,
    private readonly name: string,
    readonly limit: number,
    private readonly windowMs: number,
  ) {}

  private key(key: string) {
    // Namespaced: webx-redis is shared by every WebX app on the server.
    return `hex-healing:ratelimit:${this.name}:${key}`;
  }

  async isLimited(key: string) {
    try {
      return Number(await this.redis.get(this.key(key))) >= this.limit;
    } catch (error) {
      console.error("Rate limiter unavailable", error);
      return false;
    }
  }

  async status(key: string) {
    try {
      const [[, used], [, ttl]] = (await this.redis.multi().get(this.key(key)).pttl(this.key(key)).exec()) as [
        [Error | null, string | null],
        [Error | null, number],
      ];
      return { used: Number(used ?? 0), resetInMs: Math.max(0, Number(ttl)) };
    } catch (error) {
      console.error("Rate limiter unavailable", error);
      return { used: 0, resetInMs: 0 };
    }
  }

  async hit(key: string) {
    try {
      // The window starts at the first hit; later hits don't extend it.
      await this.redis.multi().incr(this.key(key)).pexpire(this.key(key), this.windowMs, "NX").exec();
    } catch (error) {
      console.error("Rate limiter unavailable", error);
    }
  }

  async clear(key: string) {
    try {
      await this.redis.del(this.key(key));
    } catch (error) {
      console.error("Rate limiter unavailable", error);
    }
  }
}
