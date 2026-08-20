import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { wp, featuredImage, stripHtml } from "@/lib/wordpress";

export const revalidate = 300;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await wp.getPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Journal — Mehr" };

  const description = stripHtml(post.excerpt.rendered).slice(0, 160);
  const image = featuredImage(post);

  return {
    title: `${post.title.rendered} — Mehr Journal`,
    description: description || undefined,
    openGraph: {
      title: post.title.rendered,
      description: description || undefined,
      siteName: "Mehr",
      type: "article",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title.rendered,
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

  return (
    <main className="wrap blog-post">
      <p className="eyebrow" style={{ marginTop: 40 }}>
        <Link className="ulink" href="/blog">The journal</Link>
      </p>
      <h1 className="h-xl" style={{ margin: "14px 0 10px", maxWidth: "22ch" }}>{post.title.rendered}</h1>
      <p className="muted">{fmtDate(post.date)}</p>

      {image && (
        <div className="blog-post-media">
          <Image src={image} alt={post.title.rendered} fill style={{ objectFit: "cover" }} priority />
        </div>
      )}

      <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

      <div style={{ marginTop: 48 }}>
        <Link className="btn btn-outline" href="/blog">← Back to the journal</Link>
      </div>
    </main>
  );
}
