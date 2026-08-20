"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PERFUME_DROPDOWN = [
  { label: "For Her", href: "/shop?category=for-her" },
  { label: "For Him", href: "/shop?category=for-him" },
  { label: "Unisex", href: "/shop?category=unisex" },
];

const NAV_LINKS = [
  { label: "Perfumes", href: "/shop", dropdown: true },
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
  const [dropOpen, setDropOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openDrop() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDropOpen(true);
  }
  function closeDrop() {
    timerRef.current = setTimeout(() => setDropOpen(false), 150);
  }
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  // usePathname() never includes the query string, so a plain string
  // comparison against "/shop?featured=true" can never match — and worse,
  // "Perfumes" (href "/shop") would then read as active on every /shop-based
  // page, including Best Sellers. Compare path and query explicitly instead.
  function isActive(href: string) {
    const [path, query] = href.split("?");
    if (pathname !== path) return false;
    if (path !== "/shop") return true;
    const isFeatured = searchParams.get("featured") === "true";
    const wantsFeatured = query === "featured=true";
    return wantsFeatured === isFeatured;
  }

  return (
    <>
      {NAV_LINKS.map((link) =>
        link.dropdown ? (
          <div
            key={link.label}
            className="nav-drop-wrap"
            onMouseEnter={openDrop}
            onMouseLeave={closeDrop}
          >
            <Link href={link.href} className={"nav-tab" + (isActive(link.href) ? " active" : "")}>
              {link.label}
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{
                  marginLeft: 4,
                  transition: "transform .25s",
                  transform: dropOpen ? "rotate(180deg)" : "none",
                }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </Link>
            {dropOpen && (
              <div
                className="nav-dropdown"
                onMouseEnter={openDrop}
                onMouseLeave={closeDrop}
              >
                {PERFUME_DROPDOWN.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="drop-item"
                    onClick={() => setDropOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Link key={link.label} href={link.href} className={"nav-tab" + (isActive(link.href) ? " active" : "")}>
            {link.label}
          </Link>
        ),
      )}
    </>
  );
}
