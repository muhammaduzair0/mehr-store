"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { CATEGORIES, PRODUCTS } from "@/lib/data";

const PRICE_RANGES = [
  { value: "0-50", label: "Under $50" },
  { value: "50-100", label: "$50 – $100" },
  { value: "100-160", label: "$100 – $160" },
  { value: "160-9999", label: "$160+" },
];

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export default function ShopClient() {
  const params = useSearchParams();
  const startCat = params.get("category") || "all";

  const [cat, setCat] = useState(startCat);
  const [fams, setFams] = useState<Set<string>>(new Set());
  const [prices, setPrices] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortKey>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const families = useMemo(() => [...new Set(PRODUCTS.map((p) => p.family))].sort(), []);

  function toggleSet(set: Set<string>, value: string, setter: (s: Set<string>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  function priceMatch(price: number) {
    if (!prices.size) return true;
    return [...prices].some((r) => {
      const [a, b] = r.split("-").map(Number);
      return price >= a && price <= b;
    });
  }

  const list = useMemo(() => {
    let filtered = PRODUCTS.filter(
      (p) => (cat === "all" || p.cat === cat) && (!fams.size || fams.has(p.family)) && priceMatch(p.price),
    );
    if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
    else if (sort === "name") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    else filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return filtered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, fams, prices, sort]);

  function clearAll() {
    setCat("all");
    setFams(new Set());
    setPrices(new Set());
  }

  const activeCategory = CATEGORIES[cat];

  return (
    <main>
      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow">Shop{activeCategory ? " · " + activeCategory.tagline : ""}</p>
          <h1 className="h-xl">{activeCategory ? activeCategory.label : "All Fragrance"}</h1>
          <p className="lead" style={{ maxWidth: "48ch", marginTop: 14 }}>
            {activeCategory
              ? activeCategory.blurb
              : "The full house — eau de parfum, body and home, composed in the cool light of morning."}
          </p>
        </div>
      </section>

      <div className="wrap shop-layout">
        <aside className={"filters" + (filtersOpen ? " open" : "")}>
          <div className="filter-head">
            <h2 className="eyebrow">Filter</h2>
            <button className="ulink reveal" onClick={clearAll}>
              Clear all
            </button>
          </div>

          <div className="filter-group">
            <h3>Category</h3>
            <label className="opt">
              <input type="radio" name="cat" value="all" checked={cat === "all"} onChange={() => setCat("all")} />
              <span>All products</span>
            </label>
            {Object.entries(CATEGORIES).map(([key, c]) => (
              <label className="opt" key={key}>
                <input type="radio" name="cat" value={key} checked={cat === key} onChange={() => setCat(key)} />
                <span>{c.label}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h3>Scent family</h3>
            {families.map((f) => (
              <label className="opt" key={f}>
                <input
                  type="checkbox"
                  name="fam"
                  checked={fams.has(f)}
                  onChange={() => toggleSet(fams, f, setFams)}
                />
                <span>{f}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h3>Price</h3>
            {PRICE_RANGES.map((r) => (
              <label className="opt" key={r.value}>
                <input
                  type="checkbox"
                  name="price"
                  checked={prices.has(r.value)}
                  onChange={() => toggleSet(prices, r.value, setPrices)}
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
              {list.length} {list.length === 1 ? "product" : "products"}
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
          {list.length > 0 ? (
            <ProductGrid products={list} />
          ) : (
            <div className="no-results">
              <p className="h-md" style={{ fontWeight: 300 }}>
                Nothing matches those filters.
              </p>
              <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={clearAll}>
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
