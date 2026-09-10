import Image from "next/image";
import Link from "next/link";
import { wc } from "@/lib/woocommerce";

interface ShowcaseTileConfig {
  /** Product whose image is the hover-state photo for this tile */
  productSlug: string;
  /** Media library title of this tile's default lifestyle banner photo */
  bannerTitle: string;
  href: string;
  /** Pill text — a category name ("Men's Collection") or a CTA ("Best Seller") */
  label: string;
}

interface ShowcaseTile extends ShowcaseTileConfig {
  image: string;
  bannerImage: string | null;
}

interface CategoryShowcaseProps {
  /** Each row renders as two full-bleed tiles side by side */
  rows?: [ShowcaseTileConfig, ShowcaseTileConfig][];
}

const DEFAULT_ROWS: [ShowcaseTileConfig, ShowcaseTileConfig][] = [
  [
    { productSlug: "majesty", bannerTitle: "Category-Bestseller", href: "/shop?featured=true", label: "Best Seller" },
    { productSlug: "kafka", bannerTitle: "Category-Men", href: "/shop?category=men", label: "Men's Collection" },
  ],
  [
    { productSlug: "whisper", bannerTitle: "Category-Women", href: "/shop?category=women", label: "Women's Collection" },
    { productSlug: "elia", bannerTitle: "Category-Unisex", href: "/shop?category=unisex", label: "Unisex" },
  ],
];

const FALLBACK = "/whisper-campaign.png";

async function resolveTileRows(rows: [ShowcaseTileConfig, ShowcaseTileConfig][]) {
  const flat = rows.flat();

  const withImages: ShowcaseTile[] = await Promise.all(
    flat.map(async (tile) => {
      const [product, banner] = await Promise.all([
        wc.getProductBySlug(tile.productSlug).catch(() => null),
        wc.getMediaByTitle(tile.bannerTitle).catch(() => null),
      ]);
      return {
        ...tile,
        image: product?.images?.[0]?.src || FALLBACK,
        bannerImage: banner?.source_url || null,
      };
    })
  );

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
              {tile.bannerImage ? (
                <>
                  <Image
                    src={tile.bannerImage}
                    alt={tile.label}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                    className="cat-tile-img cat-tile-img-banner"
                  />
                  <Image
                    src={tile.image}
                    alt={tile.label}
                    fill
                    style={{ objectFit: "contain" }}
                    unoptimized
                    className="cat-tile-img cat-tile-img-product"
                  />
                </>
              ) : (
                <Image src={tile.image} alt={tile.label} fill style={{ objectFit: "contain" }} unoptimized />
              )}
              <span className="cat-tile-lg-badge">{tile.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </section>
  );
}
