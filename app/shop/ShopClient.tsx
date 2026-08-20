"use client";

import { WCProduct, WCCategory } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import { CloseIcon } from "@/components/icons";
import FaqAccordion from "@/components/FaqAccordion";

const PRICE_RANGES = [
  { value: "0-2000",       label: "Under Rs 2,000"      },
  { value: "2000-3500",    label: "Rs 2,000 – Rs 3,500" },
  { value: "3500-5000",    label: "Rs 3,500 – Rs 5,000" },
  { value: "5000-99999",   label: "Rs 5,000+"           },
];

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

/** Editorial copy per category slug — shown on the photographic category hero. */
const CATEGORY_COPY: Record<string, string> = {
  "for-her":
    "Fragrance for women who don't dress to be noticed — they dress to be remembered. Florals softened with warm woods, musk, and a little audacity.",
  "for-him":
    "Structured, magnetic, unmistakably present. Built on woods, spice, and skin-warm musk — the kind that lingers in a room after he's left it.",
  "unisex":
    "No gendered aisles here — just fragrance chosen for how it makes you feel, not who it was marketed to.",
  "unisex-perfumes":
    "No gendered aisles here — just fragrance chosen for how it makes you feel, not who it was marketed to.",
  "discovery-set":
    "Undecided? Start small. A curated set of miniatures built for trying scents on skin before you commit to a full bottle.",
};

const FAQS = [
  {
    q: "How long does the fragrance last?",
    a: `Every scent is built at 40% parfum concentration — well above the industry standard — so it sits close to the skin for hours, not minutes.`,
  },
  {
    q: "What if I want to try before I commit?",
    a: "Our Discovery Set lets you sample multiple scents in miniature before you commit to a full bottle.",
  },
];



interface ShopClientProps {
  initialProducts: WCProduct[];
  initialCategories: WCCategory[];
}

export default function ShopClient({ initialProducts, initialCategories }: ShopClientProps) {
  const params = useSearchParams();
  const startCat = params.get("category") || "all";
  const bestSellersOnly = params.get("featured") === "true";

  const [products]     = useState<WCProduct[]>(initialProducts);
  const [categories]   = useState<WCCategory[]>(initialCategories);
  const [cat, setCat]               = useState(startCat);
  const [prices, setPrices]         = useState<Set<string>>(new Set());
  const [sort, setSort]             = useState<SortKey>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Keep the active category in sync with the URL — otherwise navigating
  // client-side between category links (header dropdown, footer, etc.)
  // leaves the grid/hero/breadcrumb showing whatever category loaded first.
  useEffect(() => {
    setCat(startCat)
  }, [startCat])

  function togglePrice(value: string) {
    const next = new Set(prices)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    setPrices(next)
  }

  function priceMatch(price: number) {
    if (!prices.size) return true
    return [...prices].some((r) => {
      const [a, b] = r.split("-").map(Number)
      return price >= a && price <= b
    })
  }

  const list = useMemo(() => {
    let filtered = products.filter((p) => {
      const price = parseFloat(p.price)
      const catMatch = cat === "all" || p.categories.some((c) => c.slug === cat)
      const bestSellerMatch = !bestSellersOnly || p.featured
      return catMatch && priceMatch(price) && bestSellerMatch
    })

    if (sort === "price-asc")  filtered = [...filtered].sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    if (sort === "price-desc") filtered = [...filtered].sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    if (sort === "name")       filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === "featured")   filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

    return filtered
  }, [products, cat, prices, sort, bestSellersOnly])

  // A representative photo for the active category's hero — pulled from its own products, not a stock image.
  const categoryImage = useMemo(() => {
    if (cat === "all") return null
    const match = products.find((p) => p.categories.some((c) => c.slug === cat) && p.images?.[0]?.src)
    return match?.images?.[0]?.src ?? null
  }, [products, cat])

  function clearAll() {
    setCat("all")
    setPrices(new Set())
  }

  useEffect(() => {
    if (!filtersOpen) return
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [filtersOpen])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFiltersOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  const activeCategory = categories.find((c) => c.slug === cat)

  return (
    <main>
      {bestSellersOnly ? (
        <section className="shop-hero shop-hero--dark">
          <div className="wrap">
            <p className="eyebrow">No. 01 most loved</p>
            <h1 className="h-xl">Best Sellers</h1>
            <p className="lead" style={{ maxWidth: "56ch", marginTop: 14 }}>
              The scents our customers reach for again and again. No paid placements, no guesswork —
              this lineup is ranked purely by what actually sells, updated as new favorites emerge.
            </p>
            <ul className="attr-strip">
              <li>40% parfum concentration</li>
              <li>Cash on Delivery</li>
              <li>Free delivery over Rs 5,000</li>
            </ul>
          </div>
        </section>
      ) : activeCategory ? (
        <section className="shop-hero shop-hero--photo">
          {categoryImage && (
            <Image src={categoryImage} alt="" fill style={{ objectFit: "contain" }} unoptimized priority />
          )}
          <div className="shop-hero-scrim" />
          <div className="wrap shop-hero-photo-content">
            <p className="shop-crumb">
              <Link href="/shop">Shop</Link>
              <span>/</span>
              <span>{activeCategory.name}</span>
            </p>
            <h1 className="h-xl">{activeCategory.name}</h1>
            <p className="lead" style={{ maxWidth: "52ch", marginTop: 14 }}>
              {CATEGORY_COPY[activeCategory.slug] || `Explore our ${activeCategory.name} collection.`}
            </p>
          </div>
        </section>
      ) : (
        <section className="shop-hero">
          <div className="wrap">
            <p className="eyebrow">Shop</p>
            <h1 className="h-xl">All Fragrance</h1>
            <p className="lead" style={{ maxWidth: "48ch", marginTop: 14 }}>
              The full house — eau de parfum, body and home, composed in the cool light of morning.
            </p>
          </div>
        </section>
      )}

      <div className={"wrap shop-layout" + (bestSellersOnly ? " shop-layout--curated" : "")}>
        {!bestSellersOnly && (
          <>
            <div
              className={"scrim filter-scrim" + (filtersOpen ? " open" : "")}
              onClick={() => setFiltersOpen(false)}
            />
            <aside className={"filters" + (filtersOpen ? " open" : "")}>
              <div className="filter-head">
                <h2 className="eyebrow">Filter</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <button className="ulink reveal" onClick={clearAll}>Clear all</button>
                  <button
                    type="button"
                    className="icon-btn filter-close"
                    aria-label="Close filters"
                    onClick={() => setFiltersOpen(false)}
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <h3>Category</h3>
                <label className="opt">
                  <input type="radio" name="cat" value="all" checked={cat === "all"} onChange={() => setCat("all")} />
                  <span>All products</span>
                </label>
                {categories.map((c) => (
                  <label className="opt" key={c.id}>
                    <input type="radio" name="cat" value={c.slug} checked={cat === c.slug} onChange={() => setCat(c.slug)} />
                    <span>{c.name}</span>
                  </label>
                ))}
              </div>

              <div className="filter-group">
                <h3>Price</h3>
                {PRICE_RANGES.map((r) => (
                  <label className="opt" key={r.value}>
                    <input
                      type="checkbox"
                      checked={prices.has(r.value)}
                      onChange={() => togglePrice(r.value)}
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </aside>
          </>
        )}

        <section className="results">
          {bestSellersOnly && categories.length > 0 && (
            <div className="quick-cats">
              <button
                className={"chip" + (cat === "all" ? " on" : "")}
                onClick={() => setCat("all")}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={"chip" + (cat === c.slug ? " on" : "")}
                  onClick={() => setCat(cat === c.slug ? "all" : c.slug)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          <div className="results-bar">
            {!bestSellersOnly && (
              <button className="btn-ghost btn filter-toggle" onClick={() => setFiltersOpen((v) => !v)}>
                Filter
              </button>
            )}
            <span className="result-count">
              {bestSellersOnly
                ? `${list.length} ${list.length === 1 ? "bestseller" : "bestsellers"}`
                : `${list.length} ${list.length === 1 ? "product" : "products"}`}
            </span>
            <label className="sort">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                <option value="featured">{bestSellersOnly ? "Top ranked" : "Featured"}</option>
                <option value="price-asc">Price · Low to High</option>
                <option value="price-desc">Price · High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
            </label>
          </div>

          {list.length > 0 ? (
            <ProductGrid
              products={list}
              className={bestSellersOnly ? "grid-bestsellers" : undefined}
              showRank={bestSellersOnly && sort === "featured"}
            />
          ) : bestSellersOnly ? (
            <div className="no-results">
              <p className="h-md" style={{ fontWeight: 300 }}>No bestsellers marked yet.</p>
              <p className="muted" style={{ marginTop: 8 }}>Mark products as &quot;Featured&quot; in WooCommerce to have them appear here.</p>
            </div>
          ) : (
            <div className="no-results">
              <p className="h-md" style={{ fontWeight: 300 }}>Nothing matches those filters.</p>
              <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={clearAll}>
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>

      {activeCategory && !bestSellersOnly && (
        <section className="section-sm shop-faq">
          <div className="wrap">
            <div className="center" style={{ marginBottom: 36 }}>
              <p className="eyebrow">Good to know</p>
              <h2 className="h-lg" style={{ marginTop: 14 }}>{activeCategory.name} FAQs</h2>
            </div>
            <div className="faq-wrap">
              <FaqAccordion items={FAQS} />
            </div>
          </div>
        </section>
      )}
    </main>
  )
}