import Link from "next/link";
import { money } from "@/lib/format";
import { FREE_SHIP, SHIP_COST } from "@/lib/data";

export const metadata = { title: "Shipping & Returns — Mehr" };

export default function ShippingReturnsPage() {
  return (
    <main>
      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow">Care</p>
          <h1 className="h-xl">Shipping &amp; Returns</h1>
        </div>
      </section>

      <div className="wrap policy-page">
        <section className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>Shipping</h2>
          <ul className="pdp-assure" style={{ margin: "18px 0 0" }}>
            <li>Orders ship within 1–2 business days of being placed.</li>
            <li>Delivery takes 3–5 business days across Pakistan.</li>
            <li>Shipping is {money(SHIP_COST)} on orders under {money(FREE_SHIP)}, and free on orders over {money(FREE_SHIP)}.</li>
            <li>Cash on Delivery is available nationwide.</li>
            <li>We currently ship within Pakistan only.</li>
          </ul>
        </section>

        <section className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>Returns &amp; exchanges</h2>
          <div className="lead flow" style={{ "--flow": "1.1em", color: "var(--ink-2)", fontSize: 15 } as React.CSSProperties}>
            <p>
              If your order arrives damaged, incorrect, or faulty, contact us within 7 days of delivery and we&apos;ll
              arrange a replacement or refund — no questions asked.
            </p>
            <p>
              For a change of mind, unopened and unused items in their original packaging can be returned within 7
              days of delivery. Opened fragrances can&apos;t be returned for hygiene reasons, unless faulty.
            </p>
            <p>
              To start a return, message us on WhatsApp or email with your order number and photos if the item
              arrived damaged. We&apos;ll confirm the next steps from there.
            </p>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
            <Link className="btn btn-outline" href="/contact">Contact us</Link>
            <Link className="btn btn-outline" href="/faq">Read the FAQ</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
