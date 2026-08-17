import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import DiscoverCollection from "@/components/DiscoverCollection";
import CategoryShowcase from "@/components/CategoryShowcase";
import BestSellers from "@/components/BestSellers";
import Reviews from "@/components/Reviews";

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
              <span>30% concentration</span><span>·</span>
              <span>Cruelty-free</span><span>·</span>
              <span>Refillable bottles</span><span>·</span>
              <span>Complimentary samples</span><span>·</span>
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