import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";

export const metadata = { title: "Collections — Mehr" };
const ORDER = ["women", "men", "unisex-perfumes"];

const STATIC_CATS: Record<string, { label: string; tagline: string; blurb: string }> = {
  women: {
    label: "Women",
    tagline: "Eau de Parfum",
    blurb: "Florals, musks and orientals composed for presence.",
  },
  men: {
    label: "Men",
    tagline: "Eau de Parfum",
    blurb: "Woods, leathers and aromatics with quiet confidence.",
  },
  "unisex-perfumes": {
    label: "Unisex Perfumes",
    tagline: "Eau de Parfum",
    blurb: "Scents that belong to everyone — bold, balanced, boundary-free.",
  },
};

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products?per_page=100`, {
      cache: 'no-store',
    });
    return res.ok ? res.json() : [];
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
            Five ways to be remembered
          </h1>
          <p className="lead" style={{ maxWidth: "52ch", margin: "26px auto 0" }}>
            From the parfums that announce you to the candle that fills a room — each Mehr collection is composed
            around a single idea: scent that lingers.
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

          return (
            <section className={"coll-row" + (reversed ? " rev" : "")} key={key}>
              <div className="wrap coll-grid">
                <Link className="coll-media" href={`/shop?category=${key}`}>
                  <Image src="/whisper-campaign.png" alt={`${c.label} collection`} fill style={{ objectFit: "cover" }} />
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
                      <Link key={p.id} href={`/product?id=${p.id}`}>
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