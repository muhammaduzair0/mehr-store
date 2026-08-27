"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const NAV_LINKS = [
  { label: "Perfumes", href: "/shop" },
  { label: "Men", href: "/shop?category=for-him" },
  { label: "Women", href: "/shop?category=for-her" },
  { label: "Unisex", href: "/shop?category=unisex" },
  { label: "Best Sellers", href: "/shop?featured=true" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/** Static render used while NavTabs suspends on useSearchParams — no active state yet. */
export function NavTabsFallback() {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <Link key={link.label} href={link.href} className="nav-tab">
          {link.label}
        </Link>
      ))}
    </>
  );
}

export default function NavTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // usePathname() never includes the query string, and every /shop tab is
  // distinguished only by its query (category=X, featured=true, or neither
  // for the plain "Perfumes" tab) — compare those explicitly, or every
  // /shop-based tab would read as active together.
  function isActive(href: string) {
    const [path, query] = href.split("?");
    if (pathname !== path) return false;
    if (path !== "/shop") return true;
    const wanted = new URLSearchParams(query);
    const wantsCategory = wanted.get("category");
    const wantsFeatured = wanted.get("featured") === "true";
    const hasCategory = searchParams.get("category");
    const hasFeatured = searchParams.get("featured") === "true";
    if (wantsCategory) return wantsCategory === hasCategory;
    if (wantsFeatured) return wantsFeatured === hasFeatured;
    return !hasCategory && !hasFeatured;
  }

  return (
    <>
      {NAV_LINKS.map((link) => (
        <Link key={link.label} href={link.href} className={"nav-tab" + (isActive(link.href) ? " active" : "")}>
          {link.label}
        </Link>
      ))}
    </>
  );
}
