"use client";

import Image from "next/image";
import Link from "next/link";
import { WCProduct } from "@/lib/types";
import { Cart } from "@/lib/store";
import { BagIcon, StarIcon } from "./icons";
import { money } from "@/lib/format";

// WooCommerce leaves `price` blank ("") on variable products until the
// min/max variation prices are synced — Number("") is 0, which renders as
// "Rs 0". Fall back through price → sale_price → regular_price and only
// treat a value as real once it's a positive number.
function resolvePrice(p: WCProduct): number | null {
  const candidates = [p.price, p.sale_price, p.regular_price];
  for (const c of candidates) {
    const n = Number(c);
    if (c && !Number.isNaN(n) && n > 0) return n;
  }
  return null;
}

export default function ProductCard({ p, rank }: { p: WCProduct; rank?: number }) {
  const image  = p.images?.[0]?.src || "/whisper-campaign.png";
  const image2 = p.images?.[1]?.src;
  const soldOut = p.stock_status !== "instock";
  const family = p.attributes?.find((a) => a.name === "Scent Family")?.options?.[0] || "";
  const priceNum = resolvePrice(p);
  const rating = Math.round(Number(p.average_rating) || 0);

  return (
    <article className={"card" + (soldOut ? " card-sold-out" : "")}>
      <div className="card-media">
        <div className="card-media-frame">
          <Link className="card-media-link" href={`/product/${p.slug}`} aria-label={p.name} />
          {rank && !soldOut && <span className="card-rank">No. {String(rank).padStart(2, "0")}</span>}
          <Image
            src={image}
            alt={p.images?.[0]?.alt || p.name}
            fill
            className="slot-fill"
            style={{ objectFit: "contain" }}
            unoptimized
          />
          {image2 && (
            <Image
              src={image2}
              alt=""
              fill
              className="slot-fill card-media-alt"
              style={{ objectFit: "contain" }}
              unoptimized
            />
          )}
          {!soldOut && (
            <button
              type="button"
              className="card-cart-btn"
              aria-label={`Add ${p.name} to cart`}
              onClick={() => Cart.addWC(p)}
            >
              <BagIcon />
            </button>
          )}
        </div>
        {(soldOut || p.on_sale) && (
          <span className={"card-sale-badge" + (soldOut ? " sold-out" : "")}>
            {soldOut ? "Sold Out" : "Sale"}
          </span>
        )}
      </div>
      <Link href={`/product/${p.slug}`}>
        <div className="card-name">{p.name}</div>
        {family && <div className="card-cat">{family}</div>}
        <div className="card-rating" aria-label={`Rated ${rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} filled={i < rating} />
          ))}
        </div>
        <div className="card-reviews">
          {p.rating_count} {p.rating_count === 1 ? "Review" : "Reviews"}
        </div>
        <div className="card-price tnum">
          <span className="card-price-from">from</span>{" "}
          <span className="card-price-now">{priceNum !== null ? money(priceNum) : "—"}</span>
          {p.on_sale && p.regular_price && (
            <span className="card-price-orig">{money(p.regular_price)}</span>
          )}
        </div>
      </Link>
    </article>
  );
}
