"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CATEGORIES, FREE_SHIP } from "@/lib/data";
import { money } from "@/lib/format";
import { Cart, useCart } from "@/lib/store";
import { CartDrawerUI, useCartDrawerOpen } from "@/lib/ui";
import { CloseIcon } from "./icons";

export default function CartDrawer() {
  const open = useCartDrawerOpen();
  const items = useCart();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const toFree = Math.max(0, FREE_SHIP - subtotal);
  const count = items.reduce((n, i) => n + i.qty, 0);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") CartDrawerUI.close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className={"scrim" + (open ? " open" : "")} onClick={CartDrawerUI.close} />
      <aside className={"drawer" + (open ? " open" : "")} aria-label="Cart">
        <div className="drawer-head">
          <h3>Your Cart {count ? `(${count})` : ""}</h3>
          <button className="icon-btn" aria-label="Close" onClick={CartDrawerUI.close}>
            <CloseIcon />
          </button>
        </div>
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p className="h-md" style={{ fontWeight: 300, marginBottom: 8 }}>
                Your cart is empty
              </p>
              <p className="muted" style={{ fontSize: 14, marginBottom: 24 }}>
                Discover scent that stays with them.
              </p>
              <Link className="btn btn-outline" href="/shop" onClick={CartDrawerUI.close}>
                Shop the collection
              </Link>
            </div>
          ) : (
            items.map((i) => (
              <div className="line-item" key={i.key}>
                <div className="li-media">
                  <div className="ph">
                    <span className="ph-tag">{CATEGORIES[i.cat]?.label || ""}</span>
                  </div>
                </div>
                <div>
                  <div className="li-name">{i.name}</div>
                  <div className="li-meta">
                    {i.ml ? i.ml + "ml · " : ""}
                    {money(i.price)}
                  </div>
                  <div className="qty">
                    <button aria-label="Decrease" onClick={() => Cart.setQty(i.key, i.qty - 1)}>
                      –
                    </button>
                    <span className="tnum">{i.qty}</span>
                    <button aria-label="Increase" onClick={() => Cart.setQty(i.key, i.qty + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <div className="li-price tnum">{money(i.price * i.qty)}</div>
                  <button className="li-remove" onClick={() => Cart.remove(i.key)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="drawer-foot">
            <div className="summary-row total">
              <span>Subtotal</span>
              <span className="tnum">{money(subtotal)}</span>
            </div>
            <p className="ship-note">
              {toFree > 0
                ? `You're ${money(toFree)} away from free shipping & samples.`
                : "You've unlocked free shipping & two samples."}
            </p>
            <Link className="btn btn-primary btn-block" href="/cart" onClick={CartDrawerUI.close}>
              Checkout
            </Link>
            <Link
              className="btn btn-block"
              href="/cart"
              style={{ marginTop: 8, color: "var(--ink-2)" }}
              onClick={CartDrawerUI.close}
            >
              <span className="ulink reveal">View full cart</span>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
