import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { wc } from "@/lib/woocommerce";
import type { WCProduct } from "@/lib/types";
import { money } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { inspiredBy, displayName, INSPIRED_DISCLAIMER } from "@/lib/inspired";
import { currentPrice } from "@/lib/price";

// Hub for "<designer perfume> impression/alternative Pakistan" searches: one
// row per original, linking to the matching Mehr product. Driven entirely by
// each product's "Inspired By" attribute in WooCommerce.
export const revalidate = 300;

const DESCRIPTION =
  "Find the Mehr impression of your favourite designer perfume — Baccarat Rouge 540, Gissah Imperial Valley, Initio Oud for Greatness, Black Opium, Good Girl and more. Long-lasting 40% parfum, delivered across Pakistan.";

export const metadata: Metadata = {
  title: "Designer Perfume Impressions in Pakistan — Inspired By | Mehr",
  description: DESCRIPTION,
  alternates: { canonical: "/inspired-by" },
  openGraph: {
    title: "Designer Perfume Impressions — Mehr",
    description: DESCRIPTION,
    siteName: "Mehr",
    type: "website",
    url: "/inspired-by",
  },
};

async function getInspiredProducts(): Promise<WCProduct[]> {
  try {
    const data = await wc.getProducts({ per_page: "100", status: "publish" });
    const list: WCProduct[] = Array.isArray(data) ? data : [];
    return list.filter((p) => inspiredBy(p)).sort((a, b) => inspiredBy(a).localeCompare(inspiredBy(b)));
  } catch {
    return [];
  }
}

export default async function InspiredByPage() {
  const products = await getInspiredProducts();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mehr designer perfume impressions",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${displayName(p.name)} — inspired by ${inspiredBy(p)}`,
      url: `${SITE_URL}/product/${p.slug}`,
    })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow">Inspired by</p>
          <h1 className="h-xl">Designer perfume impressions in Pakistan</h1>
          <p className="lead" style={{ maxWidth: "62ch", marginTop: 14 }}>
            Love a designer fragrance but not the Rs 30,000+ price tag? Every Mehr scent is our own impression of a
            fragrance you already know — made at 40% parfum concentration to last all day, delivered across Pakistan
            with cash on delivery (1–2 days in Karachi).
          </p>
        </div>
      </section>

      <div className="wrap" style={{ paddingBottom: 80 }}>
        {products.length === 0 ? (
          <p className="muted">Our collection is loading — please check back shortly or <Link className="ulink" href="/shop">browse the shop</Link>.</p>
        ) : (
          <div className="inspired-list">
            {products.map((p) => {
              const price = currentPrice(p);
              const image = p.images?.[0]?.src;
              return (
                <Link key={p.id} href={`/product/${p.slug}`} className="inspired-row">
                  <span className="inspired-thumb">
                    {image && <Image src={image} alt={displayName(p.name)} fill style={{ objectFit: "contain" }} unoptimized />}
                  </span>
                  <span className="inspired-original">
                    <span className="inspired-label">If you love</span>
                    <span className="inspired-name">{inspiredBy(p)}</span>
                  </span>
                  <span className="inspired-mehr">
                    <span className="inspired-label">Try</span>
                    <span className="inspired-name">{displayName(p.name)}</span>
                  </span>
                  <span className="inspired-price tnum">{price ? money(price) : ""}</span>
                </Link>
              );
            })}
          </div>
        )}

        <section className="blog-post-body" style={{ maxWidth: "70ch", marginTop: 48 }}>
          <h2>What is a perfume impression?</h2>
          <p>
            An impression (sometimes called an inspired perfume, alternative or dupe) is a fragrance composed to
            capture the character of a well-known designer or niche scent. Mehr impressions are our own compositions
            — built around the same signature notes, at a high 40% parfum concentration so they last through
            Pakistan&apos;s heat.
          </p>
          <h2>How to choose</h2>
          <p>
            Start with the designer scent you already love, then check the full top, heart and base notes on each
            product page. Not sure? Take the <Link href="/find-your-scent">scent quiz</Link> or read our guide to{" "}
            <Link href="/blog">choosing your signature scent</Link>.
          </p>
          <p className="pdp-disclaimer">{INSPIRED_DISCLAIMER}</p>
        </section>
      </div>
    </main>
  );
}
