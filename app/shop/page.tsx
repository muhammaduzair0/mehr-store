import { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "./ShopClient";
import { wc } from "@/lib/woocommerce";
import type { WCProduct, WCCategory } from "@/lib/types";

type Props = {
  searchParams: Promise<{ category?: string; featured?: string }>;
};

function titleCase(slug: string) {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category, featured } = await searchParams;

  if (featured === "true") {
    return {
      title: "Best Sellers — Mehr",
      description: "The scents our customers reach for again and again — ranked by what actually sells.",
      alternates: { canonical: "/shop?featured=true" },
    };
  }
  if (category) {
    const name = titleCase(category);
    return {
      title: `${name} Perfumes — Shop — Mehr`,
      description: `Shop Mehr's ${name.toLowerCase()} perfumes — long-lasting 40% parfum concentration, delivered across Pakistan with cash on delivery.`,
      alternates: { canonical: `/shop?category=${encodeURIComponent(category)}` },
    };
  }
  return {
    title: "Shop All Perfumes — Mehr",
    description:
      "Shop the full Mehr fragrance collection — long-lasting 40% parfum concentration perfumes for men, women and unisex, delivered across Pakistan with cash on delivery.",
    alternates: { canonical: "/shop" },
  };
}

// Same lifestyle banners used as the category showcase tiles' default photo
// (see CategoryShowcase.tsx) — reused here so a category's shop-page hero
// and its homepage tile show the same image, not a random product photo.
const CATEGORY_BANNER_TITLES: Record<string, string> = {
  men: "Category-Men",
  women: "Category-Women",
  unisex: "Category-Unisex",
};

export default async function ShopPage() {
  const [productsData, categoriesData, bannerEntries] = await Promise.all([
    wc.getProducts({ per_page: "100" }).catch(() => []),
    wc.getCategories().catch(() => []),
    Promise.all(
      Object.entries(CATEGORY_BANNER_TITLES).map(async ([slug, title]) => {
        const media = await wc.getMediaByTitle(title).catch(() => null);
        return [slug, media?.source_url as string | undefined] as const;
      })
    ),
  ]);

  const products: WCProduct[] = Array.isArray(productsData) ? productsData : [];
  const categories: WCCategory[] = Array.isArray(categoriesData)
    ? categoriesData.filter((c: WCCategory) => c.slug !== "uncategorized" && c.count > 0)
    : [];
  const categoryBanners: Record<string, string> = Object.fromEntries(
    bannerEntries.filter((entry): entry is [string, string] => Boolean(entry[1]))
  );

  return (
    <Suspense fallback={null}>
      <ShopClient initialProducts={products} initialCategories={categories} categoryBanners={categoryBanners} />
    </Suspense>
  );
}
