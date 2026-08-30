import type { MetadataRoute } from "next";
import { wc } from "@/lib/woocommerce";
import { wp } from "@/lib/wordpress";
import { SITE_URL as BASE_URL } from "@/lib/site";

// Otherwise baked into the static build once and never touched again — new
// products/categories in WooCommerce wouldn't reach sitemap.xml until a redeploy.
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/shop?featured=true`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/collections`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/search`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.3 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/shipping-returns`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/sustainability`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/find-your-scent`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const [products, categories, posts] = await Promise.allSettled([
    wc.getProducts({ per_page: "100", status: "publish" }),
    wc.getCategories(),
    wp.getPosts({ per_page: "100" }),
  ]);

  const productRoutes: MetadataRoute.Sitemap =
    products.status === "fulfilled"
      ? (products.value || []).map((p: any) => ({
          url: `${BASE_URL}/product/${p.slug}`,
          lastModified: p.date_modified ? new Date(p.date_modified) : undefined,
          changeFrequency: "weekly",
          priority: 0.7,
        }))
      : [];

  const categoryRoutes: MetadataRoute.Sitemap =
    categories.status === "fulfilled"
      ? (categories.value || [])
          .filter((c: any) => c.slug !== "uncategorized" && c.count > 0)
          .map((c: any) => ({
            url: `${BASE_URL}/shop?category=${c.slug}`,
            changeFrequency: "daily",
            priority: 0.7,
          }))
      : [];

  const postRoutes: MetadataRoute.Sitemap =
    posts.status === "fulfilled"
      ? (posts.value || []).map((post) => ({
          url: `${BASE_URL}/blog/${post.slug}`,
          lastModified: new Date(post.date),
          changeFrequency: "monthly",
          priority: 0.5,
        }))
      : [];

  // Each source (WooCommerce, WordPress) is fetched independently — one
  // being unreachable shouldn't drop the other's routes from the sitemap.
  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...postRoutes];
}
