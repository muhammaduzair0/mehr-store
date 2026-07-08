"use client";

import Link from "next/link";
import { useEffect } from "react";
import { NAV } from "@/lib/data";
import { MobileMenuUI, useMobileMenuOpen } from "@/lib/ui";
import { CloseIcon } from "./icons";

export default function MobileMenu() {
  const open = useMobileMenuOpen();

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") MobileMenuUI.close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={"mmenu" + (open ? " open" : "")}>
      <div className="mm-top">
        <Link className="wordmark" href="/" style={{ justifySelf: "start" }} onClick={MobileMenuUI.close}>
          Mehr
        </Link>
        <button className="icon-btn" aria-label="Close" onClick={MobileMenuUI.close}>
          <CloseIcon />
        </button>
      </div>
      <nav style={{ marginTop: 18 }}>
        {NAV.map((n) => (
          <Link key={n.label} className="mm-link" href={n.href} onClick={MobileMenuUI.close}>
            {n.label}
          </Link>
        ))}
        <Link className="mm-link" href="/account?tab=wishlist" onClick={MobileMenuUI.close}>
          Wishlist
        </Link>
        <Link className="mm-link" href="/account" onClick={MobileMenuUI.close}>
          Account
        </Link>
      </nav>
    </div>
  );
}
