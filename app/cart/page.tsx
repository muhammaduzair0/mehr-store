"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, FREE_SHIP } from "@/lib/data";
import { money } from "@/lib/format";
import { Auth, Cart, Orders, useCart } from "@/lib/store";

type Step = "cart" | "checkout" | "done";

export default function CartPage() {
  const [step, setStep] = useState<Step>("cart");
  const [shipCost, setShipCost] = useState(0);
  const [confirmation, setConfirmation] = useState<{ email: string; no: string } | null>(null);
  const items = useCart();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  function goCheckout() {
    if (!items.length) return;
    setStep("checkout");
    window.scrollTo(0, 0);
  }
  function backToCart() {
    setStep("cart");
    window.scrollTo(0, 0);
  }

  function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value || "your email";
    const fn = (form.elements.namedItem("fn") as HTMLInputElement)?.value || "";
    const ln = (form.elements.namedItem("ln") as HTMLInputElement)?.value || "";
    const name = (fn + " " + ln).trim();
    const total = subtotal + (subtotal >= FREE_SHIP ? 0 : shipCost);
    const no = "#MR-" + Math.floor(100000 + Math.random() * 899999);
    Orders.add({ no, date: Date.now(), email, total, status: "Processing", items });
    if (!Auth.user()) Auth.setUser({ name: name || "Friend", email });
    Cart.clear();
    setConfirmation({ email, no });
    setStep("done");
    window.scrollTo(0, 0);
  }

  return (
    <main className="wrap cart-page">
      {step === "cart" && (
        <section>
          <div className="cart-head">
            <h1 className="h-xl">Your Cart</h1>
            <Link className="ulink reveal" href="/shop">
              Continue shopping
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="cart-empty-full">
              <p className="h-lg" style={{ fontWeight: 300 }}>
                Your cart is empty
              </p>
              <p className="muted" style={{ margin: "12px 0 28px" }}>
                Discover scent that stays with them long after you&apos;ve left the room.
              </p>
              <Link className="btn btn-primary" href="/shop">
                Shop the collection
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items">
                {items.map((i) => (
                  <div className="cart-row" key={i.key}>
                    <Link className="cart-media" href={`/product?id=${i.id}`}>
                      <div className="ph">
                        <span className="ph-tag">{CATEGORIES[i.cat]?.label || ""}</span>
                      </div>
                    </Link>
                    <div className="cart-info">
                      <div className="cart-row-top">
                        <div>
                          <Link className="cart-name" href={`/product?id=${i.id}`}>
                            {i.name}
                          </Link>
                          <p className="cart-meta">
                            {i.type}
                            {i.ml ? " · " + i.ml + "ml" : ""}
                          </p>
                        </div>
                        <span className="cart-line-price tnum">{money(i.price * i.qty)}</span>
                      </div>
                      <div className="cart-row-bottom">
                        <div className="qty">
                          <button aria-label="Decrease" onClick={() => Cart.setQty(i.key, i.qty - 1)}>
                            –
                          </button>
                          <span className="tnum">{i.qty}</span>
                          <button aria-label="Increase" onClick={() => Cart.setQty(i.key, i.qty + 1)}>
                            +
                          </button>
                        </div>
                        <button className="li-remove" style={{ margin: 0 }} onClick={() => Cart.remove(i.key)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="summary-card">
                <OrderSummary items={items} subtotal={subtotal} forCheckout={false} shipCost={0} />
                <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 20 }} onClick={goCheckout}>
                  Checkout
                </button>
                <p className="secure-note">Secure checkout · Encrypted</p>
              </aside>
            </div>
          )}
        </section>
      )}

      {step === "checkout" && (
        <section>
          <div className="cart-head">
            <h1 className="h-xl">Checkout</h1>
            <button className="ulink reveal" onClick={backToCart}>
              ← Back to cart
            </button>
          </div>
          <div className="cart-layout">
            <form className="checkout-form" onSubmit={placeOrder}>
              <fieldset>
                <legend>Contact</legend>
                <div className="field">
                  <input type="email" required placeholder=" " id="email" name="email" />
                  <label htmlFor="email">Email address</label>
                </div>
              </fieldset>
              <fieldset>
                <legend>Shipping address</legend>
                <div className="grid-2">
                  <div className="field">
                    <input required placeholder=" " id="fn" name="fn" />
                    <label htmlFor="fn">First name</label>
                  </div>
                  <div className="field">
                    <input required placeholder=" " id="ln" name="ln" />
                    <label htmlFor="ln">Last name</label>
                  </div>
                </div>
                <div className="field">
                  <input required placeholder=" " id="addr" name="addr" />
                  <label htmlFor="addr">Address</label>
                </div>
                <div className="grid-3">
                  <div className="field">
                    <input required placeholder=" " id="city" name="city" />
                    <label htmlFor="city">City</label>
                  </div>
                  <div className="field">
                    <input required placeholder=" " id="zip" name="zip" />
                    <label htmlFor="zip">Postcode</label>
                  </div>
                  <div className="field">
                    <input required placeholder=" " id="country" name="country" defaultValue="United Kingdom" />
                    <label htmlFor="country">Country</label>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend>Delivery</legend>
                <label className="ship-opt">
                  <input
                    type="radio"
                    name="ship"
                    value="0"
                    defaultChecked
                    onChange={() => setShipCost(0)}
                  />
                  <span>
                    <strong>Standard</strong>
                    <em>3–5 business days · Free over $95</em>
                  </span>
                  <span className="ship-price">{subtotal >= FREE_SHIP ? "Free" : "$0"}</span>
                </label>
                <label className="ship-opt">
                  <input type="radio" name="ship" value="12" onChange={() => setShipCost(12)} />
                  <span>
                    <strong>Express</strong>
                    <em>1–2 business days</em>
                  </span>
                  <span className="ship-price">$12</span>
                </label>
              </fieldset>
              <fieldset>
                <legend>Payment</legend>
                <div className="field">
                  <input required placeholder=" " id="card" inputMode="numeric" maxLength={19} />
                  <label htmlFor="card">Card number</label>
                </div>
                <div className="grid-2">
                  <div className="field">
                    <input required placeholder=" " id="exp" maxLength={5} />
                    <label htmlFor="exp">MM / YY</label>
                  </div>
                  <div className="field">
                    <input required placeholder=" " id="cvc" maxLength={4} />
                    <label htmlFor="cvc">CVC</label>
                  </div>
                </div>
                <p className="pay-note">This is a design prototype — no payment is processed and no card data is stored.</p>
              </fieldset>
              <button className="btn btn-primary btn-block btn-lg" type="submit">
                Place order · {money(subtotal + (subtotal >= FREE_SHIP ? 0 : shipCost))}
              </button>
            </form>

            <aside className="summary-card">
              <OrderSummary items={items} subtotal={subtotal} forCheckout shipCost={shipCost} />
            </aside>
          </div>
        </section>
      )}

      {step === "done" && confirmation && (
        <section className="confirm">
          <div className="confirm-mark">✓</div>
          <p className="eyebrow">Order confirmed</p>
          <h1 className="h-xl" style={{ margin: "16px auto 14px", maxWidth: "18ch" }}>
            Thank you — your scent is on its way.
          </h1>
          <p className="lead muted">
            A confirmation has been sent to <span>{confirmation.email}</span>. Order{" "}
            <span className="tnum">{confirmation.no}</span>.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 34 }}>
            <Link className="btn btn-primary" href="/shop">
              Continue shopping
            </Link>
            <Link className="btn btn-outline" href="/">
              Back to home
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

function OrderSummary({
  items,
  subtotal,
  forCheckout,
  shipCost,
}: {
  items: ReturnType<typeof useCart>;
  subtotal: number;
  forCheckout: boolean;
  shipCost: number;
}) {
  const ship = subtotal >= FREE_SHIP ? 0 : forCheckout ? shipCost : null;
  const total = subtotal + (ship || 0);

  return (
    <>
      <h2 className="eyebrow" style={{ marginBottom: 18 }}>
        Order summary
      </h2>
      <div className="sum-lines">
        {items.map((i) => (
          <div className="sum-line" key={i.key}>
            <span className="sum-name">
              {i.name}
              <em>
                {i.ml ? i.ml + "ml · " : ""}Qty {i.qty}
              </em>
            </span>
            <span className="tnum">{money(i.price * i.qty)}</span>
          </div>
        ))}
      </div>
      <div className="promo">
        <input placeholder="Promo code" aria-label="Promo code" />
        <button type="button">Apply</button>
      </div>
      <div className="summary-row">
        <span>Subtotal</span>
        <span className="tnum">{money(subtotal)}</span>
      </div>
      <div className="summary-row">
        <span>Shipping</span>
        {ship === null ? <span className="muted">Calculated at checkout</span> : <span className="tnum">{ship === 0 ? "Free" : money(ship)}</span>}
      </div>
      <div className="summary-row total">
        <span>Total</span>
        <span className="tnum">{money(total)}</span>
      </div>
      {subtotal < FREE_SHIP ? (
        <p className="ship-note">Add {money(FREE_SHIP - subtotal)} for free shipping &amp; two samples.</p>
      ) : (
        <p className="ship-note">✓ Free shipping &amp; two samples unlocked.</p>
      )}
    </>
  );
}
