"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { MobileMenuUI, useMobileMenuOpen } from "@/lib/ui";
import { CloseIcon } from "./icons";

const MOBILE_NAV = [
  { label: "For Her",       href: "/shop?category=for-her" },
  { label: "For Him",       href: "/shop?category=for-him" },
  { label: "Unisex",        href: "/shop?category=unisex-perfumes" },
  { label: "Best Sellers",  href: "/shop?featured=true" },
  { label: "Discovery Set", href: "/shop?category=discovery-set" },
  { label: "Blog",          href: "/blog" },
  { label: "Contact",       href: "/contact" },
];

export default function MobileMenu() {
  const open = useMobileMenuOpen();

  useEffect(() => {
  function onResize() {
    if (window.innerWidth > 768) MobileMenuUI.close();
  }
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") MobileMenuUI.close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={"mmenu" + (open ? " open" : "")}>
      {/* Header */}
      <div className="mm-top">
        <Link href="/" onClick={MobileMenuUI.close}>
          <Image src="/logo.png" alt="Mehr" width={100} height={40} style={{ objectFit: "contain" }} />
        </Link>
        <button className="icon-btn" aria-label="Close" onClick={MobileMenuUI.close}>
          <CloseIcon />
        </button>
      </div>

      {/* Nav links */}
      <nav style={{ marginTop: 24 }}>
        <p style={{ fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, fontWeight: 600 }}>
          Perfumes
        </p>
        {MOBILE_NAV.slice(0, 3).map((n) => (
          <Link key={n.label} className="mm-link" href={n.href} onClick={MobileMenuUI.close}>
            {n.label}
          </Link>
        ))}
        <p style={{ fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--muted)", marginTop: 20, marginBottom: 8, fontWeight: 600 }}>
          Explore
        </p>
        {MOBILE_NAV.slice(3).map((n) => (
          <Link key={n.label} className="mm-link" href={n.href} onClick={MobileMenuUI.close}>
            {n.label}
          </Link>
        ))}
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--line)", display: "flex", gap: 16 }}>
          <Link className="btn btn-outline" href="/account" onClick={MobileMenuUI.close} style={{ flex: 1, textAlign: "center" }}>
            Account
          </Link>
          <Link className="btn btn-primary" href="/account?tab=wishlist" onClick={MobileMenuUI.close} style={{ flex: 1, textAlign: "center" }}>
            Wishlist
          </Link>
        </div>
      </nav>
    </div>
  );
}