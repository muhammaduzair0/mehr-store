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
    };
  }
  if (category) {
    const name = titleCase(category);
    return {
      title: `${name} — Shop — Mehr`,
      description: `Explore our ${name} collection.`,
    };
  }
  return { title: "Shop — Mehr" };
}

export default async function ShopPage() {
  const [productsData, categoriesData] = await Promise.all([
    wc.getProducts({ per_page: "100" }).catch(() => []),
    wc.getCategories().catch(() => []),
  ]);

  const products: WCProduct[] = Array.isArray(productsData) ? productsData : [];
  const categories: WCCategory[] = Array.isArray(categoriesData)
    ? categoriesData.filter((c: WCCategory) => c.slug !== "uncategorized" && c.count > 0)
    : [];

  return (
    <Suspense fallback={null}>
      <ShopClient initialProducts={products} initialCategories={categories} />
    </Suspense>
  );
}
