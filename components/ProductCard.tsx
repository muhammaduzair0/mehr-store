"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import { money } from "@/lib/format";
import { Cart, useWishlist, Wish } from "@/lib/store";
import { HeartIcon } from "./icons";

export default function ProductCard({ p }: { p: Product }) {
  const wishlist = useWishlist();
  const saved = wishlist.includes(p.id);

  return (
    <article className="card">
      <Link className="card-media" href={`/product?id=${p.id}`} aria-label={p.name}>
        {p.badge && <span className="badge">{p.badge}</span>}
        <button
          type="button"
          className={"wish-btn" + (saved ? " on" : "")}
          aria-label={`Save ${p.name}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            Wish.toggle(p.id);
          }}
        >
          <HeartIcon />
        </button>
        <Image
          src="/whisper-campaign.png"
          alt={p.name}
          fill
          className="slot-fill"
          style={{ objectFit: "cover" }}
        />
        <button
          type="button"
          className="quick-add"
          onClick={(e) => {
            e.preventDefault();
            Cart.add(p.id);
          }}
        >
          Add — {money(p.price)}
        </button>
      </Link>
      <Link href={`/product?id=${p.id}`}>
        <div className="card-cat">{p.family}</div>
        <div className="card-name">{p.name}</div>
        <div className="card-notes">{p.notes.slice(0, 3).join(" · ")}</div>
        <div className="card-price tnum">{money(p.price)}</div>
      </Link>
    </article>
  );
}
