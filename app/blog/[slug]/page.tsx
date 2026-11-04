import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  wp,
  featuredImage,
  stripHtml,
  decodeEntities,
  truncateText,
  buildBlogPostJsonLd,
  buildBlogBreadcrumbJsonLd,
  buildFaqJsonLd,
  type WPPost,
} from "@/lib/wordpress";

export const revalidate = 300;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Internal links between articles: newest other posts, preferring the same
// category. Cheap — one list request, already cached by revalidate.
async function getRelated(post: WPPost & { categories?: number[] }): Promise<WPPost[]> {
  try {
    const all = (await wp.getPosts({ per_page: "30" })) as (WPPost & { categories?: number[] })[];
    const others = all.filter((p) => p.id !== post.id);
    const cats = new Set(post.categories || []);
    const same = others.filter((p) => p.categories?.some((c) => cats.has(c)));
    return [...same, ...others.filter((p) => !same.includes(p))].slice(0, 4);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await wp.getPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Journal — Mehr" };

  const description = truncateText(stripHtml(post.excerpt.rendered));
  const title = decodeEntities(post.title.rendered);
  const image = featuredImage(post);
  // Google shows ~60 chars — only add the brand suffix when it still fits.
  const seoTitle = title.length <= 52 ? `${title} | Mehr` : title;

  return {
    title: seoTitle,
    description: description || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description: description || undefined,
      siteName: "Mehr",
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.modified || post.date,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || undefined,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await wp.getPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  const image = featuredImage(post);
  const title = decodeEntities(post.title.rendered);
  const faqJsonLd = buildFaqJsonLd(post.content.rendered);
  const related = await getRelated(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBlogPostJsonLd(post)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBlogBreadcrumbJsonLd(post)) }}
      />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <main className="wrap blog-post">
        <p className="eyebrow" style={{ marginTop: 40 }}>
          <Link className="ulink" href="/blog">The journal</Link>
        </p>
        <h1 className="h-xl" style={{ margin: "14px 0 10px", maxWidth: "22ch" }}>{title}</h1>
        <p className="muted">{fmtDate(post.date)}</p>

        {image && (
          <div className="blog-post-media">
            <Image src={image} alt={title} fill style={{ objectFit: "contain" }} priority />
          </div>
        )}

        <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

        <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn btn-outline" href="/blog">← Back to the journal</Link>
          <Link className="btn btn-outline" href="/shop">Shop the collection</Link>
          <Link className="btn btn-outline" href="/inspired-by">Designer impressions</Link>
        </div>

        {related.length > 0 && (
          <section className="blog-related">
            <h2 className="h-md" style={{ fontWeight: 300 }}>Keep reading</h2>
            <ul>
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/blog/${r.slug}`}>{decodeEntities(r.title.rendered)}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
