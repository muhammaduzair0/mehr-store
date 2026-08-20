"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Review = {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  product_name?: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="rv-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <polygon points="12 2.5 15.1 9 22 10 17 15 18.2 22 12 18.6 5.8 22 7 15 2 10 8.9 9" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges, reviews]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".rv-card");
    const step = card ? card.offsetWidth + 20 : 320;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="section-sm reviews">
      <div className="wrap">
        <div className="sec-head reveal-up">
          <div>
            <p className="eyebrow">In their words</p>
            <h2 className="h-lg" style={{ marginTop: 14 }}>Loved by our customers</h2>
          </div>
          <div className="rv-arrows">
            <button
              type="button"
              className="rv-arrow"
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              aria-label="Previous reviews"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="rv-arrow"
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
              aria-label="Next reviews"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="rv-track reveal-up" ref={trackRef}>
          {reviews.map((r) => (
            <article className="rv-card" key={r.id}>
              <Stars rating={r.rating} />
              <p className="rv-text">&ldquo;{r.review.replace(/<[^>]*>/g, "")}&rdquo;</p>
              <div className="rv-footer">
                <div>
                  <p className="rv-name">{r.reviewer}</p>
                </div>
                {r.product_name && <span className="rv-scent">{r.product_name}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
