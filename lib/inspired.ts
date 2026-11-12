import type { WCProduct } from "@/lib/types";

// The designer fragrance a Mehr scent is an impression of — set per product in
// WooCommerce as a custom attribute named "Inspired By" (e.g. "Baccarat Rouge
// 540"), so it can be edited from wp-admin without a deploy. Dependency-free on
// purpose: used by both server SEO code and client components (ProductCard).
export function inspiredBy(p: Pick<WCProduct, "attributes">): string {
  return p.attributes?.find((a) => a.name === "Inspired By")?.options?.[0]?.trim() || "";
}

// Product names are stored uppercase ("VELVET SKY") — readable form for titles.
const SMALL_WORDS = new Set(["of", "for", "with", "and", "the", "a", "in"]);

export function displayName(name: string): string {
  return name
    .toLowerCase()
    .split(" ")
    .map((w, i) => (i > 0 && SMALL_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export const INSPIRED_DISCLAIMER =
  "Mehr is an independent fragrance house and is not affiliated with or endorsed by the brands named; their names are used only to describe the scent profile.";

// Each product's "<original> impression" comparison post on the blog.
// Linked from the product page so Google finds the posts and connects the two.
export const COMPARISON_POST: Record<string, string> = {
  majesty: "gissah-imperial-valley-impression-pakistan",
  elia: "baccarat-rouge-540-impression-pakistan",
  "timeless-aura": "initio-oud-for-greatness-impression-pakistan",
  "07": "reef-33-impression-pakistan",
  kafka: "ahmed-al-maghribi-marj-impression-pakistan",
  humnafas: "office-for-men-impression-pakistan",
  vasl: "azzaro-wanted-impression-pakistan",
  amour: "stronger-with-you-intensely-impression-pakistan",
  "velvet-sky": "good-girl-impression-pakistan",
  moonlight: "black-opium-impression-pakistan",
  whisper: "ysl-libre-impression-pakistan",
  arwaah: "tom-ford-black-orchid-impression-pakistan",
  "memory-of-you": "afnan-9pm-elixir-impression-pakistan",
};
