import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import DiscoverCollection from "@/components/DiscoverCollection";
import CategoryShowcase from "@/components/CategoryShowcase";
import BestSellers from "@/components/BestSellers";
import Reviews from "@/components/Reviews";

// The homepage's product sections now fetch straight from WooCommerce at
// render time (for SEO — see BestSellers/DiscoverCollection/CategoryShowcase),
// which Next would otherwise bake into the static build once and never touch
// again. Revalidate every 5 minutes so price/stock/new-arrival changes in
// WooCommerce still show up without a full redeploy.
export const revalidate = 300;

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <HeroCarousel />

      {/* DISCOVER COLLECTION */}
      <DiscoverCollection />

      {/* CATEGORY SHOWCASE */}
      <CategoryShowcase />

      {/* MARQUEE STRIP */}
      <div className="strip">
        <div className="strip-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} style={{ display: "contents" }}>
              <span>Clean ingredients</span><span>·</span>
              <span>40% concentration</span><span>·</span>
              <span>Free delivery over Rs 5,000</span><span>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* BEST SELLERS */}
      <BestSellers />

      {/* REVIEWS */}
      <Reviews />

      {/* PROMISE */}
      <section className="section">
        <div className="wrap">
          <div className="center reveal-up" style={{ maxWidth: "46ch", marginInline: "auto" }}>
            <p className="eyebrow">The Mehr promise</p>
            <h2 className="h-lg" style={{ marginTop: 16 }}>Made to last — on skin, and in memory.</h2>
          </div>
          <div className="promise-grid">
            <div className="promise reveal-up">
              <span className="serif-num">40%</span>
              <h3 className="h-sm">Parfum concentration</h3>
              <p className="muted">Higher oil load for scent that stays close all day, not minutes.</p>
            </div>
            <div className="promise reveal-up">
              <span className="serif-num">100%</span>
              <h3 className="h-sm">Authentic</h3>
              <p className="muted">Shipped direct from Mehr — never through resellers or marketplaces.</p>
            </div>
            <div className="promise reveal-up">
              <span className="serif-num">1–2</span>
              <h3 className="h-sm">Days to dispatch</h3>
              <p className="muted">Every order ships within 1–2 business days of being placed.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}