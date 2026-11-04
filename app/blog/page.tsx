import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { wp, featuredImage, stripHtml, decodeEntities, type WPPost } from "@/lib/wordpress";

const DESCRIPTION =
  "Mehr perfume blog — designer perfume impressions, long-lasting perfume guides for Karachi's heat, gift ideas and perfume prices in Pakistan.";

export const metadata: Metadata = {
  title: "Perfume Blog Pakistan — Guides & Impressions | Mehr",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: { title: "The Mehr Journal", description: DESCRIPTION, siteName: "Mehr", type: "website", url: "/blog" },
};
export const revalidate = 300;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

async function getPosts(): Promise<WPPost[]> {
  try {
    return await wp.getPosts({ per_page: "30" });
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main>
      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow">The Mehr journal</p>
          <h1 className="h-xl">Perfume guides &amp; designer impressions</h1>
          <p className="lead" style={{ maxWidth: "56ch", marginTop: 14 }}>
            Long-lasting perfume guides for Pakistan&apos;s heat, the designer scents behind every Mehr perfume, and
            gift ideas — from our Karachi atelier.
          </p>
        </div>
      </section>

      <div className="wrap" style={{ paddingBottom: 80 }}>
        {posts.length === 0 ? (
          <div className="no-results">
            <p className="h-md" style={{ fontWeight: 300 }}>No stories yet — check back soon.</p>
            <p className="muted" style={{ margin: "10px 0 22px" }}>
              In the meantime, explore the collection.
            </p>
            <Link className="btn btn-outline" href="/shop">Shop the collection</Link>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => {
              const image = featuredImage(post);
              const title = decodeEntities(post.title.rendered);
              return (
                <article className="blog-card" key={post.id}>
                  <Link className="blog-card-media" href={`/blog/${post.slug}`}>
                    {image ? (
                      <Image src={image} alt={title} fill style={{ objectFit: "contain" }} />
                    ) : (
                      <div className="ph" />
                    )}
                  </Link>
                  <p className="blog-card-date">{fmtDate(post.date)}</p>
                  <h2 className="blog-card-title">
                    <Link href={`/blog/${post.slug}`}>{title}</Link>
                  </h2>
                  <p className="blog-card-excerpt">{stripHtml(post.excerpt.rendered).slice(0, 140)}</p>
                  <Link className="ulink" href={`/blog/${post.slug}`}>Read more</Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
