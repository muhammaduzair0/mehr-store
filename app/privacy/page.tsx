import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata = { title: "Privacy Policy — Mehr" };

const LAST_UPDATED = "18 August 2026";

export default function PrivacyPage() {
  return (
    <main>
      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow">Legal</p>
          <h1 className="h-xl">Privacy Policy</h1>
          <p className="lead muted" style={{ maxWidth: "48ch", marginTop: 14 }}>
            Last updated {LAST_UPDATED}.
          </p>
        </div>
      </section>

      <div className="wrap policy-page">
        <p className="muted" style={{ fontSize: 13, marginBottom: 36 }}>
          This is a general privacy policy covering what this site actually collects and does. It hasn&apos;t been
          reviewed by a lawyer — have it checked against your local regulations (e.g. Pakistan&apos;s data protection
          rules) before relying on it.
        </p>

        <div className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>What we collect</h2>
          <p>When you place an order, create an account, or contact us, we collect:</p>
          <ul className="pdp-assure" style={{ margin: "14px 0 0" }}>
            <li>Your name, email address, phone number, and shipping/billing address</li>
            <li>Order details — what you bought, when, and order status</li>
            <li>Messages you send us directly (WhatsApp, email, or the contact form)</li>
          </ul>
          <p style={{ marginTop: 16 }}>
            We do not currently process online card payments, so we never collect or store card details — orders are
            fulfilled via Cash on Delivery.
          </p>
        </div>

        <div className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>How we use it</h2>
          <p>
            Solely to process and deliver your order, respond to your messages, and — only if you subscribe — send
            occasional emails about new scents or offers. You can unsubscribe from marketing emails at any time.
          </p>
        </div>

        <div className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>Local storage</h2>
          <p>
            Your cart, wishlist, and account session are stored in your browser&apos;s local storage, not on our
            servers. Clearing your browser data will clear them.
          </p>
        </div>

        <div className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>Sharing</h2>
          <p>
            We don&apos;t sell your personal information. It&apos;s shared only with the services required to run
            the store and get your order to you — our store platform and delivery partners.
          </p>
        </div>

        <div className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>Your rights</h2>
          <p>
            You can ask us what personal data we hold about you, correct it, or request it be deleted, by contacting{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="contact-link">{CONTACT_EMAIL}</a>.
          </p>
        </div>

        <div className="policy-block">
          <h2 className="h-md" style={{ fontWeight: 300 }}>Questions</h2>
          <p>
            Reach out any time — see our <Link href="/contact" className="contact-link">Contact page</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
