"use client";

import Link from "next/link";

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <div className="foot-mark">Mehr</div>
            <p className="foot-tag">The part of you they remember.</p>
            <div className="foot-social">
              <a href="https://tiktok.com/@mehr" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="social-icon"><TikTokIcon /></a>
              <a href="https://facebook.com/mehr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon"><FacebookIcon /></a>
              <a href="https://instagram.com/mehr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon"><InstagramIcon /></a>
              <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-icon whatsapp"><WhatsAppIcon /></a>
            </div>
            <div className="news">
              <p style={{ fontSize: 11, letterSpacing: ".20em", textTransform: "uppercase" as const, color: "oklch(0.62 0.016 250)", marginBottom: 10, fontWeight: 600 }}>
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
              <li><Link href="/shop?category=for-her">For Her</Link></li>
              <li><Link href="/shop?category=for-him">For Him</Link></li>
              <li><Link href="/shop?category=unisex-perfumes">Unisex</Link></li>
              <li><Link href="/shop?category=discovery-set">Discovery Set</Link></li>
              <li><Link href="/shop?featured=true">Best Sellers</Link></li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>The House</h4>
            <ul>
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/collections">Collections</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><a href="#">Sustainability</a></li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>Care</h4>
            <ul>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><a href="#">Shipping &amp; Returns</a></li>
              <li><a href="#">Find Your Scent</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© {year} Mehr Fragrances. All rights reserved.</span>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
