import type { MetadataRoute } from "next";
import { SITE_URL as BASE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/cart", "/api/", "/order-confirmation"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
