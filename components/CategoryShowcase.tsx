"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

export default function CategoryShowcase({ rows = DEFAULT_ROWS }: CategoryShowcaseProps) {
  const [tileRows, setTileRows] = useState<[ShowcaseTile, ShowcaseTile][] | null>(null);

  useEffect(() => {
    async function fetchImages() {
      const flat = rows.flat();
      const candidateLists = await Promise.all(
        flat.map(async (tile) => {
          try {
            const url =
              tile.category === "featured"
                ? "/api/products?featured=true&per_page=6"
                : `/api/products?category=${tile.category}&per_page=6`;
            const res = await fetch(url);
            const data = await res.json();
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
      setTileRows(paired);
    }
    fetchImages();
  }, [rows]);

  if (!tileRows) {
    return (
      <section className="cat-showcase">
        {rows.map((row, i) => (
          <div className="cat-row" key={i}>
            {row.map((_, j) => (
              <div key={j} className="cat-tile-lg cat-tile-lg--skeleton" />
            ))}
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="cat-showcase">
      {tileRows.map((row, i) => (
        <div className="cat-row" key={i}>
          {row.map((tile, j) => (
            <Link key={j} href={tile.href} className="cat-tile-lg">
              <Image src={tile.image} alt={tile.label} fill style={{ objectFit: "cover" }} unoptimized />
              <span className="cat-tile-lg-badge">{tile.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </section>
  );
}