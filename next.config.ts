import type { NextConfig } from "next";

// Derive the allowed image host from NEXT_PUBLIC_WC_URL instead of a
// hardcoded dev domain, so switching WooCommerce hosts (e.g. for production)
// doesn't silently break next/image without a matching manual edit here.
function wcRemotePattern() {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_WC_URL || "");
    return [
      {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.56.1"],
  images: {
    remotePatterns: wcRemotePattern(),
  },
  // The production server has 1 CPU and also runs WordPress. A build pre-renders
  // pages that fetch from WordPress; the defaults (many pages in parallel, three
  // retries) queued 150+ Apache workers and took the API down for several
  // minutes during the Nov 12 2026 deploy. Fetch gently instead.
  experimental: {
    staticGenerationMaxConcurrency: 2,
    staticGenerationMinPagesPerWorker: 50,
    staticGenerationRetryCount: 1,
  },
};

export default nextConfig;
