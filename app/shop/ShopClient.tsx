"use client";

import { WCProduct, WCCategory } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { CloseIcon } from "@/components/icons";

const PRICE_RANGES = [
  { value: "0-2000",       label: "Under Rs 2,000"      },
  { value: "2000-3500",    label: "Rs 2,000 – Rs 3,500" },
  { value: "3500-5000",    label: "Rs 3,500 – Rs 5,000" },
  { value: "5000-99999",   label: "Rs 5,000+"           },
];

type SortKey = "featured" | "price-asc" | "price-desc" | "name";


export default function ShopClient() {
  const params = useSearchParams();
  const startCat = params.get("category") || "all";

  const [products, setProducts]     = useState<WCProduct[]>([]);
  const [categories, setCategories] = useState<WCCategory[]>([]);
  const [loading, setLoading]       = useState(true);
  const [cat, setCat]               = useState(startCat);
  const [prices, setPrices]         = useState<Set<string>>(new Set());
  const [sort, setSort]             = useState<SortKey>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch products and categories from WooCommerce API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?per_page=100'),
          fetch('/api/categories'),
        ])
        const productsData   = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        setProducts(productsData)
        // Filter out uncategorized
        setCategories(categoriesData.filter((c: WCCategory) => c.slug !== 'uncategorized' && c.count > 0))
      } catch (err) {
        console.error('Failed to fetch:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
      return catMatch && priceMatch(price)
    })

    if (sort === "price-asc")  filtered = [...filtered].sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    if (sort === "price-desc") filtered = [...filtered].sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    if (sort === "name")       filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === "featured")   filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

    return filtered
  }, [products, cat, prices, sort])

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
      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow">Shop{activeCategory ? " · " + activeCategory.name : ""}</p>
          <h1 className="h-xl">{activeCategory ? activeCategory.name : "All Fragrance"}</h1>
          <p className="lead" style={{ maxWidth: "48ch", marginTop: 14 }}>
            {activeCategory
              ? `Explore our ${activeCategory.name} collection`
              : "The full house — eau de parfum, body and home, composed in the cool light of morning."}
          </p>
        </div>
      </section>

      <div className="wrap shop-layout">
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

        <section className="results">
          <div className="results-bar">
            <button className="btn-ghost btn filter-toggle" onClick={() => setFiltersOpen((v) => !v)}>
              Filter
            </button>
            <span className="result-count">
              {loading ? "Loading..." : `${list.length} ${list.length === 1 ? "product" : "products"}`}
            </span>
            <label className="sort">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price · Low to High</option>
                <option value="price-desc">Price · High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
            </label>
          </div>

          {loading ? (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <p className="muted">Loading products...</p>
            </div>
          ) : list.length > 0 ? (
            <ProductGrid products={list} />
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
    </main>
  )
}