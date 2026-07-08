"use client";

import Link from "next/link";
import { NAV } from "@/lib/data";
import { MobileMenuUI, useMobileMenuOpen } from "@/lib/ui";
import { CloseIcon } from "./icons";

export default function MobileMenu() {
  const open = useMobileMenuOpen();

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
