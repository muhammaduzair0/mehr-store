import { wc } from "@/lib/woocommerce";
import { SITE_URL } from "@/lib/site";
import { decodeEntities } from "@/lib/wordpress";
import { displayName } from "@/lib/inspired";
import { SHIP_COST } from "@/lib/data";
import type { WCProduct } from "@/lib/types";

// Google Merchant Center product feed (RSS 2.0 + g: namespace).
// Add https://themehr.net/merchant-feed.xml in Merchant Center as a
// "scheduled fetch" data source; Google re-reads it daily, so prices, sales
// and stock stay in sync with WooCommerce automatically.
//
// Designer names ("Inspired by …") are deliberately left OUT of titles and
// descriptions: Merchant Center's counterfeit policy disapproves listings that
// carry another brand's name.

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const plain = (html: string) => decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

const GENDER: Record<string, string> = { men: "male", women: "female", unisex: "unisex" };

function gender(p: WCProduct): string {
  const slugs = p.categories.map((c) => c.slug);
  if (slugs.includes("unisex") || (slugs.includes("men") && slugs.includes("women"))) return "unisex";
  for (const s of slugs) if (GENDER[s]) return GENDER[s];
  return "unisex";
}

function item(p: WCProduct): string {
  const name = displayName(p.name);
  const regular = Number(p.regular_price || p.price) || 0;
  const onSale = p.on_sale && Number(p.sale_price) > 0 && Number(p.sale_price) < regular;
  const desc = plain(p.description || p.short_description || "") ||
    `${name} by Mehr — a long-lasting 40% parfum, 50 ml.`;
  const [img, ...more] = [...new Set(p.images.map((i) => i.src))];
  const saleDates =
    onSale && p.date_on_sale_from_gmt && p.date_on_sale_to_gmt
      ? `<g:sale_price_effective_date>${p.date_on_sale_from_gmt}Z/${p.date_on_sale_to_gmt}Z</g:sale_price_effective_date>`
      : "";
  return `    <item>
      <g:id>${esc(p.sku || String(p.id))}</g:id>
      <g:title>${esc(`${name} Eau de Parfum 50 ml – Mehr`)}</g:title>
      <g:description>${esc(desc.slice(0, 4900))}</g:description>
      <g:link>${SITE_URL}/product/${p.slug}</g:link>
      ${img ? `<g:image_link>${esc(img)}</g:image_link>` : ""}
      ${more.slice(0, 10).map((m) => `<g:additional_image_link>${esc(m)}</g:additional_image_link>`).join("\n      ")}
      <g:availability>${p.stock_status === "outofstock" ? "out_of_stock" : p.stock_status === "onbackorder" ? "backorder" : "in_stock"}</g:availability>
      <g:price>${regular.toFixed(2)} PKR</g:price>
      ${onSale ? `<g:sale_price>${Number(p.sale_price).toFixed(2)} PKR</g:sale_price>` : ""}
      ${saleDates}
      <g:brand>Mehr</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>479</g:google_product_category>
      <g:product_type>Fragrance &gt; ${esc(p.categories.map((c) => c.name).join(", ") || "Perfume")}</g:product_type>
      <g:gender>${gender(p)}</g:gender>
      <g:age_group>adult</g:age_group>
      <g:size>50 ml</g:size>
      <g:shipping>
        <g:country>PK</g:country>
        <g:service>Standard</g:service>
        <g:price>${SHIP_COST.toFixed(2)} PKR</g:price>
        <g:min_handling_time>1</g:min_handling_time>
        <g:max_handling_time>2</g:max_handling_time>
        <g:min_transit_time>1</g:min_transit_time>
        <g:max_transit_time>5</g:max_transit_time>
      </g:shipping>
    </item>`;
}

export async function GET() {
  const products: WCProduct[] = await wc
    .getProducts({ per_page: "100", status: "publish" })
    .catch(() => []);
  const items = products
    .filter((p) => p.catalog_visibility !== "hidden" && (p.price || p.regular_price))
    .map(item)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Mehr — Long-lasting perfumes, made in Karachi</title>
    <link>${SITE_URL}</link>
    <description>Mehr perfume catalogue for Google Merchant Center</description>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
