import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata = { title: "Terms of Service — Mehr" };

const LAST_UPDATED = "18 August 2026";

export default function TermsPage() {
  return (
    <main>
      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow">Legal</p>
          <h1 className="h-xl">Terms of Service</h1>
          <p className="lead muted" style={{ maxWidth: "48ch", marginTop: 14 }}>
            Last updated {LAST_UPDATED}.
          </p>
        </div>
      </section>

      <div className="wrap policy-page">
        <p className="muted" style={{ fontSize: 13, marginBottom: 36 }}>
          This is a general terms template, not a substitute for legal advice — have it reviewed against Pakistani
          consumer and e-commerce law before relying on it.
        </p>

        <div className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>Using this site</h2>
          <p>
            By placing an order or creating an account, you agree to these terms. If you don&apos;t agree, please
            don&apos;t use the site.
          </p>
        </div>

        <div className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>Orders &amp; pricing</h2>
          <p>
            All prices are listed in Pakistani Rupees (Rs) and may change without notice. We reserve the right to
            refuse or cancel any order — for example if a product is out of stock or a price was listed in error.
          </p>
          <p>
            Orders are currently paid via Cash on Delivery only. Online payment options may be added in future.
          </p>
        </div>

        <div className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>Shipping &amp; returns</h2>
          <p>
            See our <Link href="/shipping-returns" className="contact-link">Shipping &amp; Returns</Link> page for
            delivery timelines and our return policy.
          </p>
        </div>

        <div className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>Intellectual property</h2>
          <p>
            All site content — text, photography, and the Mehr name and logo — belongs to Mehr and may not be
            reused without permission.
          </p>
        </div>

        <div className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>Limitation of liability</h2>
          <p>
            We aim to keep this site accurate and available, but we don&apos;t guarantee it will be error-free or
            uninterrupted. To the extent permitted by law, Mehr isn&apos;t liable for indirect or consequential
            losses arising from your use of the site.
          </p>
        </div>

        <div className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>Governing law</h2>
          <p>These terms are governed by the laws of Pakistan.</p>
        </div>

        <div className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>Changes</h2>
          <p>We may update these terms occasionally. Continued use of the site after a change means you accept it.</p>
        </div>

        <div className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>Contact</h2>
          <p>
            Questions about these terms — email <a href={`mailto:${CONTACT_EMAIL}`} className="contact-link">{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
