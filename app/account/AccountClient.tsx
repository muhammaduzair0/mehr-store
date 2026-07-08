"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { CATEGORIES } from "@/lib/data";
import { money } from "@/lib/format";
import {
  Address,
  AddressBook,
  Auth,
  Order,
  Orders,
  findWishProducts,
  useAddress,
  useOrders,
  useUser,
  useWishlist,
} from "@/lib/store";

type AuthMode = "signin" | "register";
type Tab = "overview" | "orders" | "wishlist" | "addresses" | "details";

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function seedOnce() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("mehr_seeded")) return;
  localStorage.setItem("mehr_seeded", "1");
  if (!Orders.all().length) {
    Orders.add({
      no: "#MR-204815",
      date: Date.now() - 1000 * 60 * 60 * 24 * 26,
      email: Auth.user()?.email || "",
      total: 203,
      status: "Delivered",
      items: [
        { key: "noor:50", id: "noor", name: "Noor", cat: "women", type: "Eau de Parfum", ml: 50, price: 145, qty: 1 },
        {
          key: "oud-noir:220",
          id: "oud-noir",
          name: "Oud Noir Candle",
          cat: "candles",
          type: "Scented Candle",
          ml: 220,
          price: 58,
          qty: 1,
        },
      ],
    });
  }
}

function OrderCard({ o }: { o: Order }) {
  const items = o.items || [];
  const names = items.map((i) => i.name + (i.qty > 1 ? " ×" + i.qty : "")).join(", ");
  const cls = o.status === "Delivered" ? "delivered" : "processing";
  return (
    <article className="order-card">
      <div className="order-top">
        <div>
          <span className="order-no">{o.no}</span>
          <span className="order-date">{fmtDate(o.date)}</span>
        </div>
        <span className={"order-status " + cls}>{o.status || "Processing"}</span>
      </div>
      <div className="order-body">
        <div className="oc-thumbs">
          {items.slice(0, 4).map((i, idx) => (
            <div className="oc-thumb" key={idx}>
              <div className="ph">
                <span className="ph-tag">{CATEGORIES[i.cat]?.label || ""}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="oc-info">
          <p className="oc-names">{names}</p>
          <p className="oc-total tnum">{money(o.total)}</p>
        </div>
      </div>
    </article>
  );
}

export default function AccountClient() {
  const params = useSearchParams();
  const user = useUser();
  const orders = useOrders();
  const wishlist = useWishlist();
  const address = useAddress();

  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [tab, setTab] = useState<Tab>((params.get("tab") as Tab) || "overview");
  const [addrSaved, setAddrSaved] = useState(false);
  const [detailsSaved, setDetailsSaved] = useState(false);

  useEffect(() => {
    if (user) seedOnce();
  }, [user]);

  function submitAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = ((form.elements.namedItem("auth-name") as HTMLInputElement)?.value || "").trim() || "Friend";
    const email = (form.elements.namedItem("auth-email") as HTMLInputElement)?.value || "";
    Auth.setUser({ name, email });
    setTab("overview");
  }

  function submitDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("d-name") as HTMLInputElement)?.value || "";
    const email = (form.elements.namedItem("d-email") as HTMLInputElement)?.value || "";
    Auth.setUser({ name, email });
    setDetailsSaved(true);
    setTimeout(() => setDetailsSaved(false), 1800);
  }

  function submitAddress(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (id: string) => (form.elements.namedItem(id) as HTMLInputElement)?.value || "";
    const addr: Address = {
      fn: get("a-fn"),
      ln: get("a-ln"),
      addr: get("a-addr"),
      city: get("a-city"),
      zip: get("a-zip"),
      country: get("a-country"),
    };
    AddressBook.set(addr);
    setAddrSaved(true);
    setTimeout(() => setAddrSaved(false), 1800);
  }

  if (!user) {
    return (
      <main className="wrap acct-page">
        <section className="auth">
          <div className="auth-card">
            <p className="eyebrow center">Mehr Account</p>
            <h1 className="h-lg center" style={{ margin: "14px 0 6px" }}>
              {authMode === "register" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="muted center" style={{ fontSize: 14, marginBottom: 30 }}>
              {authMode === "register"
                ? "Join Mehr — 10% off your first order."
                : "Sign in to track orders and your wishlist."}
            </p>

            <div className="auth-tabs">
              <button
                type="button"
                className={"auth-tab" + (authMode === "signin" ? " active" : "")}
                onClick={() => setAuthMode("signin")}
              >
                Sign in
              </button>
              <button
                type="button"
                className={"auth-tab" + (authMode === "register" ? " active" : "")}
                onClick={() => setAuthMode("register")}
              >
                Create account
              </button>
            </div>

            <form className="auth-form" onSubmit={submitAuth}>
              {authMode === "register" && (
                <div className="field">
                  <input id="auth-name" name="auth-name" placeholder=" " required />
                  <label htmlFor="auth-name">Full name</label>
                </div>
              )}
              <div className="field">
                <input id="auth-email" name="auth-email" type="email" required placeholder=" " />
                <label htmlFor="auth-email">Email address</label>
              </div>
              <div className="field">
                <input id="auth-pass" type="password" required placeholder=" " />
                <label htmlFor="auth-pass">Password</label>
              </div>
              <button className="btn btn-primary btn-block btn-lg" type="submit">
                {authMode === "register" ? "Create account" : "Sign in"}
              </button>
            </form>
            <p className="auth-note">Prototype — any email and password will sign you in. Nothing is sent or stored remotely.</p>
          </div>
        </section>
      </main>
    );
  }

  const wishProducts = findWishProducts(wishlist);

  return (
    <main className="wrap acct-page">
      <section>
        <div className="cart-head">
          <div>
            <p className="eyebrow">My account</p>
            <h1 className="h-xl" style={{ marginTop: 10 }}>
              Hello, {(user.name || "Friend").split(" ")[0]}
            </h1>
          </div>
          <button className="ulink reveal" onClick={() => Auth.signOut()}>
            Sign out
          </button>
        </div>

        <div className="acct-layout">
          <nav className="acct-nav">
            {(
              [
                ["overview", "Overview"],
                ["orders", "Orders"],
                ["wishlist", "Wishlist"],
                ["addresses", "Addresses"],
                ["details", "Details"],
              ] as [Tab, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                className={"acct-link" + (tab === key ? " active" : "")}
                onClick={() => setTab(key)}
              >
                {label}
                {key === "wishlist" && wishlist.length > 0 && <span className="acct-pill">{wishlist.length}</span>}
              </button>
            ))}
          </nav>

          <div className="acct-content">
            {tab === "overview" && (
              <section>
                <div className="ov-stats">
                  <button className="ov-stat" onClick={() => setTab("orders")}>
                    <span className="serif-num">{orders.length}</span>
                    <span>Orders placed</span>
                  </button>
                  <button className="ov-stat" onClick={() => setTab("wishlist")}>
                    <span className="serif-num">{wishlist.length}</span>
                    <span>Saved items</span>
                  </button>
                  <Link className="ov-stat" href="/shop">
                    <span className="serif-num">∞</span>
                    <span>Refills available</span>
                  </Link>
                </div>
                <h2 className="acct-h">Most recent order</h2>
                {orders.length ? (
                  <OrderCard o={orders[0]} />
                ) : (
                  <div className="acct-empty">
                    <p className="muted">No orders yet — your first scent is waiting.</p>
                    <Link className="btn btn-outline" href="/shop" style={{ marginTop: 16 }}>
                      Shop the collection
                    </Link>
                  </div>
                )}
              </section>
            )}

            {tab === "orders" && (
              <section>
                <h2 className="acct-h">Order history</h2>
                {orders.length ? (
                  orders.map((o) => <OrderCard o={o} key={o.no} />)
                ) : (
                  <div className="acct-empty">
                    <p className="h-md" style={{ fontWeight: 300 }}>
                      No orders yet
                    </p>
                    <p className="muted" style={{ margin: "10px 0 22px" }}>
                      When you place an order it will appear here.
                    </p>
                    <Link className="btn btn-outline" href="/shop">
                      Start shopping
                    </Link>
                  </div>
                )}
              </section>
            )}

            {tab === "wishlist" && (
              <section>
                <h2 className="acct-h">Your wishlist</h2>
                {wishProducts.length ? (
                  <ProductGrid products={wishProducts} />
                ) : (
                  <div className="acct-empty">
                    <p className="h-md" style={{ fontWeight: 300 }}>
                      Nothing saved yet
                    </p>
                    <p className="muted" style={{ margin: "10px 0 22px" }}>
                      Tap the heart on any product to keep it here.
                    </p>
                    <Link className="btn btn-outline" href="/shop">
                      Browse the collection
                    </Link>
                  </div>
                )}
              </section>
            )}

            {tab === "addresses" && (
              <section>
                <h2 className="acct-h">Shipping address</h2>
                <form className="acct-form" onSubmit={submitAddress}>
                  <div className="grid-2">
                    <div className="field">
                      <input id="a-fn" name="a-fn" placeholder=" " defaultValue={address.fn || ""} />
                      <label htmlFor="a-fn">First name</label>
                    </div>
                    <div className="field">
                      <input id="a-ln" name="a-ln" placeholder=" " defaultValue={address.ln || ""} />
                      <label htmlFor="a-ln">Last name</label>
                    </div>
                  </div>
                  <div className="field">
                    <input id="a-addr" name="a-addr" placeholder=" " defaultValue={address.addr || ""} />
                    <label htmlFor="a-addr">Address</label>
                  </div>
                  <div className="grid-3">
                    <div className="field">
                      <input id="a-city" name="a-city" placeholder=" " defaultValue={address.city || ""} />
                      <label htmlFor="a-city">City</label>
                    </div>
                    <div className="field">
                      <input id="a-zip" name="a-zip" placeholder=" " defaultValue={address.zip || ""} />
                      <label htmlFor="a-zip">Postcode</label>
                    </div>
                    <div className="field">
                      <input
                        id="a-country"
                        name="a-country"
                        placeholder=" "
                        defaultValue={address.country || "United Kingdom"}
                      />
                      <label htmlFor="a-country">Country</label>
                    </div>
                  </div>
                  <button className="btn btn-primary" type="submit">
                    Save address
                  </button>
                  {addrSaved && <span className="save-ok">Saved ✓</span>}
                </form>
              </section>
            )}

            {tab === "details" && (
              <section>
                <h2 className="acct-h">Account details</h2>
                <form className="acct-form" onSubmit={submitDetails}>
                  <div className="field">
                    <input id="d-name" name="d-name" placeholder=" " defaultValue={user.name || ""} />
                    <label htmlFor="d-name">Full name</label>
                  </div>
                  <div className="field">
                    <input id="d-email" name="d-email" type="email" placeholder=" " defaultValue={user.email || ""} />
                    <label htmlFor="d-email">Email address</label>
                  </div>
                  <div className="field">
                    <input id="d-pass" type="password" placeholder=" " defaultValue="********" />
                    <label htmlFor="d-pass">Password</label>
                  </div>
                  <button className="btn btn-primary" type="submit">
                    Save changes
                  </button>
                  {detailsSaved && <span className="save-ok">Saved ✓</span>}
                </form>
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
