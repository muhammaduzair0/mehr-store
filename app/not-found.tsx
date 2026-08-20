import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap" style={{ padding: "clamp(80px, 12vw, 160px) 0", textAlign: "center" }}>
      <p className="eyebrow">404</p>
      <h1 className="h-xl" style={{ margin: "16px auto 14px", maxWidth: "20ch" }}>
        This page has wandered off.
      </h1>
      <p className="lead muted" style={{ maxWidth: "44ch", marginInline: "auto" }}>
        The page you&apos;re looking for doesn&apos;t exist, or has moved.
      </p>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 34 }}>
        <Link className="btn btn-primary" href="/shop">
          Shop the collection
        </Link>
        <Link className="btn btn-outline" href="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}
