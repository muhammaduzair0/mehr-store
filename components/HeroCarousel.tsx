"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface Slide {
  id: number;
  label: string;
  eyebrow: string;
  headline: string;
  href: string;
  image: string;
  category: string;
}

const SLIDE_CONFIG = [
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

export default function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  // Fetch first product image for each category
  useEffect(() => {
    async function fetchSlides() {
      const results = await Promise.all(
        SLIDE_CONFIG.map(async (cfg, i) => {
          try {
            const url = cfg.category === "featured"
              ? "/api/products?featured=true&per_page=1"
              : `/api/products?category=${cfg.category}&per_page=1`;
            const res = await fetch(url);
            const data = await res.json();
            const image = data?.[0]?.images?.[0]?.src || FALLBACK;
            return { id: i, ...cfg, image };
          } catch {
            return { id: i, ...cfg, image: FALLBACK };
          }
        })
      );
      setSlides(results);
      setLoading(false);
    }
    fetchSlides();
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDE_CONFIG.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDE_CONFIG.length) % SLIDE_CONFIG.length), []);
  const goTo = useCallback((i: number) => setCurrent(i), []);

  // Auto-play
  useEffect(() => {
    if (paused || loading) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, loading, next]);

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
    >
      {/* Full-bleed slide images */}
      {slides.map((s, i) => (
        <div key={s.id} className={"hc-image" + (i === current ? " active" : "")}>
          <Image
            src={s.image}
            alt={s.label}
            fill
            style={{ objectFit: "cover" }}
            unoptimized
            priority={i === 0}
          />
        </div>
      ))}

      {/* Dark overlay for text legibility */}
      <div className="hc-overlay" />

      {/* Text content, overlaid on the image */}
      <div className="hc-content">
        <div className="hc-content-inner">
          <p className="eyebrow">{slide.eyebrow}</p>
          <h1 className="hc-headline">{slide.headline}</h1>
          <Link href={slide.href} className="btn btn-primary btn-lg hc-shop-btn">
            Shop Now
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

      {/* Bottom-center dots */}
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