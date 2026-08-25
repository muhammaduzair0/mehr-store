import axios from "axios";

// Separate from lib/woocommerce.ts on purpose — this talks to WP core's
// own REST API (wp/v2), not the WooCommerce plugin's (wc/v3), and reads
// of published posts are public, so no admin auth header is sent here.
const BASE_URL = `${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wp/v2`;

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string; alt_text?: string }[];
    author?: { name: string }[];
  };
}

export interface HeroBanner {
  id: number;
  eyebrow: string;
  headline: string;
  href: string;
  image: string | null;
}

export const wp = {
  getPosts: (params?: Record<string, string>) =>
    axios
      .get(`${BASE_URL}/posts`, { params: { _embed: "1", per_page: "12", ...params } })
      .then((r) => r.data as WPPost[]),

  getPostBySlug: (slug: string) =>
    axios
      .get(`${BASE_URL}/posts`, { params: { slug, _embed: "1" } })
      .then((r) => (r.data as WPPost[])[0] ?? null),

  // Served by the "Mehr Hero Banners" mu-plugin (Settings > Hero Banners in
  // wp-admin), not WP core — hence the separate "mehr/v1" namespace instead
  // of "wp/v2".
  getHeroBanners: () =>
    axios
      .get(`${process.env.NEXT_PUBLIC_WC_URL}/wp-json/mehr/v1/hero-banners`)
      .then((r) => r.data as HeroBanner[]),
};

export function featuredImage(post: WPPost): string | null {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

export function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).trim();
}

// WP's REST API returns title/excerpt HTML-encoded (e.g. "Pakistan&#8217;s"),
// which is correct for dangerouslySetInnerHTML but renders literally when
// used as a plain React child (title text, alt attributes, <title> tags) —
// React doesn't decode entities in text nodes the way a browser parsing HTML
// does. Decode explicitly wherever title/excerpt are used as plain text.
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

export function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => NAMED_ENTITIES[name.toLowerCase()] ?? match);
}
