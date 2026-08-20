"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { money } from "@/lib/format";
import { FREE_SHIP } from "@/lib/data";
import { useCart, useWishlist } from "@/lib/store";
import { CartDrawerUI, MobileMenuUI } from "@/lib/ui";
import { BagIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./icons";
import NavTabs, { NavTabsFallback } from "./NavTabs";

export default function Header() {
  const cart = useCart();
  const wishlist = useWishlist();
  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const wishCount = wishlist.length;

  return (
    <>
      {/* Row 1 — Announcement */}
      <div className="announce">
        10% off with code <strong>WELCOME10</strong> · Free shipping over{" "}
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
            <Link className="icon-btn hide-sm" href="/search" aria-label="Search">
              <SearchIcon />
            </Link>
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
            <Suspense fallback={<NavTabsFallback />}>
              <NavTabs />
            </Suspense>
          </div>
        </nav>
      </header>
    </>
  );
}
