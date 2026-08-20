import { wc } from "@/lib/woocommerce";
import type { WCProduct } from "@/lib/types";
import DiscoverCollectionCarousel from "@/components/DiscoverCollectionCarousel";

interface DiscoverCollectionProps {
  heading?: string;
  /** How many newest products to show */
  limit?: number;
}

export default async function DiscoverCollection({
  heading = "Discover Our Newest Collection",
  limit = 6,
}: DiscoverCollectionProps) {
  let products: WCProduct[] = [];
  try {
    const data = await wc.getProducts({ per_page: String(limit), orderby: "date", order: "desc" });
    products = Array.isArray(data) ? data : [];
  } catch {
    products = [];
  }

  if (!products.length) return null;

  return <DiscoverCollectionCarousel heading={heading} products={products} />;
}
