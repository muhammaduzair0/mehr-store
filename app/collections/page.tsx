import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, PRODUCTS } from "@/lib/data";
import { money } from "@/lib/format";

export const metadata = { title: "Collections — Mehr" };

const ORDER = ["women", "men", "lotions", "candles", "gifts"];

export default function CollectionsPage() {
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
          const c = CATEGORIES[key];
          const items = PRODUCTS.filter((p) => p.cat === key);
          const from = Math.min(...items.map((p) => p.price));
          const num = String(i + 1).padStart(2, "0");
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
                  <h2 className="h-xl" style={{ margin: "14px 0 18px" }}>
                    {c.label}
                  </h2>
                  <p className="lead" style={{ maxWidth: "42ch" }}>
                    {c.blurb}
                  </p>
                  <p className="coll-meta">
                    {items.length} scents · from {money(from)}
                  </p>
                  <div className="coll-tags">
                    {items.slice(0, 4).map((p) => (
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

      <section className="gifting">
        <div className="wrap center" style={{ maxWidth: "46ch", marginInline: "auto" }}>
          <p className="eyebrow" style={{ color: "oklch(0.7 0.015 250)" }}>
            Not sure where to start?
          </p>
          <h2 className="h-xl" style={{ margin: "18px 0 22px", color: "var(--on-ink)" }}>
            Try the Discovery Set
          </h2>
          <p className="lead" style={{ color: "oklch(0.82 0.012 250)" }}>
            Five signature scents in travel vials — its cost credited toward your first full-size bottle.
          </p>
          <Link
            className="btn"
            href="/product?id=discovery"
            style={{ marginTop: 30, background: "var(--on-ink)", color: "var(--ink)" }}
          >
            Shop the set — $40
          </Link>
        </div>
      </section>
    </main>
  );
}
