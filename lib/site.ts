// The public, internet-reachable URL for this store — used for sitemap.xml,
// robots.txt, and anywhere else an absolute URL must be sent to a search
// engine or shared externally. Do NOT reuse NEXTAUTH_URL for this: that's
// set to a LAN address for local dev and isn't reachable by real crawlers.
// Set NEXT_PUBLIC_SITE_URL to your production domain before deploying.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
