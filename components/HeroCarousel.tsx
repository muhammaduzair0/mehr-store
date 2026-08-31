"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./icons";

interface Slide {
  id: number;
  label: string;
  eyebrow: string;
  headline: string;
  href: string;
  image: string;
  category: string;
  bullets: string[];
}

interface HeroBanner {
  id: number;
  eyebrow: string;
  headline: string;
  href: string;
  image: string | null;
  bullets: string[];
}

// Defaults, used per-slide whenever the WordPress-managed banner (Settings >
// Hero Banners in wp-admin) hasn't set that field yet — including when the
// mu-plugin itself isn't deployed, so the carousel still renders. "category"
// only feeds the product-photo fallback below; it's not WP-editable.
const SLIDE_DEFAULTS = [
  {
    category: "featured",
    label: "Best Sellers",
    eyebrow: "Most Loved",
    headline: "The ones they always ask about.",
    href: "/shop?featured=true",
  },
  {
    category: "unisex",
    label: "Unisex",
    eyebrow: "Gender-Free Fragrance",
    headline: "Scent beyond boundaries.",
    href: "/shop?category=unisex",
  },
  {
    category: "for-him",
    label: "For Him",
    eyebrow: "Men's Collection",
    headline: "Confidence in every note.",
    href: "/shop?category=for-him",
  },
  {
    category: "for-her",
    label: "For Her",
    eyebrow: "Women's Collection",
    headline: "Made for her quiet power.",
    href: "/shop?category=for-her",
  },
];

const FALLBACK = "/whisper-campaign.png";
// A swipe shorter than this reads as a tap/scroll, not an intentional slide change.
const SWIPE_THRESHOLD_PX = 40;

export default function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Text/link/image come from WordPress (Settings > Hero Banners) when set;
  // any field a slide leaves blank there falls back to SLIDE_DEFAULTS. For
  // images specifically, an unset slide falls back further to a live product
  // photo — categories often overlap (the same product can be "featured",
  // "unisex", and "for-him" at once), so fetching only the first match per
  // slide risks every slide showing the same photo. Pull a small pool per
  // category instead and pick one no earlier slide used.
  useEffect(() => {
    async function fetchSlides() {
      let banners: HeroBanner[] = [];
      try {
        const res = await fetch("/api/hero-banners");
        const data = await res.json();
        if (Array.isArray(data) && data.length) banners = data;
      } catch {
        // Hero-banners endpoint not deployed yet — SLIDE_DEFAULTS covers it below.
      }

      const used = new Set<string>();
      const results: Slide[] = [];
      for (let i = 0; i < SLIDE_DEFAULTS.length; i++) {
        const def = SLIDE_DEFAULTS[i];
        const banner = banners[i];
        const eyebrow = banner?.eyebrow || def.eyebrow;
        const headline = banner?.headline || def.headline;
        const href = banner?.href || def.href;
        const bullets = banner?.bullets?.length ? banner.bullets : [];
        let image = banner?.image || "";

        if (!image) {
          try {
            const url = def.category === "featured"
              ? "/api/products?featured=true&per_page=6"
              : `/api/products?category=${def.category}&per_page=6`;
            const res = await fetch(url);
            const data = await res.json();
            const candidates: string[] = Array.isArray(data)
              ? data.map((p) => p?.images?.[0]?.src).filter(Boolean)
              : [];
            image = candidates.find((src) => !used.has(src)) || candidates[0] || FALLBACK;
          } catch {
            image = FALLBACK;
          }
        }
        used.add(image);
        results.push({ id: i, label: def.label, category: def.category, eyebrow, headline, href, image, bullets });
      }
      setSlides(results);
      setLoading(false);
    }
    fetchSlides();
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDE_DEFAULTS.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDE_DEFAULTS.length) % SLIDE_DEFAULTS.length), []);
  const goTo = useCallback((i: number) => setCurrent(i), []);

  // Auto-play
  useEffect(() => {
    if (paused || loading) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, loading, next]);

  // Touch swipe — mirrors the mouse-hover pause so a mid-swipe touch doesn't
  // fight the autoplay timer, then reads the horizontal drag distance on
  // release to decide whether it was a deliberate slide change.
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  }
  function onTouchEnd(e: React.TouchEvent) {
    const startX = touchStartX.current;
    touchStartX.current = null;
    setPaused(false);
    if (startX === null) return;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta < 0) next();
    else prev();
  }

  if (loading) {
    return (
      <div className="hero-carousel hero-carousel--loading">
        <div className="hc-skeleton" />
      </div>
    );
  }

  const slide = slides[current];

  return (
    <section
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Full-bleed slide images */}
      {slides.map((s, i) => (
        <div key={s.id} className={"hc-image" + (i === current ? " active" : "")}>
          {/* Blurred, scaled-up backdrop fills the frame edge-to-edge behind the
              contain-fit photo below — on a very wide viewport, a portrait-ish
              source photo letterboxed with flat gray bars either side looked
              like dead space; this fills those bars with the photo itself
              instead, the way video players letterbox. */}
          <Image
            src={s.image}
            alt=""
            fill
            aria-hidden="true"
            className="hc-slide-bg"
            unoptimized
          />
          <Image
            src={s.image}
            alt={s.label}
            fill
            className="hc-slide-img"
            unoptimized
            priority={i === 0}
          />
        </div>
      ))}

      {/* Soft light overlay for text legibility over any photo */}
      <div className="hc-overlay" />

      {/* Text content, overlaid on the image */}
      <div className="hc-content">
        <div className="hc-content-inner">
          <p className="eyebrow">{slide.eyebrow}</p>
          <h1 className="hc-headline">{slide.headline}</h1>
          {slide.bullets.length > 0 && (
            <ul className="hc-bullets">
              {slide.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
          <Link href={slide.href} className="hc-shop-btn">
            Shop Now <ArrowIcon />
          </Link>
        </div>
      </div>

      {/* Arrow — Prev */}
      <button className="hc-arrow hc-arrow--prev" onClick={prev} aria-label="Previous">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Arrow — Next */}
      <button className="hc-arrow hc-arrow--next" onClick={next} aria-label="Next">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dots — vertical on the right on desktop, bottom-center on mobile */}
      <div className="hc-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={"hc-dot" + (i === current ? " active" : "")}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
