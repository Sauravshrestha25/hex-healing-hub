import type { NextConfig } from "next";

// Allow next/image to optimise images served from the R2 public bucket URL.
const r2Host = process.env.R2_PUBLIC_BASE_URL ? new URL(process.env.R2_PUBLIC_BASE_URL) : null;

// Sent with every response. No full Content-Security-Policy yet (Next's inline scripts would need
// nonces); frame-ancestors still blocks the site, including the dashboard, from being framed.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // The dashboard's Gallery section was renamed to Portfolio (it manages the /portfolio page).
  async redirects() {
    return [{ source: "/admin/gallery/:path*", destination: "/admin/portfolio/:path*", permanent: true }];
  },
  images: {
    remotePatterns: r2Host
      ? [{ protocol: r2Host.protocol.replace(":", "") as "https" | "http", hostname: r2Host.hostname }]
      : [],
  },
};

export default nextConfig;
