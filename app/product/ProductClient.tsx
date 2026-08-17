"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { WCProduct } from "@/lib/types";
import { Cart } from "@/lib/store";

function money(amount: string | number) {
  return `$${parseFloat(String(amount)).toFixed(2)}`;
}

export default function ProductClient() {
  const params = useSearchParams();
  const id = params.get("id");

  const [product, setProduct] = useState<WCProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

function handleAddToCart() {
  if (!product) return;
  for (let i = 0; i < qty; i++) {
    Cart.addWC(product);
  }
  setAdded(true);
  setTimeout(() => setAdded(false), 2000);
}

  if (loading) {
    return (
      <main className="wrap" style={{ padding: "120px 0", textAlign: "center" }}>
        <p className="muted">Loading...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="wrap" style={{ padding: "120px 0", textAlign: "center" }}>
        <p className="h-md">Product not found.</p>
        <Link href="/shop" className="btn btn-outline" style={{ marginTop: 24 }}>
          Back to shop
        </Link>
      </main>
    );
  }

  const image      = product.images?.[0]?.src || "/whisper-campaign.png";
  const notes      = product.attributes?.find((a) => a.name === "Notes")?.options || [];
  const sizes      = product.attributes?.find((a) => a.name === "Size")?.options  || [];
  const family     = product.attributes?.find((a) => a.name === "Scent Family")?.options?.[0] || "";
  const isOnSale   = product.on_sale && product.sale_price;
  const categories = product.categories?.filter((c) => c.slug !== "uncategorized") || [];

  return (
    <main>
      <div className="wrap" style={{ paddingBlock: "clamp(48px, 7vw, 96px)" }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: 32, fontSize: 13, color: "var(--muted)" }}>
          <Link href="/">Home</Link>
          <span style={{ margin: "0 8px" }}>·</span>
          <Link href="/shop">Shop</Link>
          {categories[0] && (
            <>
              <span style={{ margin: "0 8px" }}>·</span>
              <Link href={`/shop?category=${categories[0].slug}`}>{categories[0].name}</Link>
            </>
          )}
          <span style={{ margin: "0 8px" }}>·</span>
          <span style={{ color: "var(--ink)" }}>{product.name}</span>
        </nav>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px, 6vw, 80px)",
          alignItems: "start",
        }}>
          {/* IMAGE */}
          <div style={{ position: "relative", aspectRatio: "4/5", background: "var(--surface)" }}>
            {product.on_sale && (
              <span className="badge" style={{ position: "absolute", top: 16, left: 16, zIndex: 2 }}>Sale</span>
            )}
            <Image
              src={image}
              alt={product.images?.[0]?.alt || product.name}
              fill
              style={{ objectFit: "cover" }}
              unoptimized
              priority
            />
          </div>

          {/* DETAILS */}
          <div style={{ paddingTop: 8 }}>
            {family && <p className="eyebrow" style={{ marginBottom: 12 }}>{family}</p>}
            <h1 className="h-xl" style={{ fontWeight: 300 }}>{product.name}</h1>

            {/* Price */}
            <div style={{ margin: "20px 0", fontSize: 22, fontWeight: 500 }}>
              {isOnSale ? (
                <>
                  <span style={{ textDecoration: "line-through", color: "var(--muted)", marginRight: 12, fontSize: 18 }}>
                    {money(product.regular_price)}
                  </span>
                  <span>{money(product.sale_price)}</span>
                </>
              ) : (
                <span>{money(product.price)}</span>
              )}
            </div>

            {/* Short description */}
            {product.short_description && (
              <div
                className="lead"
                style={{ marginBottom: 28, color: "var(--ink-2)" }}
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Notes */}
            {notes.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <p className="eyebrow" style={{ marginBottom: 10 }}>Scent notes</p>
                <p style={{ color: "var(--ink-2)" }}>{notes.join(" · ")}</p>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <p className="eyebrow" style={{ marginBottom: 10 }}>Size</p>
                <div style={{ display: "flex", gap: 10 }}>
                  {sizes.map((s) => (
                    <button key={s} className="btn btn-ghost" style={{ padding: "10px 20px" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <p className="eyebrow">Qty</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid var(--line-2)", padding: "8px 16px" }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ fontSize: 18, lineHeight: 1 }}>−</button>
                <span style={{ minWidth: 24, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} style={{ fontSize: 18, lineHeight: 1 }}>+</button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={handleAddToCart}
              disabled={product.stock_status === "outofstock"}
            >
              {product.stock_status === "outofstock"
                ? "Out of Stock"
                : added
                ? "Added ✓"
                : `Add to Cart — ${money(product.price)}`}
            </button>

            {/* Description */}
            {product.description && (
              <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--line)" }}>
                <p className="eyebrow" style={{ marginBottom: 14 }}>About</p>
                <div
                  className="lead"
                  style={{ color: "var(--ink-2)" }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}