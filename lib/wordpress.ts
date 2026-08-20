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

export const wp = {
  getPosts: (params?: Record<string, string>) =>
    axios
      .get(`${BASE_URL}/posts`, { params: { _embed: "1", per_page: "12", ...params } })
      .then((r) => r.data as WPPost[]),

  getPostBySlug: (slug: string) =>
    axios
      .get(`${BASE_URL}/posts`, { params: { slug, _embed: "1" } })
      .then((r) => (r.data as WPPost[])[0] ?? null),
};

export function featuredImage(post: WPPost): string | null {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
