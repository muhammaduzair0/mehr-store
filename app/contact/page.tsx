import ContactClient from "./ContactClient";
import { CONTACT_EMAIL, WHATSAPP_URL, INSTAGRAM_URL, FACEBOOK_URL, TIKTOK_URL } from "@/lib/contact";

export const metadata = { title: "Contact — Mehr" };

export default function ContactPage() {
  return (
    <main>
      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow">Get in touch</p>
          <h1 className="h-xl">We&apos;d love to hear from you</h1>
          <p className="lead" style={{ maxWidth: "48ch", marginTop: 14 }}>
            Questions about an order, a scent, or anything else — reach us directly or send a message below.
          </p>
        </div>
      </section>

      <div className="wrap contact-layout">
        <div className="contact-channels">
          <div className="contact-channel">
            <p className="eyebrow">WhatsApp</p>
            <a className="h-sm contact-link" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Message us
            </a>
            <p className="muted" style={{ marginTop: 6 }}>Fastest way to reach us — usually within a few hours.</p>
          </div>
          <div className="contact-channel">
            <p className="eyebrow">Email</p>
            <a className="h-sm contact-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <p className="muted" style={{ marginTop: 6 }}>For order issues, wholesale, or anything in writing.</p>
          </div>
          <div className="contact-channel">
            <p className="eyebrow">Follow</p>
            <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="ulink reveal">Instagram</a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="ulink reveal">Facebook</a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="ulink reveal">TikTok</a>
            </div>
          </div>
        </div>

        <ContactClient />
      </div>
    </main>
  );
}
