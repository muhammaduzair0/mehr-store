import type { Metadata } from "next";
import type { WCProduct } from "@/lib/types";
import { SITE_URL } from "@/lib/site";
import { decodeEntities } from "@/lib/wordpress";
import { FREE_SHIP, SHIP_COST } from "@/lib/data";

// WooCommerce descriptions are HTML with encoded entities ("&#8211;") — strip
// tags AND decode, or Next re-escapes the literal entity text and Google shows
// "gourmand &#8211; daring" in the search snippet.
function plainText(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

// Cut at a word boundary so snippets don't end mid-word.
function truncate(text: string, max = 158): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:–—-]+$/, "") + "…";
}

export function buildProductMetadata(product: WCProduct): Metadata {
  const image = product.images?.[0]?.src;
  const description = truncate(plainText(product.short_description || product.description || ""));
  const path = `/product/${product.slug}`;

  return {
    title: `${product.name} — Mehr`,
    description: description || undefined,
    alternates: { canonical: path },
    // openGraph fully replaces the layout's default (metadata objects are
    // shallowly merged per-segment, not deep-merged), so re-declare siteName
    // and fall back to the site logo when the product has no photo yet.
    openGraph: {
      title: product.name,
      description: description || undefined,
      siteName: "Mehr",
      type: "website",
      url: path,
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

// Mirrors the shipping/returns terms on /shipping-returns and /faq — keep in
// sync. Google's merchant listings (Shopping tab, free listings) flag products
// that don't declare these.
function shippingDetails(price: number) {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: price >= FREE_SHIP ? 0 : SHIP_COST, currency: "PKR" },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "PK" },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 5, unitCode: "DAY" },
    },
  };
}

const RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "PK",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 7,
  returnMethod: "https://schema.org/ReturnByMail",
};

export function buildProductJsonLd(product: WCProduct) {
  const price = product.sale_price || product.price || product.regular_price;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.length ? product.images.map((i) => i.src) : undefined,
    description: plainText(product.description || product.short_description || "") || undefined,
    sku: product.sku || String(product.id),
    brand: { "@type": "Brand", name: "Mehr" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "PKR",
      price,
      availability:
        product.stock_status === "outofstock"
          ? "https://schema.org/OutOfStock"
          : product.stock_status === "onbackorder"
          ? "https://schema.org/BackOrder"
          : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: shippingDetails(Number(price) || 0),
      hasMerchantReturnPolicy: RETURN_POLICY,
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
