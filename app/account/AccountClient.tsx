"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { money } from "@/lib/format";
import {
  Address,
  AddressBook,
  Auth,
  Order,
  useAddress,
  useOrders,
  useUser,
  useWishlist,
} from "@/lib/store";

type AuthMode = "signin" | "register";
type Tab = "overview" | "orders" | "wishlist" | "addresses" | "details";
const VALID_TABS: Tab[] = ["overview", "orders", "wishlist", "addresses", "details"];

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const STATUS_LABEL: Record<string, string> = {
  completed:  "Delivered",
  processing: "Processing",
  "on-hold":  "On hold",
  pending:    "Pending payment",
  cancelled:  "Cancelled",
  refunded:   "Refunded",
  failed:     "Failed",
};

/** Map a WooCommerce order (from /api/orders) into the local Order shape the UI renders. */
function mapWcOrder(o: any): Order {
  return {
    no: "#" + (o.number ?? o.id),
    date: new Date(o.date_created).getTime(),
    email: o.billing?.email || "",
    total: parseFloat(o.total) || 0,
    status: STATUS_LABEL[o.status] || o.status,
    items: (o.line_items || []).map((li: any) => ({
      key: String(li.id),
      id: String(li.product_id),
      variationId: li.variation_id || null,
      name: li.name,
      cat: "",
      type: "",
      ml: null,
      price: li.quantity ? parseFloat(li.total) / li.quantity : parseFloat(li.total) || 0,
      qty: li.quantity || 1,
      image: li.image?.src || null,
    })),
  };
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
              {i.image ? (
                <Image src={i.image} alt={i.name} fill style={{ objectFit: "contain" }} unoptimized />
              ) : (
                <div className="ph">
                  <span className="ph-tag">{i.cat || ""}</span>
                </div>
              )}
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
  const localOrders = useOrders();
  const wishlist = useWishlist();
  const address = useAddress();

  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>((params.get("tab") as Tab) || "overview");
  const [addrSaved, setAddrSaved] = useState(false);
  const [detailsSaved, setDetailsSaved] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [wishProducts, setWishProducts] = useState<any[]>([]);
  const [wcOrders, setWcOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // The session cookie (set by /api/auth/login|register) is the real source
  // of truth — re-check it on mount so a hard refresh (or a session revoked/
  // expired server-side) doesn't leave stale local state saying "signed in".
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.email) Auth.setUser({ name: data.name, email: data.email });
        else if (Auth.user()) Auth.signOut();
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // The initial `tab` state only reads the URL once, at mount — a header/
  // footer link to e.g. /account?tab=wishlist while already on this page
  // wouldn't otherwise switch tabs. Re-sync whenever the param changes.
  useEffect(() => {
    const requested = params.get("tab") as Tab | null;
    if (requested && VALID_TABS.includes(requested)) setTab(requested);
  }, [params]);

  // Pull real order history from WooCommerce by billing email — the local
  // list is device-only and just a fallback for the moment right after checkout.
  useEffect(() => {
    if (!user?.email) {
      setWcOrders([]);
      return;
    }
    let cancelled = false;
    async function run() {
      setOrdersLoading(true);
      try {
        const res = await fetch(`/api/orders`);
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) setWcOrders(data.map(mapWcOrder));
      } catch {
        if (!cancelled) setWcOrders([]);
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [user?.email]);

  const orders = useMemo(() => {
    const byNo = new Map<string, Order>();
    for (const o of localOrders) byNo.set(o.no, o);
    for (const o of wcOrders) byNo.set(o.no, o); // WooCommerce is authoritative where it overlaps
    return [...byNo.values()].sort((a, b) => b.date - a.date);
  }, [localOrders, wcOrders]);

  useEffect(() => {
    if (!wishlist.length) {
      setWishProducts([]);
      return;
    }
    async function fetchWishProducts() {
      const results = await Promise.all(
        wishlist.map((id) =>
          fetch(`/api/products/${id}`)
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        )
      );
      setWishProducts(results.filter((p) => p && p.id));
    }
    fetchWishProducts();
  }, [wishlist]);

  async function submitAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = ((form.elements.namedItem("auth-name") as HTMLInputElement)?.value || "").trim();
    const email = (form.elements.namedItem("auth-email") as HTMLInputElement)?.value || "";
    const password = (form.elements.namedItem("auth-pass") as HTMLInputElement)?.value || "";

    setAuthLoading(true);
    setAuthError(null);
    try {
      if (authMode === "register") {
        const regRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const regData = await regRes.json().catch(() => null);
        if (!regRes.ok) throw new Error(regData?.error || "Could not create your account.");
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Invalid email or password.");

      Auth.setUser({ name: data.name || name || "Friend", email: data.email });
      setTab("overview");
    } catch (err: any) {
      setAuthError(err.message || "Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function signOut() {
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    Auth.signOut();
  }

  async function submitDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("d-name") as HTMLInputElement)?.value || "";
    const passwordInput = (form.elements.namedItem("d-pass") as HTMLInputElement)?.value || "";
    // The field is pre-filled with a placeholder "********" purely for visual
    // consistency with a real password field — only send a new password if
    // the user actually changed it.
    const password = passwordInput && passwordInput !== "********" ? passwordInput : "";

    setDetailsError(null);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Could not save your changes.");
      Auth.setUser({ name: data.name, email: data.email });
      setDetailsSaved(true);
      setTimeout(() => setDetailsSaved(false), 1800);
    } catch (err: any) {
      setDetailsError(err.message || "Could not save your changes.");
    }
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
                <input
                  id="auth-pass"
                  name="auth-pass"
                  type="password"
                  required
                  minLength={authMode === "register" ? 8 : undefined}
                  placeholder=" "
                />
                <label htmlFor="auth-pass">Password</label>
              </div>
              {authError && (
                <p className="checkout-error" role="alert">{authError}</p>
              )}
              <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={authLoading}>
                {authLoading
                  ? authMode === "register" ? "Creating account…" : "Signing in…"
                  : authMode === "register" ? "Create account" : "Sign in"}
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

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
          <button className="ulink reveal" onClick={signOut}>
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
                    <span className="serif-num">10%</span>
                    <span>Off with WELCOME10</span>
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
                {ordersLoading && !orders.length ? (
                  <p className="muted">Loading your orders…</p>
                ) : orders.length ? (
                  orders.map((o) => <OrderCard o={o} key={o.no} />)
                ) : (
                  <div className="acct-empty">
                    <p className="h-md" style={{ fontWeight: 300 }}>No orders yet</p>
                    <p className="muted" style={{ margin: "10px 0 22px" }}>
                      When you place an order it will appear here.
                    </p>
                    <Link className="btn btn-outline" href="/shop">Start shopping</Link>
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
                    <p className="h-md" style={{ fontWeight: 300 }}>Nothing saved yet</p>
                    <p className="muted" style={{ margin: "10px 0 22px" }}>
                      Tap the heart on any product to keep it here.
                    </p>
                    <Link className="btn btn-outline" href="/shop">Browse the collection</Link>
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
                      <input id="a-country" name="a-country" placeholder=" " defaultValue={address.country || "Pakistan"} />
                      <label htmlFor="a-country">Country</label>
                    </div>
                  </div>
                  <button className="btn btn-primary" type="submit">Save address</button>
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
                    <input id="d-email" type="email" placeholder=" " defaultValue={user.email || ""} disabled />
                    <label htmlFor="d-email">Email address</label>
                  </div>
                  <p className="muted" style={{ fontSize: 12.5, margin: "-10px 0 4px" }}>
                    Your email is your sign-in — contact us to change it.
                  </p>
                  <div className="field">
                    <input id="d-pass" name="d-pass" type="password" placeholder=" " defaultValue="********" />
                    <label htmlFor="d-pass">Password</label>
                  </div>
                  {detailsError && <p className="checkout-error" role="alert">{detailsError}</p>}
                  <button className="btn btn-primary" type="submit">Save changes</button>
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
