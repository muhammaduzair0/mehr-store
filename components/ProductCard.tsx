"use client";

import Image from "next/image";
import Link from "next/link";
import { WCProduct } from "@/lib/types";
import { Cart, useWishlist, Wish } from "@/lib/store";
import { HeartIcon } from "./icons";
import { money } from "@/lib/format";

export default function ProductCard({ p }: { p: WCProduct }) {
  const wishlist = useWishlist();
  const saved = wishlist.includes(String(p.id));

  const image = p.images?.[0]?.src || "/whisper-campaign.png";
  const badge = p.on_sale ? "Sale" : p.featured ? "Featured" : null;
  const family = p.attributes?.find((a) => a.name === "Scent Family")?.options?.[0] || "";
  const notes  = p.attributes?.find((a) => a.name === "Notes")?.options?.slice(0, 3).join(" · ") || "";

  return (
    <article className="card">
      <Link className="card-media" href={`/product?id=${p.id}`} aria-label={p.name}>
        {badge && <span className="badge">{badge}</span>}
        <button
          type="button"
          className={"wish-btn" + (saved ? " on" : "")}
          aria-label={`Save ${p.name}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            Wish.toggle(String(p.id));
          }}
        >
          <HeartIcon />
        </button>
        <Image
          src={image}
          alt={p.images?.[0]?.alt || p.name}
          fill
          className="slot-fill"
          style={{ objectFit: "cover" }}
          unoptimized
        />
        <button
          type="button"
          className="quick-add"
       onClick={(e) => {
  e.preventDefault();
  Cart.addWC(p);
}}
        >
          Add — {money(p.price)}
        </button>
      </Link>
      <Link href={`/product?id=${p.id}`}>
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
            </>
          ) : (
            money(p.price)
          )}
        </div>
      </Link>
    </article>
  );
}