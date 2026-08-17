"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number; // 1–5
  text: string;
  scent: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Ayesha K.",
    location: "Lahore",
    rating: 5,
    text: "Majesty lasted through a full wedding function — compliments all night. Worth every rupee.",
    scent: "Majesty",
  },
  {
    id: 2,
    name: "Bilal R.",
    location: "Karachi",
    rating: 5,
    text: "Kafka is unlike anything else in my collection. Subtle, confident, and it evolves beautifully on skin.",
    scent: "Kafka",
  },
  {
    id: 3,
    name: "Sana M.",
    location: "Islamabad",
    rating: 4,
    text: "Vasl is my everyday signature now. Clean packaging, faster delivery than expected too.",
    scent: "Vasl",
  },
  {
    id: 4,
    name: "Hamza T.",
    location: "Faisalabad",
    rating: 5,
    text: "Humnafas gets stopped-in-the-hallway reactions. The projection and longevity are outstanding.",
    scent: "Humnafas",
  },
  {
    id: 5,
    name: "Zara N.",
    location: "Lahore",
    rating: 5,
    text: "Arwaah smells expensive without being loud. My go-to gift for close friends now.",
    scent: "Arwaah",
  },
  {
    id: 6,
    name: "Omar F.",
    location: "Rawalpindi",
    rating: 4,
    text: "Real oud, real quality — you can tell the difference from mass-market attars immediately.",
    scent: "Majesty",
  },
];

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

export default function Reviews() {
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
  }, [updateEdges]);

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
          {REVIEWS.map((r) => (
            <article className="rv-card" key={r.id}>
              <Stars rating={r.rating} />
              <p className="rv-text">&ldquo;{r.text}&rdquo;</p>
              <div className="rv-footer">
                <div>
                  <p className="rv-name">{r.name}</p>
                  <p className="rv-location">{r.location}</p>
                </div>
                <span className="rv-scent">{r.scent}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
