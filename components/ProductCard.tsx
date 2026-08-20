"use client";

import Image from "next/image";
import Link from "next/link";
import { WCProduct } from "@/lib/types";
import { Cart, useWishlist, Wish } from "@/lib/store";
import { HeartIcon } from "./icons";
import { discountPercent, money } from "@/lib/format";

export default function ProductCard({ p, rank }: { p: WCProduct; rank?: number }) {
  const wishlist = useWishlist();
  const saved = wishlist.includes(String(p.id));

  const image  = p.images?.[0]?.src || "/whisper-campaign.png";
  const image2 = p.images?.[1]?.src;
  const soldOut = p.stock_status !== "instock";
  const pct = p.on_sale ? discountPercent(p.regular_price, p.sale_price) : null;
  const badge = soldOut ? "Sold Out" : pct ? `-${pct}%` : p.featured ? "Featured" : null;
  const family = p.attributes?.find((a) => a.name === "Scent Family")?.options?.[0] || "";
  const notes  = p.attributes?.find((a) => a.name === "Notes")?.options?.slice(0, 3).join(" · ") || "";

  return (
    <article className={"card" + (soldOut ? " card-sold-out" : "")}>
      <div className="card-media">
        <Link className="card-media-link" href={`/product/${p.slug}`} aria-label={p.name} />
        <div className="card-badges">
          {rank && !soldOut && <span className="card-rank">No. {String(rank).padStart(2, "0")}</span>}
          {badge && <span className={"badge" + (soldOut ? " badge-sold-out" : "")}>{badge}</span>}
        </div>
        <button
          type="button"
          className={"wish-btn" + (saved ? " on" : "")}
          aria-label={`Save ${p.name}`}
          onClick={() => Wish.toggle(String(p.id))}
        >
          <HeartIcon />
        </button>
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
          <button type="button" className="quick-add" onClick={() => Cart.addWC(p)}>
            Add — {money(p.price)}
          </button>
        )}
      </div>
      <Link href={`/product/${p.slug}`}>
        {family && <div className="card-cat">{family}</div>}
        <div className="card-name">{p.name}</div>
        {notes && <div className="card-notes">{notes}</div>}
        <div className="card-price tnum">
          {p.on_sale && p.regular_price ? (
            <>
              <span style={{ textDecoration: "line-through", color: "var(--muted)", marginRight: 8 }}>
                {money(p.regular_price)}
              </span>
              {money(p.sale_price)}
              {pct && <span className="card-discount">−{pct}%</span>}
            </>
          ) : (
            money(p.price)
          )}
        </div>
      </Link>
    </article>
  );
}