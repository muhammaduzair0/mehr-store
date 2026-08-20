"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { WCProduct, WCVariation } from "@/lib/types";
import { Cart } from "@/lib/store";
import { discountPercent, money } from "@/lib/format";
import { FREE_SHIP, SHIP_COST } from "@/lib/data";
import ProductGrid from "@/components/ProductGrid";

const NOTE_TIERS = [
  { key: "Top Notes", label: "Top" },
  { key: "Heart Notes", label: "Heart" },
  { key: "Base Notes", label: "Base" },
];

/** The variation's selectable option — prefers a "Size" attribute, falls back to its first. */
function variationOption(v: WCVariation): string {
  const attr = v.attributes.find((a) => a.name.toLowerCase() === "size") || v.attributes[0];
  return attr?.option || "";
}

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="pdp-stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ opacity: i < rounded ? 1 : 0.25 }}>★</span>
      ))}
    </span>
  );
}

type Review = {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
};

function RatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="rating-input" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
        >
          <span style={{ opacity: n <= (hover || value) ? 1 : 0.25 }}>★</span>
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ productId, onSubmitted }: { productId: number; onSubmitted: (r: Review) => void }) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) {
      setError("Please choose a star rating.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, reviewer: name, reviewer_email: email, review: text, rating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't submit your review");
      setDone(true);
      if (data.status === "approved") onSubmitted(data);
    } catch (err: any) {
      setError(err.message || "Couldn't submit your review");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return <p className="save-ok" style={{ display: "block" }}>Thanks — your review has been submitted and will appear once approved.</p>;
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <div className="pdp-block" style={{ marginBottom: 18 }}>
        <p className="pdp-label">Your rating</p>
        <RatingInput value={rating} onChange={setRating} />
      </div>
      <div className="field">
        <input id="rv-name" placeholder=" " required value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="rv-name">Your name</label>
      </div>
      <div className="field">
        <input id="rv-email" type="email" placeholder=" " required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="rv-email">Email address</label>
      </div>
      <div className="field">
        <textarea id="rv-text" placeholder=" " required rows={4} value={text} onChange={(e) => setText(e.target.value)} />
        <label htmlFor="rv-text">Your review</label>
      </div>
      {error && <p className="promo-error">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}

function AccordionItem({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={"acc-item" + (open ? " open" : "")}>
      <button type="button" className="acc-head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {title}
        <span className="acc-ico">+</span>
      </button>
      <div className="acc-body">
        <div className="acc-body-inner">{children}</div>
      </div>
    </div>
  );
}

interface ProductClientProps {
  product: WCProduct;
  related: WCProduct[];
  initialReviews: Review[];
  initialVariations: WCVariation[];
}

export default function ProductClient({ product, related, initialReviews, initialVariations }: ProductClientProps) {
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize]         = useState<string | null>(null);
  const [variations, setVariations] = useState<WCVariation[]>(initialVariations);
  const [qty, setQty]           = useState(1);
  const [added, setAdded]       = useState(false);
  const [reviews, setReviews]   = useState<Review[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // The same client component instance persists across a "related product"
  // navigation (only the `id` search param changes), so local UI state and
  // the server-fetched review/variation props both need to reset per product.
  useEffect(() => {
    setActiveImg(0);
    setQty(1);
    setSize(null);
    setAdded(false);
    setShowReviewForm(false);
  }, [product.id]);

  useEffect(() => {
    setReviews(initialReviews);
  }, [product.id, initialReviews]);

  useEffect(() => {
    setVariations(initialVariations);
  }, [product.id, initialVariations]);

  const images      = product.images?.length ? product.images : [{ src: "/whisper-campaign.png", alt: product.name }];
  const notes       = product.attributes?.find((a) => a.name === "Notes")?.options || [];
  const noteTiers   = NOTE_TIERS.map((t) => ({
    ...t,
    options: product.attributes?.find((a) => a.name === t.key)?.options || [],
  })).filter((t) => t.options.length > 0);
  const family      = product.attributes?.find((a) => a.name === "Scent Family")?.options?.[0] || "";
  const categories  = product.categories?.filter((c) => c.slug !== "uncategorized") || [];
  const rating      = parseFloat(product.average_rating || "0");

  // Variable products: real per-size pricing/stock from WooCommerce variations.
  // Simple products: a "Size" attribute is just descriptive text, not a choice.
  const isVariable      = product.type === "variable" && variations.length > 0;
  const variableSizes   = isVariable ? [...new Set(variations.map(variationOption))].filter(Boolean) : [];
  // Every simple (non-variable) product in the catalog today is a 50ml bottle —
  // default to that instead of requiring a "Size" attribute set per product in
  // wp-admin, but still defer to real attribute data if it's ever added.
  const infoSizes        = !isVariable ? product.attributes?.find((a) => a.name === "Size")?.options || ["50ml"] : [];
  const activeSize       = size ?? variableSizes[0] ?? null;
  const activeVariation  = isVariable ? variations.find((v) => variationOption(v) === activeSize) ?? variations[0] : null;

  const displayPrice    = activeVariation ?? product;
  const isOnSale         = displayPrice.on_sale && displayPrice.sale_price;
  // "onbackorder" is a real third stock_status WooCommerce sets when backorders
  // are allowed and quantity hits 0 — treating anything-but-instock as sold out
  // would wrongly block purchases WooCommerce itself still allows.
  const soldOut            = displayPrice.stock_status === "outofstock";
  const isBackorder        = displayPrice.stock_status === "onbackorder";
  const pct               = isOnSale ? discountPercent(displayPrice.regular_price, displayPrice.sale_price) : null;

  const maxQty = displayPrice.manage_stock && displayPrice.stock_quantity != null
    ? Math.max(0, displayPrice.stock_quantity)
    : null;
  const lowStockThreshold = product.low_stock_amount ?? 5;
  const isLowStock = !soldOut && displayPrice.manage_stock && displayPrice.stock_quantity != null && displayPrice.stock_quantity <= lowStockThreshold;

  // Switching size/variation (or the whole product) can lower the available
  // quantity below whatever was already selected.
  useEffect(() => {
    if (maxQty != null) setQty((q) => Math.max(1, Math.min(q, maxQty)));
  }, [maxQty]);

  function handleAddToCart() {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      Cart.addWC(
        product,
        1,
        activeVariation
          ? {
              id: activeVariation.id,
              price: activeVariation.on_sale && activeVariation.sale_price ? activeVariation.sale_price : activeVariation.price,
              image: activeVariation.image?.src,
              sizeLabel: activeSize,
            }
          : undefined
      );
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <main>
      <div className="wrap">
        {/* Breadcrumb */}
        <nav className="pdp-crumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          {categories[0] && (
            <>
              <span>/</span>
              <Link href={`/shop?category=${categories[0].slug}`}>{categories[0].name}</Link>
            </>
          )}
          <span>/</span>
          <span style={{ color: "var(--ink)" }}>{product.name}</span>
        </nav>

        <div className="pdp">
          {/* GALLERY */}
          <div className="pdp-gallery">
            <div className="pdp-main">
              {(soldOut || isOnSale) && (
                <span className={"pdp-badge" + (soldOut ? " sold-out" : "")}>{soldOut ? "Sold Out" : `-${pct}%`}</span>
              )}
              <Image
                key={images[activeImg]?.src}
                src={images[activeImg]?.src || "/whisper-campaign.png"}
                alt={images[activeImg]?.alt || product.name}
                fill
                style={{ objectFit: "contain" }}
                unoptimized
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="pdp-thumbs">
                {images.map((img, i) => (
                  <button
                    type="button"
                    key={img.src + i}
                    className={"pdp-thumb" + (i === activeImg ? " active" : "")}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <span className="pdp-thumb-slot">
                      <Image src={img.src} alt="" fill style={{ objectFit: "contain" }} unoptimized />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            {family && <p className="pdp-type">{family}</p>}
            <h1 className="h-xl" style={{ fontWeight: 300 }}>{product.name}</h1>

            {rating > 0 && product.rating_count > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <Stars rating={rating} />
                <span className="muted" style={{ fontSize: 13 }}>
                  {rating.toFixed(1)} · {product.rating_count} {product.rating_count === 1 ? "review" : "reviews"}
                </span>
              </div>
            )}

            <div className="pdp-price tnum" style={{ margin: "18px 0 24px" }}>
              {isOnSale ? (
                <>
                  <span style={{ textDecoration: "line-through", color: "var(--muted)", marginRight: 12, fontSize: 17 }}>
                    {money(displayPrice.regular_price)}
                  </span>
                  <span>{money(displayPrice.sale_price)}</span>
                  {pct && <span className="card-discount" style={{ fontSize: 14 }}>−{pct}% off</span>}
                </>
              ) : (
                <span>{money(displayPrice.price)}</span>
              )}
            </div>

            {isLowStock && (
              <p style={{ color: "oklch(0.5 0.16 25)", fontSize: 13, fontWeight: 600, margin: "-16px 0 20px" }}>
                Only {displayPrice.stock_quantity} left in stock
              </p>
            )}
            {isBackorder && (
              <p className="muted" style={{ fontSize: 13, margin: "-16px 0 20px" }}>
                Available on backorder — ships as soon as new stock arrives.
              </p>
            )}

            {product.short_description && (
              <div
                className="lead"
                style={{ marginBottom: 28, color: "var(--ink-2)" }}
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {isVariable ? (
              <div className="pdp-block">
                <p className="pdp-label">Size{activeSize ? ` — ${activeSize}` : ""}</p>
                <div className="size-row">
                  {variableSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={"size-chip" + (activeSize === s ? " active" : "")}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : infoSizes.length > 0 ? (
              <div className="pdp-block">
                <p className="pdp-label">Size</p>
                <p className="muted" style={{ fontSize: 14 }}>{infoSizes.join(" · ")}</p>
              </div>
            ) : null}

            <div className="pdp-block">
              <p className="pdp-label">Quantity</p>
              <div className="pdp-actions">
                <div className="qty pdp-qty">
                  <button aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span className="tnum">{qty}</span>
                  <button
                    aria-label="Increase"
                    onClick={() => setQty((q) => (maxQty != null ? Math.min(maxQty, q + 1) : q + 1))}
                    disabled={maxQty != null && qty >= maxQty}
                  >
                    +
                  </button>
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                  onClick={handleAddToCart}
                  disabled={soldOut}
                >
                  {soldOut ? "Out of Stock" : added ? "Added ✓" : `Add to Cart — ${money(parseFloat(isOnSale ? displayPrice.sale_price : displayPrice.price) * qty)}`}
                </button>
              </div>
            </div>

            <ul className="pdp-assure">
              <li>Free shipping on orders over {money(FREE_SHIP)}</li>
              <li>Cash on Delivery available nationwide</li>
              <li>100% authentic — shipped direct from Mehr</li>
            </ul>

            {product.sku && (
              <p className="muted" style={{ fontSize: 12, marginTop: 14 }}>SKU: {product.sku}</p>
            )}

            <div className="accordion">
              {product.description && (
                <AccordionItem title="Description" defaultOpen>
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </AccordionItem>
              )}

              {(noteTiers.length > 0 || notes.length > 0) && (
                <AccordionItem title="Scent notes">
                  {noteTiers.length > 0 ? (
                    <ul className="note-pyramid">
                      {noteTiers.map((t) => (
                        <li key={t.key}>
                          <span className="np-label">{t.label}</span>
                          <span className="np-val">{t.options.join(" · ")}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{notes.join(" · ")}</p>
                  )}
                </AccordionItem>
              )}

              <AccordionItem title="Shipping &amp; returns">
                <p>
                  Orders ship within 1–2 business days and arrive in 3–5 business days nationwide.
                  Shipping is {money(SHIP_COST)} on orders under {money(FREE_SHIP)}, and free on orders over{" "}
                  {money(FREE_SHIP)}. Cash on Delivery is available at checkout.
                </p>
              </AccordionItem>
            </div>
          </div>
        </div>

        <section className="section-sm reviews-section">
          <div className="sec-head reveal-up">
            <div>
              <p className="eyebrow">In their words</p>
              <h2 className="h-lg" style={{ marginTop: 14 }}>
                Reviews{reviews.length > 0 ? ` (${reviews.length})` : ""}
              </h2>
            </div>
            {!showReviewForm && (
              <button className="ulink reveal" onClick={() => setShowReviewForm(true)}>
                Write a review
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="review-form-wrap reveal-up">
              <ReviewForm
                productId={product.id}
                onSubmitted={(r) => setReviews((prev) => [r, ...prev])}
              />
            </div>
          )}

          {reviews.length > 0 ? (
            <div className="review-list reveal-up">
              {reviews.map((r) => (
                <article className="review-item" key={r.id}>
                  <Stars rating={r.rating} />
                  <p className="review-text">{r.review.replace(/<[^>]*>/g, "")}</p>
                  <p className="review-meta">
                    {r.reviewer} · {new Date(r.date_created).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </article>
              ))}
            </div>
          ) : !showReviewForm ? (
            <p className="muted">No reviews yet — be the first to share your experience.</p>
          ) : null}
        </section>

        {related.length > 0 && (
          <section className="section-sm">
            <div className="sec-head reveal-up">
              <div>
                <p className="eyebrow">Pairs well</p>
                <h2 className="h-lg" style={{ marginTop: 14 }}>You may also like</h2>
              </div>
              <Link className="ulink reveal" href="/shop">Shop all</Link>
            </div>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </main>
  );
}
