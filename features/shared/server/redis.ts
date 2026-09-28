import "server-only";
import Redis from "ioredis";

/** Null when REDIS_HOST is unset (local dev), so callers fall back to in-memory behaviour. */
export function redisFromEnv(): Redis | null {
  const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;
  if (!REDIS_HOST) return null;
  const redis = new Redis({
    host: REDIS_HOST,
    port: Number(REDIS_PORT || 6379),
    password: REDIS_PASSWORD || undefined,
    lazyConnect: true,
    // Fail fast instead of queueing commands forever while Redis is down.
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
  });
  redis.on("error", (error) => console.error("Redis error", error.message));
  redis.connect().catch(() => {});
  return redis;
}
