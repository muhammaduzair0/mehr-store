import type { Metadata } from "next";
import type { WCProduct } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

export function buildProductMetadata(product: WCProduct): Metadata {
  const image = product.images?.[0]?.src;
  const description = (product.short_description || product.description || "")
    .replace(/<[^>]*>/g, "")
    .slice(0, 160)
    .trim();

  return {
    title: `${product.name} — Mehr`,
    description: description || undefined,
    // openGraph fully replaces the layout's default (metadata objects are
    // shallowly merged per-segment, not deep-merged), so re-declare siteName
    // and fall back to the site logo when the product has no photo yet.
    openGraph: {
      title: product.name,
      description: description || undefined,
      siteName: "Mehr",
      type: "website",
      images: [{ url: image || "/logo.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: description || undefined,
      images: [image || "/logo.png"],
    },
  };
}

export function buildProductJsonLd(product: WCProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.length ? product.images.map((i) => i.src) : undefined,
    description: (product.short_description || product.description || "").replace(/<[^>]*>/g, "").trim() || undefined,
    sku: product.sku || String(product.id),
    brand: { "@type": "Brand", name: "Mehr" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "PKR",
      price: product.sale_price || product.price || product.regular_price,
      availability:
        product.stock_status === "outofstock"
          ? "https://schema.org/OutOfStock"
          : product.stock_status === "onbackorder"
          ? "https://schema.org/BackOrder"
          : "https://schema.org/InStock",
    },
    ...(product.rating_count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.average_rating,
            reviewCount: product.rating_count,
          },
        }
      : {}),
  };
}

// WooCommerce review objects include reviewer_email — never forward that to
// the client, the PDP only ever renders these public fields.
export function publicReview(r: any) {
  return {
    id: r.id,
    reviewer: r.reviewer,
    review: r.review,
    rating: r.rating,
    date_created: r.date_created,
  };
}
