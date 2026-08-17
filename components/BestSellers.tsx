"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/** Curated bestseller list, in display order. "Majesty" is the hero (rank 1). */
const BESTSELLER_NAMES = ["Majesty", "Kafka", "Vasl", "Humnafas", "Arwaah"];

interface WCProductLite {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price?: string;
  regular_price?: string;
  images?: { src: string }[];
  categories?: { name: string }[];
}

interface BestSellerItem {
  rank: number;
  name: string;
  slug: string;
  image: string;
  price: string | null;
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

export default function BestSellers() {
  const [items, setItems] = useState<BestSellerItem[] | null>(null);

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const res = await fetch(`/api/products?per_page=100`, { cache: "no-store" });
        const all: WCProductLite[] = res.ok ? await res.json() : [];

        const byName = new Map(
          all.map((p) => [p.name.trim().toLowerCase(), p])
        );

        const resolved: BestSellerItem[] = BESTSELLER_NAMES.map((name, i) => {
          const p = byName.get(name.toLowerCase());
          return {
            rank: i + 1,
            name,
            slug: p?.slug ?? name.toLowerCase(),
            image: p?.images?.[0]?.src ?? "/whisper-campaign.png",
            price: p ? resolvePrice(p) : null,
            category: p?.categories?.[0]?.name ?? "Eau de Parfum",
          };
        });

        setItems(resolved);
      } catch {
        setItems(
          BESTSELLER_NAMES.map((name, i) => ({
            rank: i + 1,
            name,
            slug: name.toLowerCase(),
            image: "/whisper-campaign.png",
            price: null,
            category: "Eau de Parfum",
          }))
        );
      }
    }
    fetchBestSellers();
  }, []);

  const hero = items?.[0];
  const rest = items?.slice(1) ?? [];

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

        {!items ? (
          <div className="bs-grid reveal-up">
            <div className="bs-hero bs-skeleton" />
            <div className="bs-side">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bs-tile bs-skeleton" />
              ))}
            </div>
          </div>
        ) : (
          <div className="bs-grid reveal-up">
            {hero && (
              <Link href={`/product/${hero.slug}`} className="bs-hero">
                <span className="bs-rank">No. 01</span>
                <div className="bs-hero-media">
                  <Image
                    src={hero.image}
                    alt={hero.name}
                    fill
                    unoptimized
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="bs-hero-info">
                  <p className="bs-cat">{hero.category}</p>
                  <h3 className="bs-name">{hero.name}</h3>
                  <div className="bs-hero-footer">
                    <span className="bs-price">
                      {hero.price ? `Rs ${Number(hero.price).toLocaleString()}` : "Price on request"}
                    </span>
                    <span className="btn btn-primary bs-shop-btn">Shop Now</span>
                  </div>
                </div>
              </Link>
            )}

            <div className="bs-side">
              {rest.map((item) => (
                <Link href={`/product/${item.slug}`} className="bs-tile" key={item.slug}>
                  <span className="bs-rank bs-rank--sm">
                    No. {String(item.rank).padStart(2, "0")}
                  </span>
                  <div className="bs-tile-media">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="bs-tile-info">
                    <p className="bs-cat">{item.category}</p>
                    <h3 className="bs-name bs-name--sm">{item.name}</h3>
                    <span className="bs-price">
                      {item.price ? `Rs ${Number(item.price).toLocaleString()}` : "Price on request"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
