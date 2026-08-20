import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import { wc } from "@/lib/woocommerce";

export const metadata = { title: "Collections — Mehr" };

// Fetched from WooCommerce at render time, which Next would otherwise bake
// into the static build once and never touch again — revalidate periodically
// so new products/price changes show up without a full redeploy.
export const revalidate = 300;

const ORDER = ["for-her", "for-him", "unisex"];

const STATIC_CATS: Record<string, { label: string; tagline: string; blurb: string }> = {
  "for-her": {
    label: "For Her",
    tagline: "Eau de Parfum",
    blurb:
      "Fragrance for women who don't dress to be noticed — they dress to be remembered. Florals softened with warm woods, musk, and a little audacity.",
  },
  "for-him": {
    label: "For Him",
    tagline: "Eau de Parfum",
    blurb:
      "Structured, magnetic, unmistakably present. Built on woods, spice, and skin-warm musk — the kind that lingers in a room after he's left it.",
  },
  unisex: {
    label: "Unisex",
    tagline: "Eau de Parfum",
    blurb: "No gendered aisles here — just fragrance chosen for how it makes you feel, not who it was marketed to.",
  },
};

async function getProducts() {
  try {
    return await wc.getProducts({ per_page: "100" });
  } catch {
    return [];
  }
}

export default async function CollectionsPage() {
  const products = await getProducts();

  return (
    <main>
      <section className="coll-hero">
        <div className="wrap center">
          <p className="eyebrow">The Collections</p>
          <h1 className="display" style={{ margin: "18px auto 0", maxWidth: "14ch" }}>
            Three ways to be remembered
          </h1>
          <p className="lead" style={{ maxWidth: "52ch", margin: "26px auto 0" }}>
            Each Mehr collection is composed around a single idea: scent that lingers.
          </p>
        </div>
      </section>

      <div className="coll-list">
        {ORDER.map((key, i) => {
          const c = STATIC_CATS[key];
          const items = products.filter((p: any) =>
            p.categories?.some((cat: any) => cat.slug === key)
          );
          const prices = items.map((p: any) => parseFloat(p.price)).filter(Boolean);
          const from   = prices.length ? Math.min(...prices) : 0;
          const num    = String(i + 1).padStart(2, "0");
          const reversed = i % 2 === 1;
          const image = items.find((p: any) => p.images?.[0]?.src)?.images?.[0]?.src || "/whisper-campaign.png";

          return (
            <section className={"coll-row" + (reversed ? " rev" : "")} key={key}>
              <div className="wrap coll-grid">
                <Link className="coll-media" href={`/shop?category=${key}`}>
                  <Image src={image} alt={`${c.label} collection`} fill style={{ objectFit: "contain" }} unoptimized />
                  <span className="coll-num serif-num">{num}</span>
                </Link>
                <div className="coll-copy">
                  <p className="eyebrow">{c.tagline}</p>
                  <h2 className="h-xl" style={{ margin: "14px 0 18px" }}>{c.label}</h2>
                  <p className="lead" style={{ maxWidth: "42ch" }}>{c.blurb}</p>
                  <p className="coll-meta">
                    {items.length} scents{from > 0 ? ` · from ${money(from)}` : ""}
                  </p>
                  <div className="coll-tags">
                    {items.slice(0, 4).map((p: any) => (
                      <Link key={p.id} href={`/product/${p.slug}`}>
                        {p.name}
                      </Link>
                    ))}
                  </div>
                  <Link className="btn btn-outline" href={`/shop?category=${key}`} style={{ marginTop: 8 }}>
                    Explore {c.label}
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}