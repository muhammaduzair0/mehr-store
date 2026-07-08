export type ProductSize = { ml: number; price: number };

export type Product = {
  id: string;
  name: string;
  cat: "women" | "men" | "lotions" | "candles" | "gifts";
  type: string;
  price: number;
  notes: string[];
  family: string;
  badge?: string;
  featured?: boolean;
  short: string;
  sizes: ProductSize[];
};

export type Category = {
  label: string;
  tagline: string;
  blurb: string;
};

export const PRODUCTS: Product[] = [
  // ---------- WOMEN ----------
  {
    id: "noor", name: "Noor", cat: "women", type: "Eau de Parfum", price: 145,
    notes: ["Damask Rose", "Saffron", "Oud"], family: "Floral · Oriental",
    badge: "Bestseller", featured: true,
    short: "A radiant rose wrapped in saffron and smouldering oud — warm, regal, unforgettable.",
    sizes: [{ ml: 50, price: 145 }, { ml: 100, price: 215 }],
  },
  {
    id: "sahar", name: "Sahar", cat: "women", type: "Eau de Parfum", price: 135,
    notes: ["Bergamot", "Jasmine", "White Musk"], family: "Fresh · Floral",
    featured: true,
    short: "First light in a bottle — dewy bergamot lifting into soft jasmine and clean musk.",
    sizes: [{ ml: 50, price: 135 }, { ml: 100, price: 200 }],
  },
  {
    id: "yasmin", name: "Yasmin", cat: "women", type: "Eau de Parfum", price: 150,
    notes: ["Jasmine Sambac", "Neroli", "Amber"], family: "White Floral",
    short: "An opulent white-flower bouquet grounded by amber's golden hum.",
    sizes: [{ ml: 50, price: 150 }, { ml: 100, price: 225 }],
  },
  {
    id: "lune", name: "Lune", cat: "women", type: "Eau de Parfum", price: 140,
    notes: ["Pear", "Iris", "Cashmere Wood"], family: "Powdery · Soft",
    short: "Cool, powdery iris over ripe pear — a quiet luxury that lingers close to the skin.",
    sizes: [{ ml: 50, price: 140 }, { ml: 100, price: 210 }],
  },

  // ---------- MEN ----------
  {
    id: "daria", name: "Daria", cat: "men", type: "Eau de Parfum", price: 145,
    notes: ["Vetiver", "Cedar", "Black Pepper"], family: "Woody · Aromatic",
    badge: "Bestseller", featured: true,
    short: "Sharp pepper and dry cedar over earthy vetiver — composed, modern, assured.",
    sizes: [{ ml: 50, price: 145 }, { ml: 100, price: 215 }],
  },
  {
    id: "zephyr", name: "Zephyr", cat: "men", type: "Eau de Parfum", price: 140,
    notes: ["Bergamot", "Sage", "Driftwood"], family: "Fresh · Woody",
    featured: true,
    short: "A clean coastal breeze — bright citrus, herbal sage and sun-bleached wood.",
    sizes: [{ ml: 50, price: 140 }, { ml: 100, price: 205 }],
  },
  {
    id: "onyx", name: "Onyx", cat: "men", type: "Eau de Parfum", price: 160,
    notes: ["Leather", "Tobacco", "Oud"], family: "Leather · Oriental",
    badge: "New",
    short: "Dark and magnetic — supple leather, sweet tobacco and resinous oud.",
    sizes: [{ ml: 50, price: 160 }, { ml: 100, price: 240 }],
  },
  {
    id: "atlas", name: "Atlas", cat: "men", type: "Eau de Parfum", price: 150,
    notes: ["Cardamom", "Incense", "Amberwood"], family: "Spicy · Amber",
    short: "Smoky incense and warm cardamom over a backbone of glowing amberwood.",
    sizes: [{ ml: 50, price: 150 }, { ml: 100, price: 225 }],
  },

  // ---------- BODY LOTIONS ----------
  {
    id: "noor-lotion", name: "Noor Veil Body Lotion", cat: "lotions", type: "Body Lotion · 200ml", price: 48,
    notes: ["Rose", "Saffron", "Shea Butter"], family: "Nourishing",
    short: "The Noor scent in a fast-absorbing, deeply hydrating veil for skin.",
    sizes: [{ ml: 200, price: 48 }],
  },
  {
    id: "musk-lotion", name: "Soft Musk Body Lotion", cat: "lotions", type: "Body Lotion · 200ml", price: 44,
    notes: ["White Musk", "Almond", "Aloe"], family: "Comforting",
    featured: true,
    short: "Clean musk and sweet almond melt into a silky, second-skin finish.",
    sizes: [{ ml: 200, price: 44 }],
  },
  {
    id: "amber-lotion", name: "Amber Silk Body Lotion", cat: "lotions", type: "Body Lotion · 200ml", price: 46,
    notes: ["Amber", "Vanilla", "Coconut Oil"], family: "Warm",
    short: "Golden amber and vanilla leave skin soft, warm and faintly luminous.",
    sizes: [{ ml: 200, price: 46 }],
  },

  // ---------- CANDLES ----------
  {
    id: "oud-noir", name: "Oud Noir Candle", cat: "candles", type: "Scented Candle · 220g", price: 58,
    notes: ["Oud", "Rose", "Smoked Wood"], family: "Rich · Woody",
    badge: "Bestseller", featured: true,
    short: "An evening in resin and rose — 50 hours of slow, even burn.",
    sizes: [{ ml: 220, price: 58 }],
  },
  {
    id: "fig-cedar", name: "Fig & Cedar Candle", cat: "candles", type: "Scented Candle · 220g", price: 52,
    notes: ["Green Fig", "Cedar", "Coconut"], family: "Green · Fresh",
    short: "Just-picked fig leaf and dry cedar — a calm, contemporary green.",
    sizes: [{ ml: 220, price: 52 }],
  },
  {
    id: "white-tea", name: "White Tea Candle", cat: "candles", type: "Scented Candle · 220g", price: 48,
    notes: ["White Tea", "Lily", "Sea Salt"], family: "Clean · Airy",
    short: "Crisp white tea and sea salt — the scent of a quiet, sunlit room.",
    sizes: [{ ml: 220, price: 48 }],
  },

  // ---------- GIFT SETS ----------
  {
    id: "discovery", name: "The Discovery Set", cat: "gifts", type: "5 × 2ml Travel Vials", price: 40,
    notes: ["Noor", "Sahar", "Daria", "Zephyr", "Onyx"], family: "Sampler",
    badge: "Gift",
    short: "Five of our signature scents in travel vials — credited toward your full-size purchase.",
    sizes: [{ ml: 10, price: 40 }],
  },
  {
    id: "noor-ritual", name: "Noor Ritual Set", cat: "gifts", type: "EDP 50ml + Body Lotion", price: 180,
    notes: ["Eau de Parfum", "Body Lotion"], family: "Layering Duo",
    featured: true,
    short: "Layer the Noor parfum over its matching lotion for scent that lasts all day.",
    sizes: [{ ml: 250, price: 180 }],
  },
  {
    id: "home-skin", name: "Home & Skin Set", cat: "gifts", type: "Candle + Body Lotion", price: 96,
    notes: ["Oud Noir Candle", "Amber Silk Lotion"], family: "Gift Duo",
    short: "A candle for the room and a lotion for the skin — wrapped and ready to give.",
    sizes: [{ ml: 420, price: 96 }],
  },
];

export const CATEGORIES: Record<string, Category> = {
  women: { label: "Women", tagline: "Eau de Parfum", blurb: "Florals, musks and orientals composed for presence." },
  men: { label: "Men", tagline: "Eau de Parfum", blurb: "Woods, leathers and aromatics with quiet confidence." },
  lotions: { label: "Body Lotions", tagline: "Fragranced Skincare", blurb: "Hydration that carries the scent you love onto skin." },
  candles: { label: "Candles", tagline: "Home Fragrance", blurb: "Hand-poured coconut wax, clean even burn, 50+ hours." },
  gifts: { label: "Gift Sets", tagline: "Ready to Give", blurb: "Thoughtfully paired, beautifully wrapped." },
};

export function findProduct(id: string | null | undefined): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export const NAV = [
  { label: "Women", href: "/shop?category=women" },
  { label: "Men", href: "/shop?category=men" },
  { label: "Lotions", href: "/shop?category=lotions" },
  { label: "Candles", href: "/shop?category=candles" },
  { label: "Gifts", href: "/shop?category=gifts" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
];

export const FREE_SHIP = 95;
