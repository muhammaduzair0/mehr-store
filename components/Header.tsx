"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { money } from "@/lib/format";
import { useCart, useWishlist } from "@/lib/store";
import { CartDrawerUI, MobileMenuUI } from "@/lib/ui";
import { BagIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./icons";

const FREE_SHIP = 5000;

const PERFUME_DROPDOWN = [
  { label: "For Her", href: "/shop?category=for-her" },
  { label: "For Him", href: "/shop?category=for-him" },
  { label: "Unisex", href: "/shop?category=unisex-perfumes" },
];

const NAV_LINKS = [
  { label: "Perfumes", href: "/shop", dropdown: true },
  { label: "Best Sellers", href: "/shop?featured=true" },
  { label: "Discovery Set", href: "/shop?category=discovery-set" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const cart = useCart();
  const wishlist = useWishlist();
  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const wishCount = wishlist.length;
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

  return (
    <>
      {/* Row 1 — Announcement */}
      <div className="announce">
        Complimentary shipping &amp; two samples on orders over{" "}
        {money(FREE_SHIP)} · <Link href="/shop">Shop now</Link>
      </div>

      <header className="site-header">
        {/* Row 2 — Logo + Icons */}
        <div className="header-main wrap">
          {/* Left */}
          <div className="header-left">
            <button
              className="icon-btn burger"
              aria-label="Menu"
              onClick={MobileMenuUI.open}
            >
              <MenuIcon />
            </button>
            <Link
              className="icon-btn hide-sm"
              href="/account"
              aria-label="Account"
            >
              <UserIcon />
            </Link>
          </div>

          {/* Center — Logo */}
          <Link className="wordmark" href="/" aria-label="Mehr Home">
            <Image
              src="/logo.png"
              alt="Mehr"
              width={130}
              height={52}
              style={{ objectFit: "contain", display: "block" }}
              priority
            />
          </Link>

          {/* Right */}
          <div className="header-right">
            <button className="icon-btn hide-sm" aria-label="Search">
              <SearchIcon />
            </button>
            <Link
              className="icon-btn"
              href="/account?tab=wishlist"
              aria-label="Wishlist"
            >
              <HeartIcon />
              <span className="wish-count" data-empty={wishCount === 0}>
                {wishCount}
              </span>
            </Link>
            <button
              className="icon-btn"
              aria-label="Cart"
              onClick={CartDrawerUI.open}
            >
              <BagIcon />
              <span className="cart-count" data-empty={cartCount === 0}>
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Row 3 — Nav links */}
        <nav className="header-nav">
          <div className="header-nav-inner wrap">
            {NAV_LINKS.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className="nav-drop-wrap"
                  onMouseEnter={openDrop}
                  onMouseLeave={closeDrop}
                >
                  <Link
                    href={link.href}
                    className={
                      "nav-tab" + (pathname === link.href ? " active" : "")
                    }
                  >
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
                <Link
                  key={link.label}
                  href={link.href}
                  className={
                    "nav-tab" + (pathname === link.href ? " active" : "")
                  }
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
