import Image from "next/image";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { PRODUCTS } from "@/lib/data";

const CATEGORY_TILES = [
  { key: "women", label: "Women", sub: "Floral · Oriental", num: "01" },
  { key: "men", label: "Men", sub: "Woody · Aromatic", num: "02" },
  { key: "lotions", label: "Body Lotions", sub: "Fragranced skincare", num: "03" },
  { key: "candles", label: "Candles", sub: "Home fragrance", num: "04" },
];

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-grid wrap">
          <div className="hero-copy">
            <p className="eyebrow reveal-up">Eau de Parfum · Body · Home</p>
            <h1 className="display reveal-up">
              The part of
              <br />
              you they
              <br />
              remember.
            </h1>
            <p className="lead reveal-up" style={{ maxWidth: "42ch", marginTop: 28 }}>
              Fragrance composed in the cool light of morning — refined, lasting, unmistakably yours.
            </p>
            <div className="hero-cta reveal-up">
              <Link className="btn btn-primary btn-lg" href="/shop">
                Shop the collection
              </Link>
              <Link className="ulink reveal" href="/product?id=noor" style={{ alignSelf: "center" }}>
                Discover Noor →
              </Link>
            </div>
          </div>
          <div className="hero-media reveal-up">
            <Image src="/whisper-campaign.png" alt="Hero campaign" fill className="slot-fill" style={{ objectFit: "cover" }} priority />
          </div>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div className="strip">
        <div className="strip-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} style={{ display: "contents" }}>
              <span>Clean ingredients</span>
              <span>·</span>
              <span>30% concentration</span>
              <span>·</span>
              <span>Cruelty-free</span>
              <span>·</span>
              <span>Refillable bottles</span>
              <span>·</span>
              <span>Complimentary samples</span>
              <span>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal-up">
            <div>
              <p className="eyebrow">Shop by category</p>
              <h2 className="h-lg" style={{ marginTop: 14 }}>
                Find your note
              </h2>
            </div>
            <Link className="ulink reveal" href="/shop">
              View everything
            </Link>
          </div>
          <div className="cat-grid">
            {CATEGORY_TILES.map((c) => (
              <Link key={c.key} className="cat-tile reveal-up" href={`/shop?category=${c.key}`}>
                <Image src="/whisper-campaign.png" alt={c.label} fill className="slot-fill" style={{ objectFit: "cover" }} />
                <div className="cat-meta">
                  <span className="cat-num serif-num">{c.num}</span>
                  <div>
                    <h3 className="h-sm">{c.label}</h3>
                    <p>{c.sub}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section-sm">
        <div className="wrap">
          <div className="sec-head reveal-up">
            <div>
              <p className="eyebrow">Most loved</p>
              <h2 className="h-lg" style={{ marginTop: 14 }}>
                Bestselling scents
              </h2>
            </div>
            <Link className="ulink reveal" href="/shop">
              Shop all
            </Link>
          </div>
          <div className="reveal-up">
            <ProductGrid products={featured} />
          </div>
        </div>
      </section>

      {/* EDITORIAL / SIGNATURE */}
      <section className="editorial">
        <div className="wrap editorial-grid">
          <div className="reveal-up" style={{ position: "relative", width: "100%", aspectRatio: "4/5" }}>
            <Image src="/whisper-campaign.png" alt="Noor bottle detail" fill style={{ objectFit: "cover" }} />
          </div>
          <div className="editorial-copy reveal-up">
            <p className="eyebrow">The signature · 01</p>
            <h2 className="h-xl" style={{ margin: "18px 0 22px" }}>
              Noor
            </h2>
            <p className="lead" style={{ maxWidth: "46ch" }}>
              Damask rose, opened by saffron and grounded in oud. A scent built to be noticed quietly — the one people
              lean in to ask about.
            </p>
            <ul className="note-pyramid" style={{ margin: "32px 0" }}>
              <li>
                <span className="np-label">Top</span>
                <span className="np-val">Saffron · Pink Pepper</span>
              </li>
              <li>
                <span className="np-label">Heart</span>
                <span className="np-val">Damask Rose · Jasmine</span>
              </li>
              <li>
                <span className="np-label">Base</span>
                <span className="np-val">Oud · Amber · Musk</span>
              </li>
            </ul>
            <Link className="btn btn-outline" href="/product?id=noor">
              Discover Noor
            </Link>
          </div>
        </div>
      </section>

      {/* GIFTING */}
      <section className="gifting">
        <div className="wrap gifting-grid">
          <div className="gifting-copy reveal-up">
            <p className="eyebrow" style={{ color: "oklch(0.7 0.015 250)" }}>
              The art of giving
            </p>
            <h2 className="h-xl" style={{ margin: "18px 0 20px", color: "var(--on-ink)" }}>
              Gifts they&apos;ll
              <br />
              remember
            </h2>
            <p className="lead" style={{ color: "oklch(0.82 0.012 250)", maxWidth: "40ch" }}>
              Discovery vials, layering duos and hand-wrapped sets — chosen to make an impression before they&apos;re
              even opened.
            </p>
            <Link
              className="btn"
              href="/shop?category=gifts"
              style={{ marginTop: 30, background: "var(--on-ink)", color: "var(--ink)" }}
            >
              Shop gift sets
            </Link>
          </div>
          <div className="gifting-media reveal-up">
            <Image src="/whisper-campaign.png" alt="Gift set" fill className="slot-fill on-dark" style={{ objectFit: "cover" }} />
          </div>
        </div>
      </section>

      {/* PROMISE */}
      <section className="section">
        <div className="wrap">
          <div className="center reveal-up" style={{ maxWidth: "46ch", marginInline: "auto" }}>
            <p className="eyebrow">The Mehr promise</p>
            <h2 className="h-lg" style={{ marginTop: 16 }}>
              Made to last — on skin, and in memory.
            </h2>
          </div>
          <div className="promise-grid">
            <div className="promise reveal-up">
              <span className="serif-num">30%</span>
              <h3 className="h-sm">Parfum concentration</h3>
              <p className="muted">Higher oil load for scent that stays close all day, not minutes.</p>
            </div>
            <div className="promise reveal-up">
              <span className="serif-num">100%</span>
              <h3 className="h-sm">Cruelty-free</h3>
              <p className="muted">Never tested on animals. Clean, responsibly sourced materials.</p>
            </div>
            <div className="promise reveal-up">
              <span className="serif-num">∞</span>
              <h3 className="h-sm">Refillable</h3>
              <p className="muted">Keep the bottle, refill the scent — less waste, same ritual.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
