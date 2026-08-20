import type { Metadata } from "next";
import { Hanken_Grotesk, Schibsted_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { SITE_URL } from "@/lib/site";
import { CONTACT_EMAIL, INSTAGRAM_URL, TIKTOK_URL, FACEBOOK_URL } from "@/lib/contact";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const TITLE = "Mehr — The part of you they remember";
const DESCRIPTION = "Fragrance composed in the cool light of morning — refined, lasting, unmistakably yours.";

export const metadata: Metadata = {
  // Lets every page below resolve its `openGraph.images`/`twitter.images`
  // (including relative ones set per-page via generateMetadata) to a real
  // absolute URL — without it, share previews on WhatsApp/Instagram/etc break.
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Mehr",
    type: "website",
    images: [{ url: "/logo.png", width: 2917, height: 1503, alt: "Mehr" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/logo.png"],
  },
};

// Tells search engines this is a real brand (name, logo, social profiles) —
// feeds the Knowledge Panel and lets Google associate the Instagram/TikTok/
// Facebook links with this site.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mehr",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  email: CONTACT_EMAIL,
  sameAs: [INSTAGRAM_URL, TIKTOK_URL, FACEBOOK_URL],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Mehr",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hanken.variable} ${schibsted.variable} ${playfair.variable}`}>
      <body>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Header />
        <MobileMenu />
        {children}
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
