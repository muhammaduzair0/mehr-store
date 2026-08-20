"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="wrap" style={{ padding: "clamp(80px, 12vw, 160px) 0", textAlign: "center" }}>
      <p className="eyebrow">Something went wrong</p>
      <h1 className="h-xl" style={{ margin: "16px auto 14px", maxWidth: "20ch" }}>
        We hit a snag loading this page.
      </h1>
      <p className="lead muted" style={{ maxWidth: "44ch", marginInline: "auto" }}>
        Nothing was lost — your cart and account are unaffected. Try again, or head back home.
      </p>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 34 }}>
        <button className="btn btn-primary" onClick={() => unstable_retry()}>
          Try again
        </button>
        <Link className="btn btn-outline" href="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}
