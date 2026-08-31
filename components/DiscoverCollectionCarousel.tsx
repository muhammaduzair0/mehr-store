"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import type { WCProduct } from "@/lib/types";

interface DiscoverCollectionCarouselProps {
  heading: string;
  products: WCProduct[];
}

/**
 * WooCommerce leaves `price` blank ("") on variable products until the
 * min/max variation prices are synced — Number("") is 0, which renders as
 * "Rs 0". Fall back through price → sale_price → regular_price and only
 * treat a value as real once it's a positive number.
 */
function resolvePrice(p: WCProduct): number | null {
  const candidates = [p.price, p.sale_price, p.regular_price];
  for (const c of candidates) {
    const n = Number(c);
    if (c && !Number.isNaN(n) && n > 0) return n;
  }
  return null;
}

// Centering the active slide leaves nothing to show on one side whenever
// it's the first or last real slide — a large empty gap next to a
// floating arrow. Render 3 back-to-back copies of the product list and
// keep `pos` (the track position) parked in the middle copy so there are
// always slides on both sides; only the very first mount starts there,
// every other position change re-centers back into the middle copy
// right after its transition finishes, invisibly (transition off for
// that one jump).
export default function DiscoverCollectionCarousel({ heading, products }: DiscoverCollectionCarouselProps) {
  const n = products.length;
  const loop = n > 1;
  const loopProducts = loop ? [...products, ...products, ...products] : products;

  const [pos, setPos] = useState(loop ? n : 0);
  const [jumping, setJumping] = useState(false);
  const [step, setStep] = useState(0); // slide width + gap, in px
  const [viewportWidth, setViewportWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  // Measure slide width (+ gap) and the *viewport's* width (not the
  // track's — the track is as wide as all slides combined, so a
  // percentage-based translateX against it computes against the wrong
  // box entirely) so the active slide can be centered in px. Re-measures
  // on resize.
  useEffect(() => {
    function measure() {
      const el = slideRef.current;
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!el || !track || !viewport) return;
      const style = getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || "0");
      setStep(el.offsetWidth + gap);
      setViewportWidth(viewport.clientWidth);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [products.length]);

  const index = loop ? ((pos % n) + n) % n : pos;

  const goTo = useCallback(
    (i: number) => {
      if (!n) return;
      if (!loop) {
        setPos((i + n) % n);
        return;
      }
      // Jump within the current copy so a dot click travels the short way,
      // not always back to the middle copy.
      const base = Math.floor(pos / n) * n;
      setPos(base + ((i % n) + n) % n);
    },
    [loop, n, pos]
  );

  const next = useCallback(() => setPos((p) => (loop ? p + 1 : (p + 1) % n)), [loop, n]);
  const prev = useCallback(() => setPos((p) => (loop ? p - 1 : (p - 1 + n) % n)), [loop, n]);

  // Once a transition into the outer copies finishes, snap back to the
  // equivalent slide in the middle copy with the transition switched off,
  // then switch it back on next frame — invisible to the viewer.
  useEffect(() => {
    if (!loop) return;
    if (pos >= n && pos < 2 * n) return;
    const t = setTimeout(() => {
      setJumping(true);
      setPos(n + index);
      requestAnimationFrame(() => requestAnimationFrame(() => setJumping(false)));
    }, 560);
    return () => clearTimeout(t);
  }, [pos, loop, n, index]);

  // Auto-advance every few seconds, pausing on hover/touch.
  useEffect(() => {
    if (n < 2) return;
    const timer = setInterval(() => {
      if (!pausedRef.current) setPos((p) => p + 1);
    }, 3500);
    return () => clearInterval(timer);
  }, [n]);

  const pause = useCallback(() => {
    pausedRef.current = true;
  }, []);
  const resume = useCallback(() => {
    pausedRef.current = false;
  }, []);

  if (!products.length) return null;

  return (
    <section className="discover">
      <h2 className="discover-heading">{heading}</h2>

      <div
        className="dcv-viewport"
        ref={viewportRef}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
      >
        <button className="dcv-arrow dcv-arrow--prev" onClick={prev} aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div
          className="dcv-track"
          ref={trackRef}
          style={{
            transform: `translateX(${viewportWidth / 2 - step / 2 - pos * step}px)`,
            transition: jumping ? "none" : undefined,
          }}
        >
          {loopProducts.map((p, i) => {
            const priceNum = resolvePrice(p);
            const isActive = i === pos;
            return (
              <div
                key={`${p.id}-${i}`}
                ref={i === 0 ? slideRef : undefined}
                className={"dcv-slide" + (isActive ? " active" : "")}
              >
                <Link href={`/product/${p.slug}`} className="dcv-card">
                  <div className="dcv-media">
                    <Image
                      src={p.images?.[0]?.src || "/whisper-campaign.png"}
                      alt={p.name}
                      fill
                      style={{ objectFit: "contain" }}
                      unoptimized
                    />
                  </div>

                  <p className="dcv-name">{p.name}</p>
                  <p className="dcv-from">Starting from</p>
                  <p className="dcv-price">{priceNum !== null ? money(priceNum) : "—"}</p>
                </Link>
              </div>
            );
          })}
        </div>

        <button className="dcv-arrow dcv-arrow--next" onClick={next} aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="dcv-dots">
        {products.map((_, i) => (
          <button
            key={i}
            className={"dcv-dot" + (i === index ? " active" : "")}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
