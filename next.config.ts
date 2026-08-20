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
};

export default nextConfig;
