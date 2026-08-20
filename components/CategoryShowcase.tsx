import Image from "next/image";
import Link from "next/link";
import { wc } from "@/lib/woocommerce";

interface ShowcaseTileConfig {
  /** WooCommerce category slug — its first product's image is used as the tile photo */
  category: string;
  href: string;
  /** Pill text — a category name ("For Her") or a CTA ("Shop Now") */
  label: string;
}

interface ShowcaseTile extends ShowcaseTileConfig {
  image: string;
}

interface CategoryShowcaseProps {
  /** Each row renders as two full-bleed tiles side by side */
  rows?: [ShowcaseTileConfig, ShowcaseTileConfig][];
}

const DEFAULT_ROWS: [ShowcaseTileConfig, ShowcaseTileConfig][] = [
  [
    { category: "for-her", href: "/shop?category=for-her", label: "For Her" },
    { category: "for-him", href: "/shop?category=for-him", label: "For Him" },
  ],
  [
    { category: "unisex", href: "/shop?category=unisex", label: "Unisex" },
    { category: "featured", href: "/shop?featured=true", label: "Featured" },
  ],
];

const FALLBACK = "/whisper-campaign.png";

async function resolveTileRows(rows: [ShowcaseTileConfig, ShowcaseTileConfig][]) {
  const flat = rows.flat();

  // WooCommerce's REST API filters products by category ID, not slug —
  // resolve every slug used by these tiles to its numeric ID up front.
  let slugToId: Map<string, number> = new Map();
  try {
    const cats = await wc.getCategories();
    slugToId = new Map((Array.isArray(cats) ? cats : []).map((c: { slug: string; id: number }) => [c.slug, c.id]));
  } catch {
    slugToId = new Map();
  }

  const candidateLists = await Promise.all(
    flat.map(async (tile) => {
      try {
        let params: Record<string, string>;
        if (tile.category === "featured") {
          params = { featured: "true", per_page: "6" };
        } else {
          const id = slugToId.get(tile.category);
          if (!id) return [];
          params = { category: String(id), per_page: "6" };
        }
        const data = await wc.getProducts(params);
        const images: string[] = Array.isArray(data)
          ? data.map((p) => p?.images?.[0]?.src).filter(Boolean)
          : [];
        return images;
      } catch {
        return [];
      }
    })
  );

  const used = new Set<string>();
  const withImages: ShowcaseTile[] = flat.map((tile, i) => {
    const candidates = candidateLists[i];
    const unique = candidates.find((src) => !used.has(src));
    const image = unique || candidates[0] || FALLBACK;
    used.add(image);
    return { ...tile, image };
  });

  // Re-pair back into rows of two, in the original order
  const paired: [ShowcaseTile, ShowcaseTile][] = [];
  for (let i = 0; i < withImages.length; i += 2) {
    paired.push([withImages[i], withImages[i + 1]]);
  }
  return paired;
}

export default async function CategoryShowcase({ rows = DEFAULT_ROWS }: CategoryShowcaseProps) {
  const tileRows = await resolveTileRows(rows);

  return (
    <section className="cat-showcase">
      {tileRows.map((row, i) => (
        <div className="cat-row" key={i}>
          {row.map((tile, j) => (
            <Link key={j} href={tile.href} className="cat-tile-lg">
              <Image src={tile.image} alt={tile.label} fill style={{ objectFit: "contain" }} unoptimized />
              <span className="cat-tile-lg-badge">{tile.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </section>
  );
}
