"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { HeartIcon } from "@/components/icons";
import { CATEGORIES, PRODUCTS, ProductSize, findProduct } from "@/lib/data";
import { money } from "@/lib/format";
import { Cart, Wish, useWishlist } from "@/lib/store";
import { CartDrawerUI } from "@/lib/ui";

export default function ProductClient() {
  const params = useSearchParams();
  const id = params.get("id") || "noor";
  const p = findProduct(id) || PRODUCTS[0];

  const [activeSize, setActiveSize] = useState<ProductSize>(p.sizes[0]);
  const [qty, setQty] = useState(1);
  const [openAcc, setOpenAcc] = useState(0);

  const wishlist = useWishlist();
  const saved = wishlist.includes(p.id);

  const catLabel = CATEGORIES[p.cat]?.label || p.cat;

  const tiers = useMemo(() => {
    return p.notes.length >= 3
      ? [
          ["Top", p.notes[0]],
          ["Heart", p.notes[1]],
          ["Base", p.notes.slice(2).join(" · ")],
        ]
      : p.notes.map((n) => ["", n]);
  }, [p]);

  const related = useMemo(() => {
    return [...PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id), ...PRODUCTS.filter((x) => x.cat !== p.cat)].slice(
      0,
      4,
    );
  }, [p]);

  return (
    <main data-pdp>
      <div className="wrap pdp-crumb">
        <Link href="/shop">Shop</Link> <span>·</span>{" "}
        <Link href={`/shop?category=${p.cat}`}>{catLabel}</Link> <span>·</span>{" "}
        <span className="muted">{p.name}</span>
      </div>

      <section className="wrap pdp">
        {/* gallery */}
        <div className="pdp-gallery">
          <div className="pdp-main">
            <button
              type="button"
              className={"wish-btn" + (saved ? " on" : "")}
              aria-label="Save to wishlist"
              onClick={() => Wish.toggle(p.id)}
            >
              <HeartIcon />
            </button>
            <Image src="/whisper-campaign.png" alt={p.name} fill className="slot-fill" style={{ objectFit: "cover" }} />
            {p.badge && <span className="pdp-badge">{p.badge}</span>}
          </div>
          <div className="pdp-thumbs">
            {["Detail", "On skin", "Box", "Texture"].map((label) => (
              <div className="pdp-thumb-slot" key={label}>
                <Image src="/whisper-campaign.png" alt={label} fill style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>

        {/* info */}
        <div className="pdp-info">
          <p className="eyebrow">{p.family}</p>
          <h1 className="h-xl" style={{ margin: "12px 0 6px" }}>
            {p.name}
          </h1>
          <p className="pdp-type muted">{p.type}</p>
          <p className="pdp-price tnum">{money(activeSize.price)}</p>
          <p className="lead" style={{ margin: "22px 0 30px", maxWidth: "46ch" }}>
            {p.short}
          </p>

          {p.sizes.length > 1 && (
            <div className="pdp-block">
              <p className="pdp-label">Size</p>
              <div className="size-row">
                {p.sizes.map((s) => (
                  <button
                    key={s.ml}
                    type="button"
                    className={"size-chip" + (s.ml === activeSize.ml ? " active" : "")}
                    onClick={() => setActiveSize(s)}
                  >
                    {s.ml}ml · {money(s.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pdp-actions">
            <div className="qty pdp-qty">
              <button type="button" aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                –
              </button>
              <span className="tnum">{qty}</span>
              <button type="button" aria-label="Increase" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => Cart.add(p.id, activeSize.ml, qty)}
            >
              Add to cart — {money(activeSize.price)}
            </button>
          </div>
          <button
            type="button"
            className="ulink reveal"
            style={{ marginTop: 18, color: "var(--ink-2)" }}
            onClick={CartDrawerUI.open}
          >
            View cart →
          </button>

          <ul className="pdp-assure">
            <li>Complimentary samples with every order</li>
            <li>Free shipping over $95 · 30-day returns</li>
            <li>Refillable — keep the bottle, renew the scent</li>
          </ul>

          <div className="accordion">
            <div className={"acc-item" + (openAcc === 0 ? " open" : "")}>
              <button className="acc-head" onClick={() => setOpenAcc(openAcc === 0 ? -1 : 0)}>
                Notes <span className="acc-ico">+</span>
              </button>
              <div className="acc-body">
                <ul className="note-pyramid">
                  {tiers.map(([l, v], i) => (
                    <li key={i}>
                      <span className="np-label">{l}</span>
                      <span className="np-val">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={"acc-item" + (openAcc === 1 ? " open" : "")}>
              <button className="acc-head" onClick={() => setOpenAcc(openAcc === 1 ? -1 : 1)}>
                How to wear <span className="acc-ico">+</span>
              </button>
              <div className="acc-body">
                <p className="muted" style={{ padding: "4px 0 18px" }}>
                  Spray onto pulse points — wrists, neck, behind the ears — from a hand&apos;s distance. Layer over
                  the matching body lotion to extend wear. Avoid rubbing, which breaks the structure of the scent.
                </p>
              </div>
            </div>
            <div className={"acc-item" + (openAcc === 2 ? " open" : "")}>
              <button className="acc-head" onClick={() => setOpenAcc(openAcc === 2 ? -1 : 2)}>
                Shipping &amp; returns <span className="acc-ico">+</span>
              </button>
              <div className="acc-body">
                <p className="muted" style={{ padding: "4px 0 18px" }}>
                  Carbon-neutral shipping, complimentary over $95. Two scent samples included with every order.
                  Unopened items returnable within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* related */}
      <section className="section-sm" style={{ borderTop: "1px solid var(--line)", marginTop: 40 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-lg" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
              Pairs well with
            </h2>
            <Link className="ulink reveal" href="/shop">
              Shop all
            </Link>
          </div>
          <ProductGrid products={related} />
        </div>
      </section>
    </main>
  );
}
