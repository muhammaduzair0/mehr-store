import FaqAccordion from "@/components/FaqAccordion";
import { money } from "@/lib/format";
import { FREE_SHIP, SHIP_COST } from "@/lib/data";

export const metadata = { title: "FAQ — Mehr" };

const FAQS = [
  {
    q: "How long does the fragrance last?",
    a: "Every scent is built at 40% parfum concentration — well above the industry standard — so it sits close to the skin for hours, not minutes.",
  },
  {
    q: "What if I want to try before I commit?",
    a: "Our Discovery Set lets you sample multiple scents in miniature before you commit to a full bottle.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders ship within 1–2 business days and arrive within 3–5 business days across Pakistan.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash on Delivery is available on every order. Online card payment is coming soon.",
  },
  {
    q: "Do you offer free shipping?",
    a: `Shipping is ${money(SHIP_COST)} on orders under ${money(FREE_SHIP)}, and free on orders over ${money(FREE_SHIP)}.`,
  },
  {
    q: "Can I change or cancel my order?",
    a: "Reach out on WhatsApp or by email as soon as possible — we can usually amend or cancel an order before it ships.",
  },
  {
    q: "What's your return policy?",
    a: "See our Shipping & Returns page for the full policy on damaged, incorrect, or unwanted items.",
  },
  {
    q: "Do you ship outside Pakistan?",
    a: "Not yet — we currently ship within Pakistan only.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow">Good to know</p>
          <h1 className="h-xl">Frequently asked questions</h1>
        </div>
      </section>
      <div className="wrap" style={{ paddingBlock: "clamp(36px, 4.5vw, 60px) clamp(64px, 8vw, 108px)" }}>
        <div className="faq-wrap">
          <FaqAccordion items={FAQS} />
        </div>
      </div>
    </main>
  );
}
