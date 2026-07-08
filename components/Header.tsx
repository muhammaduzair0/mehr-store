"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FREE_SHIP, NAV } from "@/lib/data";
import { money } from "@/lib/format";
import { useCart, useWishlist } from "@/lib/store";
import { CartDrawerUI, MobileMenuUI } from "@/lib/ui";
import { BagIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./icons";

export default function Header() {
  const pathname = usePathname();
  const page = pathname === "/" ? "home" : pathname.replace(/^\//, "").split("/")[0];
  const cart = useCart();
  const wishlist = useWishlist();
  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const wishCount = wishlist.length;

  return (
    <>
      <div className="announce">
        Complimentary shipping &amp; two samples on orders over {money(FREE_SHIP)} ·{" "}
        <Link href="/shop">Shop now</Link>
      </div>
      <header className="site-header">
        <nav className="nav wrap">
          <button className="icon-btn burger" aria-label="Menu" onClick={MobileMenuUI.open}>
            <MenuIcon />
          </button>
          <Link className="wordmark" href="/">
            Mehr
          </Link>
          <div className="nav-links">
            {NAV.map((n) => {
              const isActive = !n.href.includes("category=") && n.href.split("?")[0] === "/" + page;
              return (
                <Link key={n.label} href={n.href} className={isActive ? "active" : undefined}>
                  {n.label}
                </Link>
              );
            })}
          </div>
          <div className="nav-actions">
            <button className="icon-btn hide-sm" aria-label="Search">
              <SearchIcon />
            </button>
            <Link className="icon-btn" href="/account?tab=wishlist" aria-label="Wishlist">
              <HeartIcon />
              <span className="wish-count" data-empty={wishCount === 0}>
                {wishCount}
              </span>
            </Link>
            <Link className="icon-btn hide-sm" href="/account" aria-label="Account">
              <UserIcon />
            </Link>
            <button className="icon-btn" aria-label="Cart" onClick={CartDrawerUI.open}>
              <BagIcon />
              <span className="cart-count" data-empty={cartCount === 0}>
                {cartCount}
              </span>
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
