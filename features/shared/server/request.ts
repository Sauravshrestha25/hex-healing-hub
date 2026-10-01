import "server-only";
import { headers } from "next/headers";

/**
 * The visitor's IP, used to key rate limits. Only headers set by our own proxies are trusted:
 * Cloudflare's CF-Connecting-IP (it overwrites any value a visitor sends), then Nginx's X-Real-IP,
 * then the last X-Forwarded-For entry (appended by the nearest proxy). The first X-Forwarded-For
 * entry is never used: a client can put anything there and dodge the limits with fake IPs.
 */
export async function clientIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",").map((part) => part.trim()).filter(Boolean);
  return h.get("cf-connecting-ip")?.trim() || h.get("x-real-ip")?.trim() || forwarded?.at(-1) || "unknown";
}
