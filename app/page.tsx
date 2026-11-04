import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import DiscoverCollection from "@/components/DiscoverCollection";
import CategoryShowcase from "@/components/CategoryShowcase";
import BestSellers from "@/components/BestSellers";
import Reviews from "@/components/Reviews";
import { DiscoverSkeleton, CategoryShowcaseSkeleton, BestSellersSkeleton } from "@/components/Skeletons";


// The layout's brand tagline stays the default for share cards; the homepage
// <title>/description carry the terms people actually search for.
const HOME_TITLE = "Mehr — Long-Lasting Perfume Impressions in Pakistan | Karachi";
const HOME_DESCRIPTION =
  "Long-lasting 40% parfum impressions of Baccarat Rouge 540, Gissah Imperial Valley, Oud for Greatness & more. Cash on delivery across Pakistan, 1–2 day delivery in Karachi.";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
};

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

      {/* INTRO — the page's real H1 + crawlable copy. The hero headline is
          seasonal, client-rendered banner text, so it's an h2 now. */}
      <section className="home-intro">
        <div className="wrap center">
          <p className="eyebrow">Mehr · Karachi, Pakistan</p>
          <h1 className="h-lg home-intro-title">Long-lasting perfume impressions, made in Karachi</h1>
          <p className="muted home-intro-copy">
            40% parfum impressions of the fragrances you love — from{" "}
            <Link href="/product/timeless-aura">Gissah Imperial Valley</Link> and{" "}
            <Link href="/product/elia">Baccarat Rouge 540</Link> to{" "}
            <Link href="/product/07">Initio Oud for Greatness</Link>. Cash on delivery across Pakistan, with{" "}
            <Link href="/perfumes-in-karachi">1–2 day delivery in Karachi</Link>.{" "}
            <Link href="/inspired-by">See every designer match →</Link>
          </p>
        </div>
      </section>

      {/* DISCOVER COLLECTION */}
      <Suspense fallback={<DiscoverSkeleton />}>
        <DiscoverCollection />
      </Suspense>

      {/* CATEGORY SHOWCASE */}
      <Suspense fallback={<CategoryShowcaseSkeleton />}>
        <CategoryShowcase />
      </Suspense>

      {/* MARQUEE STRIP */}
      <div className="strip">
        <div className="strip-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} style={{ display: "contents" }}>
              <span>Clean ingredients</span><span>·</span>
              <span>40% concentration</span><span>·</span>
              <span>Free delivery over Rs 5,000</span><span>·</span>
              <span>1–2 day delivery in Karachi</span><span>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* BEST SELLERS */}
      <Suspense fallback={<BestSellersSkeleton />}>
        <BestSellers />
      </Suspense>

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