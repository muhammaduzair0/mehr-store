"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <div className="foot-mark">Mehr</div>
            <p className="foot-tag">The part of you they remember.</p>
            <div className="news">
              <p
                style={{
                  fontSize: 12,
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "oklch(0.7 0.015 250)",
                  marginBottom: 10,
                }}
              >
                Join the list — 10% off your first order
              </p>
              <form className="news-field" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email address" aria-label="Email" />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="foot-col">
            <h4>Shop</h4>
            <ul>
              <li>
                <Link href="/shop?category=women">Women</Link>
              </li>
              <li>
                <Link href="/shop?category=men">Men</Link>
              </li>
              <li>
                <Link href="/shop?category=lotions">Body Lotions</Link>
              </li>
              <li>
                <Link href="/shop?category=candles">Candles</Link>
              </li>
              <li>
                <Link href="/shop?category=gifts">Gift Sets</Link>
              </li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>The House</h4>
            <ul>
              <li>
                <Link href="/about">Our Story</Link>
              </li>
              <li>
                <Link href="/about">Ingredients</Link>
              </li>
              <li>
                <Link href="/collections">Collections</Link>
              </li>
              <li>
                <a href="#">Sustainability</a>
              </li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Care</h4>
            <ul>
              <li>
                <a href="#">Shipping &amp; Returns</a>
              </li>
              <li>
                <a href="#">Find Your Scent</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {year} Mehr Fragrances. All rights reserved.</span>
          <div className="legal-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
