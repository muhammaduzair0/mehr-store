import { notFound, permanentRedirect } from "next/navigation";
import { wc } from "@/lib/woocommerce";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

// Legacy URL shape (`/product?id=123`) — permanently redirect to the real
// slug route (`/product/[slug]`) so old links/bookmarks/shares still resolve.
export default async function LegacyProductPage({ searchParams }: Props) {
  const { id } = await searchParams;
  if (!id) notFound();

  try {
    const product = await wc.getProduct(Number(id));
    if (!product?.slug) notFound();
    permanentRedirect(`/product/${product.slug}`);
  } catch (err) {
    // permanentRedirect throws internally to short-circuit rendering — let that through.
    if (err && typeof err === "object" && "digest" in err) throw err;
    notFound();
  }
}
