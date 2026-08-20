"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WCProduct } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";
import { SearchIcon } from "@/components/icons";

export default function SearchClient() {
  const params = useSearchParams();
  const router = useRouter();
  const initialQ = params.get("q") || "";

  const [input, setInput] = useState(initialQ);
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<WCProduct[]>([]);
  const [loading, setLoading] = useState(!!initialQ);
  const [searched, setSearched] = useState(!!initialQ);

  useEffect(() => {
    setInput(initialQ);
    setQuery(initialQ);
  }, [initialQ]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setSearched(false);
      return;
    }
    let cancelled = false;
    async function run() {
      setLoading(true);
      setSearched(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&per_page=100`);
        const data = await res.json();
        if (!cancelled) setResults(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [query]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    setQuery(q);
  }

  return (
    <main>
      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow">Search</p>
          <h1 className="h-xl">Find your scent</h1>
          <form className="search-form" onSubmit={submit}>
            <SearchIcon />
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              autoFocus
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      <div className="wrap" style={{ paddingBlock: "clamp(36px, 4.5vw, 60px) clamp(64px, 8vw, 108px)" }}>
        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <p className="muted">Searching…</p>
          </div>
        ) : !searched ? (
          <div className="no-results">
            <p className="h-md" style={{ fontWeight: 300 }}>Search for a scent, note, or product name.</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="result-count" style={{ marginBottom: 24 }}>
              {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
            </p>
            <ProductGrid products={results} />
          </>
        ) : (
          <div className="no-results">
            <p className="h-md" style={{ fontWeight: 300 }}>No results for &ldquo;{query}&rdquo;.</p>
            <p className="muted" style={{ marginTop: 8 }}>Try a different word, or browse the full collection.</p>
          </div>
        )}
      </div>
    </main>
  );
}
