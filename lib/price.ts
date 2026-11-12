import type { WCProduct } from "@/lib/types";

/**
 * The price a customer actually pays right now. WooCommerce keeps the old
 * `sale_price` on a product after a scheduled sale ends (until its daily
 * cleanup runs), so `sale_price` alone isn't trustworthy: only use it while
 * `on_sale` is true, otherwise fall back to `price` / `regular_price`.
 */
export function currentPrice(p: Pick<WCProduct, "price" | "regular_price" | "sale_price" | "on_sale">): number {
  const sale = p.on_sale && p.sale_price ? Number(p.sale_price) : 0;
  return sale || Number(p.price) || Number(p.regular_price) || 0;
}
