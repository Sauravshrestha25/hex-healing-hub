import type { NextConfig } from "next";

// Allow next/image to optimise images served from the R2 public bucket URL.
const r2Host = process.env.R2_PUBLIC_BASE_URL ? new URL(process.env.R2_PUBLIC_BASE_URL) : null;

const nextConfig: NextConfig = {
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
