import Image from "next/image";
import Link from "next/link";
import { wp, featuredImage, stripHtml, type WPPost } from "@/lib/wordpress";

export const metadata = { title: "Journal — Mehr" };
export const revalidate = 300;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

async function getPosts(): Promise<WPPost[]> {
  try {
    return await wp.getPosts({ per_page: "12" });
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
          <p className="eyebrow">The journal</p>
          <h1 className="h-xl">Notes from the atelier</h1>
          <p className="lead" style={{ maxWidth: "48ch", marginTop: 14 }}>
            Stories on scent, sourcing, and the craft behind each bottle.
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
              return (
                <article className="blog-card" key={post.id}>
                  <Link className="blog-card-media" href={`/blog/${post.slug}`}>
                    {image ? (
                      <Image src={image} alt={post.title.rendered} fill style={{ objectFit: "cover" }} />
                    ) : (
                      <div className="ph" />
                    )}
                  </Link>
                  <p className="blog-card-date">{fmtDate(post.date)}</p>
                  <h2 className="blog-card-title">
                    <Link href={`/blog/${post.slug}`}>{post.title.rendered}</Link>
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
