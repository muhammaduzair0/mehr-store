"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FREE_SHIP, SHIP_COST } from "@/lib/data";
import { money } from "@/lib/format";
import { AddressBook, Auth, Cart, Orders, useAddress, useCart, useUser } from "@/lib/store";
import ProductGrid from "@/components/ProductGrid";
import type { WCProduct } from "@/lib/types";

type Step = "cart" | "checkout";

type Coupon = {
  code: string;
  discount_type: string;
  amount: string;
  minimum_amount?: string;
};

/** Only percent/fixed_cart are computed client-side for the running total —
 *  fixed_product coupons are accepted but priced by WooCommerce at order time. */
function computeDiscount(coupon: Coupon | null, subtotal: number): number {
  if (!coupon) return 0;
  const amount = parseFloat(coupon.amount) || 0;
  if (coupon.discount_type === "percent") return Math.min(subtotal, (subtotal * amount) / 100);
  if (coupon.discount_type === "fixed_cart") return Math.min(subtotal, amount);
  return 0;
}

export default function CartPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("cart");
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const items = useCart();
  const user = useUser();
  const savedAddress = useAddress();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = computeDiscount(coupon, subtotal);

  const [crossSells, setCrossSells] = useState<WCProduct[]>([]);
  const cartIdsKey = [...new Set(items.map((i) => i.id))].sort().join(",");

  // WooCommerce lets the store owner manually curate cross-sells per product
  // ("customers who bought this also want...") — surface them here, which is
  // the standard place for that recommendation, not the product page.
  useEffect(() => {
    const cartIds = cartIdsKey ? cartIdsKey.split(",") : [];
    if (!cartIds.length) {
      setCrossSells([]);
      return;
    }
    let cancelled = false;
    async function run() {
      try {
        const products = await Promise.all(
          cartIds.map((id) => fetch(`/api/products/${id}`).then((r) => (r.ok ? r.json() : null)).catch(() => null))
        );
        const recommendedIds = new Set<number>();
        for (const p of products) {
          for (const id of p?.cross_sell_ids || []) recommendedIds.add(id);
        }
        for (const id of cartIds) recommendedIds.delete(Number(id));

        const ids = [...recommendedIds].slice(0, 4);
        if (!ids.length) {
          if (!cancelled) setCrossSells([]);
          return;
        }
        const recs = await Promise.all(
          ids.map((id) => fetch(`/api/products/${id}`).then((r) => (r.ok ? r.json() : null)).catch(() => null))
        );
        if (!cancelled) setCrossSells(recs.filter((p) => p && p.id));
      } catch {
        if (!cancelled) setCrossSells([]);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [cartIdsKey]);

  async function applyCoupon() {
    const code = couponInput.trim();
    if (!code) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Coupon not found");

      if (data.date_expires && new Date(data.date_expires).getTime() < Date.now()) {
        throw new Error("This code has expired");
      }
      if (data.usage_limit && data.usage_count >= data.usage_limit) {
        throw new Error("This code has reached its usage limit");
      }
      const minimum = parseFloat(data.minimum_amount || "0");
      if (minimum && subtotal < minimum) {
        throw new Error(`This code needs a minimum order of ${money(minimum)}`);
      }

      setCoupon({ code: data.code, discount_type: data.discount_type, amount: data.amount, minimum_amount: data.minimum_amount });
    } catch (err: any) {
      setCoupon(null);
      setCouponError(err.message || "Couldn't apply that code");
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }

  function goCheckout() {
    if (!items.length) return;
    setStep("checkout");
    window.scrollTo(0, 0);
  }
  function backToCart() {
    setStep("cart");
    window.scrollTo(0, 0);
  }

  // Single flat delivery rate below the free-shipping threshold, free above it.
  const discounted   = subtotal - discount;
  const shipCharged  = discounted >= FREE_SHIP ? 0 : SHIP_COST;
  const orderTotal   = discounted + shipCharged;

async function placeOrder(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const form = e.currentTarget;
  const email     = (form.elements.namedItem("email") as HTMLInputElement)?.value || "";
  const phone     = (form.elements.namedItem("phone") as HTMLInputElement)?.value || "";
  const fn        = (form.elements.namedItem("fn")    as HTMLInputElement)?.value || "";
  const ln        = (form.elements.namedItem("ln")    as HTMLInputElement)?.value || "";
  const addr      = (form.elements.namedItem("addr")  as HTMLInputElement)?.value || "";
  const city      = (form.elements.namedItem("city")  as HTMLInputElement)?.value || "";
  const zip       = (form.elements.namedItem("zip")   as HTMLInputElement)?.value || "";
  // We only ship within Pakistan (see Shipping & Returns) — WooCommerce needs
  // the ISO 3166-1 alpha-2 code, not the display name, for zones/tax/couriers.
  const country   = "PK";

  setPlacing(true);
  setOrderError(null);

  try {
    // Send order to WooCommerce — this is the order of record, not just local bookkeeping.
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // WooCommerce defaults new orders to "pending", which fires neither
        // the customer confirmation email nor the admin "New order" alert —
        // "processing" is the correct status for an accepted COD order.
        status:                "processing",
        payment_method:       "cod",
        payment_method_title: "Cash on Delivery",
        set_paid:             false,
        billing: {
          first_name: fn,
          last_name:  ln,
          address_1:  addr,
          city,
          postcode:   zip,
          country,
          email,
          phone,
        },
        shipping: {
          first_name: fn,
          last_name:  ln,
          address_1:  addr,
          city,
          postcode:   zip,
          country,
        },
        line_items: items.map((i) => ({
          product_id: i.id,
          ...(i.variationId ? { variation_id: i.variationId } : {}),
          quantity: i.qty,
        })),
        shipping_lines: [{
          method_id:    shipCharged > 0 ? "flat_rate" : "free_shipping",
          method_title: "Delivery",
          total:        String(shipCharged),
        }],
        coupon_lines: coupon ? [{ code: coupon.code }] : [],
      }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.id || !data?.number) {
      throw new Error(data?.error || "The store couldn't be reached. Please try again.");
    }

    const name = (fn + " " + ln).trim();
    Orders.add({ no: "#" + data.number, date: Date.now(), email, total: orderTotal, status: "Processing", items });
    if (!Auth.user()) Auth.setUser({ name: name || "Friend", email });
    // So the account page's address form (and the next checkout) starts from
    // wherever this order actually shipped, not blank fields every time.
    AddressBook.set({ fn, ln, addr, city, zip, country: "Pakistan" });
    Cart.clear();
    // A real route (not local state) so refreshing, sharing, or coming back
    // later still resolves — order_key proves ownership without requiring login.
    router.push(`/order-confirmation/${data.id}?key=${encodeURIComponent(data.order_key)}`);
  } catch (err: any) {
    console.error("Order failed:", err);
    setOrderError(
      "We couldn't place your order — nothing was charged and your cart is unchanged. " +
      "Please try again, or reach us on WhatsApp if it keeps happening."
    );
  } finally {
    setPlacing(false);
  }
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
                      {i.image ? (
                        <Image src={i.image} alt={i.name} fill style={{ objectFit: "contain" }} unoptimized />
                      ) : (
                        <div className="ph">
                          <span className="ph-tag">{i.cat}</span>
                        </div>
                      )}
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
                <OrderSummary
                  items={items}
                  subtotal={subtotal}
                  forCheckout={false}
                  shipCost={SHIP_COST}
                  coupon={coupon}
                  discount={discount}
                  couponInput={couponInput}
                  setCouponInput={setCouponInput}
                  couponError={couponError}
                  couponLoading={couponLoading}
                  onApplyCoupon={applyCoupon}
                  onRemoveCoupon={removeCoupon}
                />
                <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 20 }} onClick={goCheckout}>
                  Checkout
                </button>
                <p className="secure-note">Secure checkout · Encrypted</p>
              </aside>
            </div>
          )}

          {crossSells.length > 0 && (
            <section className="section-sm">
              <div className="sec-head reveal-up">
                <div>
                  <p className="eyebrow">Pairs well</p>
                  <h2 className="h-lg" style={{ marginTop: 14 }}>You might also like</h2>
                </div>
              </div>
              <ProductGrid products={crossSells} />
            </section>
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
                  <input type="email" required placeholder=" " id="email" name="email" defaultValue={user?.email || ""} />
                  <label htmlFor="email">Email address</label>
                </div>
                <div className="field">
                  <input type="tel" required placeholder=" " id="phone" name="phone" />
                  <label htmlFor="phone">Phone number</label>
                </div>
                <p className="ship-note" style={{ marginTop: -6 }}>
                  Our delivery rider will call this number to confirm your Cash on Delivery order.
                </p>
              </fieldset>
              <fieldset>
                <legend>Shipping address</legend>
                <div className="grid-2">
                  <div className="field">
                    <input required placeholder=" " id="fn" name="fn" defaultValue={savedAddress.fn || ""} />
                    <label htmlFor="fn">First name</label>
                  </div>
                  <div className="field">
                    <input required placeholder=" " id="ln" name="ln" defaultValue={savedAddress.ln || ""} />
                    <label htmlFor="ln">Last name</label>
                  </div>
                </div>
                <div className="field">
                  <input required placeholder=" " id="addr" name="addr" defaultValue={savedAddress.addr || ""} />
                  <label htmlFor="addr">Address</label>
                </div>
                <div className="grid-3">
                  <div className="field">
                    <input required placeholder=" " id="city" name="city" defaultValue={savedAddress.city || ""} />
                    <label htmlFor="city">City</label>
                  </div>
                  <div className="field">
                    <input required placeholder=" " id="zip" name="zip" defaultValue={savedAddress.zip || ""} />
                    <label htmlFor="zip">Postcode</label>
                  </div>
                  <div className="field">
                    <input readOnly placeholder=" " value="Pakistan" id="country" name="country" aria-readonly="true" />
                    <label htmlFor="country">Country</label>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend>Delivery</legend>
                <label className="ship-opt">
                  <input type="radio" name="ship" value="delivery" defaultChecked readOnly />
                  <span>
                    <strong>Delivery</strong>
                    <em>3–5 business days · free over {money(FREE_SHIP)}</em>
                  </span>
                  <span className="ship-price">{discounted >= FREE_SHIP ? "Free" : money(SHIP_COST)}</span>
                </label>
              </fieldset>
              <fieldset>
                <legend>Payment</legend>
                <p className="pay-note">
                  Cash on Delivery — pay in cash when your order arrives. No card details needed, nothing is charged online.
                </p>
              </fieldset>
              {orderError && (
                <p className="checkout-error" role="alert">{orderError}</p>
              )}
              <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={placing}>
                {placing ? "Placing order…" : `Place order · ${money(orderTotal)}`}
              </button>
            </form>

            <aside className="summary-card">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                forCheckout
                shipCost={SHIP_COST}
                coupon={coupon}
                discount={discount}
                couponInput={couponInput}
                setCouponInput={setCouponInput}
                couponError={couponError}
                couponLoading={couponLoading}
                onApplyCoupon={applyCoupon}
                onRemoveCoupon={removeCoupon}
              />
            </aside>
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
  coupon,
  discount,
  couponInput,
  setCouponInput,
  couponError,
  couponLoading,
  onApplyCoupon,
  onRemoveCoupon,
}: {
  items: ReturnType<typeof useCart>;
  subtotal: number;
  forCheckout: boolean;
  shipCost: number;
  coupon: Coupon | null;
  discount: number;
  couponInput: string;
  setCouponInput: (v: string) => void;
  couponError: string | null;
  couponLoading: boolean;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
}) {
  const discounted = subtotal - discount;
  const ship = discounted >= FREE_SHIP ? 0 : forCheckout ? shipCost : null;
  const total = discounted + (ship || 0);

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

      {coupon ? (
        <div className="promo promo-active">
          <span>
            Code <strong className="tnum">{coupon.code}</strong> applied
          </span>
          <button type="button" onClick={onRemoveCoupon}>Remove</button>
        </div>
      ) : (
        <div className="promo">
          <input
            placeholder="Promo code"
            aria-label="Promo code"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onApplyCoupon(); } }}
          />
          <button type="button" onClick={onApplyCoupon} disabled={couponLoading || !couponInput.trim()}>
            {couponLoading ? "Checking…" : "Apply"}
          </button>
        </div>
      )}
      {couponError && <p className="promo-error">{couponError}</p>}

      <div className="summary-row">
        <span>Subtotal</span>
        <span className="tnum">{money(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="summary-row">
          <span>Discount</span>
          <span className="tnum">−{money(discount)}</span>
        </div>
      )}
      <div className="summary-row">
        <span>Shipping</span>
        {ship === null ? <span className="muted">Calculated at checkout</span> : <span className="tnum">{ship === 0 ? "Free" : money(ship)}</span>}
      </div>
      <div className="summary-row total">
        <span>Total</span>
        <span className="tnum">{money(total)}</span>
      </div>
      {discounted < FREE_SHIP ? (
        <p className="ship-note">Add {money(FREE_SHIP - discounted)} for free delivery.</p>
      ) : (
        <p className="ship-note">✓ Free delivery unlocked.</p>
      )}
    </>
  );
}
