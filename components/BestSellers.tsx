import Image from "next/image";
import Link from "next/link";
import { discountPercent, money } from "@/lib/format";
import { wc } from "@/lib/woocommerce";

/** Curated bestseller list, in display order. "Majesty" is the hero (rank 1). */
const BESTSELLER_NAMES = ["Majesty", "Kafka", "Vasl", "Humnafas"];

interface WCProductLite {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price?: string;
  regular_price?: string;
  on_sale?: boolean;
  images?: { src: string }[];
  categories?: { name: string }[];
}

interface BestSellerItem {
  rank: number;
  name: string;
  slug: string;
  id: number | null;
  image: string;
  price: string | null;
  discountPct: number | null;
  category: string;
}

function resolvePrice(p: WCProductLite): string | null {
  const candidates = [p.price, p.sale_price, p.regular_price];
  for (const c of candidates) {
    const n = Number(c);
    if (c && n > 0) return c;
  }
  return null;
}

async function getBestSellers(): Promise<BestSellerItem[]> {
  try {
    const all: WCProductLite[] = await wc.getProducts({ per_page: "100" });

    const byName = new Map(
      (Array.isArray(all) ? all : []).map((p) => [p.name.trim().toLowerCase(), p])
    );

    return BESTSELLER_NAMES.map((name, i) => {
      const p = byName.get(name.toLowerCase());
      return {
        rank: i + 1,
        name,
        slug: p?.slug ?? name.toLowerCase(),
        id: p?.id ?? null,
        image: p?.images?.[0]?.src ?? "/whisper-campaign.png",
        price: p ? resolvePrice(p) : null,
        discountPct: p?.on_sale && p.regular_price && p.sale_price ? discountPercent(p.regular_price, p.sale_price) : null,
        category: p?.categories?.[0]?.name ?? "Eau de Parfum",
      };
    });
  } catch {
    return BESTSELLER_NAMES.map((name, i) => ({
      rank: i + 1,
      name,
      slug: name.toLowerCase(),
      id: null,
      image: "/whisper-campaign.png",
      price: null,
      discountPct: null,
      category: "Eau de Parfum",
    }));
  }
}

export default async function BestSellers() {
  const items = await getBestSellers();
  const hero = items[0];
  const rest = items.slice(1);

  return (
    <section className="section-sm bestsellers">
      <div className="wrap">
        <div className="sec-head reveal-up">
          <div>
            <p className="eyebrow">Most loved</p>
            <h2 className="h-lg" style={{ marginTop: 14 }}>Bestselling scents</h2>
          </div>
          <Link className="ulink reveal" href="/shop">Shop all</Link>
        </div>

        <div className="bs-grid reveal-up">
          {hero && (
            <Link href={hero.id ? `/product/${hero.slug}` : "/shop"} className="bs-hero">
              <span className="bs-rank">No. 01</span>
              <div className="bs-hero-media">
                <Image
                  src={hero.image}
                  alt={hero.name}
                  fill
                  unoptimized
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="bs-hero-info">
                <p className="bs-cat">{hero.category}</p>
                <h3 className="bs-name">{hero.name}</h3>
                <div className="bs-hero-footer">
                  <span className="bs-price">
                    {hero.price ? money(hero.price) : "Price on request"}
                    {hero.discountPct && <span className="card-discount">−{hero.discountPct}%</span>}
                  </span>
                  <span className="btn btn-primary bs-shop-btn">Shop Now</span>
                </div>
              </div>
            </Link>
          )}

          <div className="bs-side">
            {rest.map((item) => (
              <Link href={item.id ? `/product/${item.slug}` : "/shop"} className="bs-tile" key={item.slug}>
                <span className="bs-rank bs-rank--sm">
                  No. {String(item.rank).padStart(2, "0")}
                </span>
                <div className="bs-tile-media">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="bs-tile-info">
                  <p className="bs-cat">{item.category}</p>
                  <h3 className="bs-name bs-name--sm">{item.name}</h3>
                  <span className="bs-price">
                    {item.price ? money(item.price) : "Price on request"}
                    {item.discountPct && <span className="card-discount">−{item.discountPct}%</span>}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
