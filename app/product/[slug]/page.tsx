import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductClient from "../ProductClient";
import { wc } from "@/lib/woocommerce";
import type { WCProduct, WCVariation } from "@/lib/types";
import { buildProductMetadata, buildProductJsonLd, publicReview } from "@/lib/product-seo";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  try {
    const product = await wc.getProductBySlug(slug);
    return product?.id ? product : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product — Mehr" };
  return buildProductMetadata(product);
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // "You may also like" prefers the store owner's manually curated upsells
  // over WooCommerce's automatic same-category related_ids — an upsell list
  // set in WooCommerce would otherwise have zero effect on the frontend.
  const recommendedIds = product.upsell_ids?.length ? product.upsell_ids : product.related_ids;

  const [relatedResults, reviewsData, variationsData] = await Promise.all([
    recommendedIds?.length
      ? Promise.all(
          recommendedIds.slice(0, 4).map((rid: number) => wc.getProduct(rid).catch(() => null))
        )
      : Promise.resolve([]),
    wc
      .getProductReviews({ product: String(product.id), status: "approved", per_page: "50", orderby: "date", order: "desc" })
      .catch(() => []),
    product.type === "variable" && product.variations?.length
      ? wc.getProductVariations(product.id).catch(() => [])
      : Promise.resolve([]),
  ]);

  const related = (relatedResults as (WCProduct | null)[]).filter(Boolean) as WCProduct[];
  const reviews = (Array.isArray(reviewsData) ? reviewsData : []).map(publicReview);
  const variations: WCVariation[] = Array.isArray(variationsData) ? variationsData : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(product)) }}
      />
      <ProductClient
        product={product}
        related={related}
        initialReviews={reviews}
        initialVariations={variations}
      />
    </>
  );
}
