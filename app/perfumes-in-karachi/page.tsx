import Link from "next/link";
import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";
import ProductGrid from "@/components/ProductGrid";
import { wc } from "@/lib/woocommerce";
import type { WCProduct } from "@/lib/types";
import { money } from "@/lib/format";
import { FREE_SHIP, SHIP_COST } from "@/lib/data";
import { WHATSAPP_URL } from "@/lib/contact";
import { SITE_URL } from "@/lib/site";
import { inspiredBy, displayName } from "@/lib/inspired";

// Local landing page for "perfume in Karachi"-type searches. Facts here must
// match /shipping-returns and /faq (1–2 day Karachi delivery, COD, rates).
export const revalidate = 300;

const DESCRIPTION =
  "Long-lasting perfumes delivered in Karachi in 1–2 days, with cash on delivery. 40% parfum impressions of Baccarat Rouge 540, Imperial Valley, Oud for Greatness and more.";

export const metadata: Metadata = {
  title: "Long-Lasting Perfumes in Karachi — 1–2 Day Delivery | Mehr",
  description: DESCRIPTION,
  alternates: { canonical: "/perfumes-in-karachi" },
  openGraph: {
    title: "Long-Lasting Perfumes in Karachi — Mehr",
    description: DESCRIPTION,
    siteName: "Mehr",
    type: "website",
    url: "/perfumes-in-karachi",
  },
};

const AREAS = [
  "DHA", "Clifton", "Gulshan-e-Iqbal", "Gulistan-e-Jauhar", "North Nazimabad", "PECHS", "Bahadurabad",
  "Tariq Road", "Federal B Area", "Nazimabad", "Saddar", "Bahria Town Karachi", "Scheme 33", "Malir",
  "Korangi", "Defence View", "Shah Faisal Colony", "North Karachi", "Gulberg", "Karachi Cantt",
];

const FAQS = [
  {
    q: "How fast is perfume delivery in Karachi?",
    a: "Orders within Karachi are delivered in 1–2 business days. Orders to the rest of Pakistan arrive in 3–5 business days.",
  },
  {
    q: "Is cash on delivery available in Karachi?",
    a: "Yes — cash on delivery is available on every order, in Karachi and across Pakistan. You pay when your perfume arrives.",
  },
  {
    q: "How much is delivery in Karachi?",
    a: `Delivery is ${money(SHIP_COST)} on orders under ${money(FREE_SHIP)}, and free on orders over ${money(FREE_SHIP)}.`,
  },
  {
    q: "Are Mehr perfumes long-lasting in Karachi's heat and humidity?",
    a: "Every Mehr fragrance is made at 40% parfum concentration — far higher than a typical eau de toilette or eau de parfum — so it holds up through Karachi's heat for hours, not minutes. For daytime summer wear, fresher scents like Vasl and Humnafas perform best.",
  },
  {
    q: "Do you sell impressions of designer perfumes?",
    a: "Yes. Each Mehr scent is inspired by a well-known fragrance — for example Majesty (inspired by Gissah Imperial Valley), Elia (inspired by Baccarat Rouge 540) and Timeless Aura (inspired by Initio Oud for Greatness). See the full list on our Inspired By page.",
  },
  {
    q: "Is Mehr based in Karachi?",
    a: "Yes — Mehr is a Karachi-based online fragrance house. We don't have a walk-in shop; order online or on WhatsApp and we deliver to your door.",
  },
];

// Best seller first, then the rest in catalogue order.
const STAR_SLUG = "majesty";

async function getProducts(): Promise<WCProduct[]> {
  try {
    const data = await wc.getProducts({ per_page: "100", status: "publish" });
    const list: WCProduct[] = Array.isArray(data) ? data : [];
    return [...list.filter((p) => p.slug === STAR_SLUG), ...list.filter((p) => p.slug !== STAR_SLUG)];
  } catch {
    return [];
  }
}

export default async function KarachiPage() {
  const products = await getProducts();
  const star = products.find((p) => p.slug === STAR_SLUG);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Perfumes in Karachi", item: `${SITE_URL}/perfumes-in-karachi` },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow">Karachi · Delivered in 1–2 days</p>
          <h1 className="h-xl">Long-lasting perfumes in Karachi</h1>
          <p className="lead" style={{ maxWidth: "60ch", marginTop: 14 }}>
            Mehr is a Karachi-based fragrance house. Every scent is made at 40% parfum concentration to last
            through Karachi&apos;s heat — delivered to your door in 1–2 days, with cash on delivery.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
            <Link className="btn btn-primary" href="/shop">Shop all perfumes</Link>
            <Link className="btn btn-outline" href="/inspired-by">Find your designer favourite</Link>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingBottom: 80 }}>
        <ul className="pdp-assure karachi-points">
          <li>1–2 day delivery anywhere in Karachi</li>
          <li>Cash on delivery — pay when it arrives</li>
          <li>Free delivery over {money(FREE_SHIP)}</li>
          <li>40% parfum concentration, 50 ml bottles</li>
        </ul>

        {star && (
          <section className="karachi-star">
            <p className="eyebrow">Karachi&apos;s favourite</p>
            <h2 className="h-lg" style={{ marginTop: 10 }}>
              <Link href={`/product/${star.slug}`}>{displayName(star.name)}</Link>
              {inspiredBy(star) && <span className="karachi-star-sub"> — inspired by {inspiredBy(star)}</span>}
            </h2>
            <p style={{ maxWidth: "62ch", marginTop: 12 }}>
              Our best-selling perfume. Bergamot and pink pepper open into rich oud and white amber, settling on
              leather, musk and vetiver — bold, warm and long-lasting, at a fraction of the price of the original.
            </p>
            <Link className="ulink" href={`/product/${star.slug}`} style={{ display: "inline-block", marginTop: 12 }}>
              Shop {displayName(star.name)}
            </Link>
          </section>
        )}

        <section style={{ marginTop: 48 }}>
          <h2 className="h-lg">Shop perfumes with Karachi delivery</h2>
          <p className="muted" style={{ margin: "8px 0 24px" }}>
            Impressions of the world&apos;s most-loved fragrances, made to last.
          </p>
          <ProductGrid products={products} />
        </section>

        <section className="policy-block" style={{ marginTop: 56 }}>
          <h2 className="h-lg">Why Karachi chooses Mehr</h2>
          <div className="blog-post-body" style={{ maxWidth: "70ch" }}>
            <p>
              Karachi&apos;s heat and sea humidity make most perfumes disappear within an hour or two. That&apos;s why
              every Mehr fragrance is made at <strong>40% parfum concentration</strong> — well above a typical eau de
              toilette (5–15%) or eau de parfum (15–20%) — so the scent keeps going from morning to night.
            </p>
            <p>
              Each Mehr scent is an impression of a fragrance you already know and love — from{" "}
              <Link href="/product/elia">Baccarat Rouge 540</Link> and{" "}
              <Link href="/product/timeless-aura">Initio Oud for Greatness</Link> to{" "}
              <Link href="/product/amour">Armani Stronger With You Intensely</Link> — at a price that makes sense
              for everyday wear. See every match on our <Link href="/inspired-by">Inspired By</Link> page.
            </p>
            <p>
              Not sure which to choose? Take our <Link href="/find-your-scent">scent quiz</Link>, or message us on{" "}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a> and we&apos;ll help you pick.
            </p>
          </div>
        </section>

        <section className="policy-block" style={{ marginTop: 40 }}>
          <h2 className="h-md" style={{ fontWeight: 300 }}>We deliver across Karachi</h2>
          <p className="muted karachi-areas">{AREAS.join(" · ")} — and every other area of Karachi.</p>
        </section>

        <section style={{ marginTop: 48 }}>
          <h2 className="h-lg" style={{ marginBottom: 18 }}>Perfume delivery in Karachi — FAQs</h2>
          <div className="faq-wrap">
            <FaqAccordion items={FAQS} />
          </div>
        </section>
      </div>
    </main>
  );
}
