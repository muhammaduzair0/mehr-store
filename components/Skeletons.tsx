// Shared loading placeholders. Each one reuses the real layout's own CSS
// classes (.card, .bs-grid, .pdp, …) with a shimmering .skel block standing
// in for content — so the skeleton is already the right shape/size and
// nothing shifts once real content replaces it.

export function Skel({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={"skel " + className} style={style} />;
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid-products">
      {Array.from({ length: count }).map((_, i) => (
        <div className="card" key={i}>
          <div className="card-media">
            <div className="card-media-frame">
              <Skel className="skel-fill" />
            </div>
          </div>
          <Skel style={{ height: 14, width: "75%" }} />
          <Skel style={{ height: 11, width: "45%", marginTop: 8 }} />
          <Skel style={{ height: 11, width: "55%", marginTop: 8 }} />
          <Skel style={{ height: 17, width: "40%", marginTop: 10 }} />
        </div>
      ))}
    </div>
  );
}

export function PdpSkeleton() {
  return (
    <main>
      <div className="wrap" style={{ paddingBlock: "clamp(24px, 3vw, 40px)" }}>
        <div className="pdp">
          <div className="pdp-gallery">
            <div className="pdp-main">
              <Skel className="skel-fill" />
            </div>
            <div className="pdp-thumbs">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skel key={i} style={{ aspectRatio: "1/1" }} />
              ))}
            </div>
          </div>
          <div>
            <Skel style={{ height: 12, width: "30%" }} />
            <Skel style={{ height: 32, width: "70%", marginTop: 14 }} />
            <Skel style={{ height: 24, width: "35%", marginTop: 18 }} />
            <Skel style={{ height: 46, width: "100%", marginTop: 28 }} />
            <Skel style={{ height: 46, width: "100%", marginTop: 14 }} />
          </div>
        </div>
      </div>
    </main>
  );
}

export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="blog-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="blog-card" key={i}>
          <div className="blog-card-media">
            <Skel className="skel-fill" />
          </div>
          <Skel style={{ height: 11, width: "30%", marginTop: 14 }} />
          <Skel style={{ height: 20, width: "85%", marginTop: 10 }} />
          <Skel style={{ height: 14, width: "95%", marginTop: 10 }} />
          <Skel style={{ height: 14, width: "70%", marginTop: 6 }} />
        </div>
      ))}
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <main className="wrap blog-post">
      <Skel style={{ height: 12, width: 120, marginTop: 40 }} />
      <Skel style={{ height: 36, width: "60%", marginTop: 14 }} />
      <Skel style={{ height: 14, width: 100, marginTop: 10 }} />
      <div className="blog-post-media">
        <Skel className="skel-fill" />
      </div>
      <Skel style={{ height: 15, width: "100%", marginTop: 24 }} />
      <Skel style={{ height: 15, width: "96%", marginTop: 10 }} />
      <Skel style={{ height: 15, width: "88%", marginTop: 10 }} />
    </main>
  );
}

export function DiscoverSkeleton() {
  return (
    <section className="discover">
      <Skel style={{ height: 22, width: 320, margin: "0 auto" }} />
      <div className="dcv-viewport" style={{ marginTop: 44 }}>
        <div className="dcv-track">
          {Array.from({ length: 5 }).map((_, i) => (
            <div className="dcv-slide" key={i}>
              <div className="dcv-card">
                <div className="dcv-media">
                  <Skel className="skel-fill" />
                </div>
                <Skel style={{ height: 13, width: "70%" }} />
                <Skel style={{ height: 15, width: "45%", marginTop: 8 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CategoryShowcaseSkeleton() {
  return (
    <section className="cat-showcase">
      {Array.from({ length: 2 }).map((_, row) => (
        <div className="cat-row" key={row}>
          <div className="cat-tile-lg">
            <Skel className="skel-fill" style={{ borderRadius: 10 }} />
          </div>
          <div className="cat-tile-lg">
            <Skel className="skel-fill" style={{ borderRadius: 10 }} />
          </div>
        </div>
      ))}
    </section>
  );
}

export function BestSellersSkeleton() {
  return (
    <section className="section-sm bestsellers">
      <div className="wrap">
        <Skel style={{ height: 22, width: 260 }} />
        <div className="bs-grid" style={{ marginTop: 32 }}>
          <div className="bs-hero">
            <Skel className="skel-fill" />
          </div>
          <div className="bs-side">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="bs-tile" key={i} style={{ display: "flex", gap: 14 }}>
                <Skel style={{ width: 80, aspectRatio: "1/1", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <Skel style={{ height: 11, width: "40%" }} />
                  <Skel style={{ height: 15, width: "70%", marginTop: 8 }} />
                  <Skel style={{ height: 13, width: "30%", marginTop: 8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CollectionsSkeleton() {
  return (
    <main>
      <section className="coll-hero">
        <div className="wrap center">
          <Skel style={{ height: 12, width: 140, margin: "0 auto" }} />
          <Skel style={{ height: 34, width: 380, margin: "18px auto 0" }} />
          <Skel style={{ height: 15, width: 460, margin: "26px auto 0" }} />
        </div>
      </section>
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="wrap coll-grid" key={i} style={{ marginTop: 40 }}>
          <Skel style={{ aspectRatio: "1/1" }} />
          <div>
            <Skel style={{ height: 12, width: 120 }} />
            <Skel style={{ height: 28, width: 200, marginTop: 14 }} />
            <Skel style={{ height: 15, width: "90%", marginTop: 18 }} />
            <Skel style={{ height: 15, width: "70%", marginTop: 8 }} />
          </div>
        </div>
      ))}
    </main>
  );
}

export function OrderConfirmationSkeleton() {
  return (
    <main className="wrap cart-page">
      <section className="confirm">
        <Skel style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto" }} />
        <Skel style={{ height: 12, width: 130, margin: "20px auto 0" }} />
        <Skel style={{ height: 30, width: 340, margin: "16px auto 0" }} />
        <Skel style={{ height: 15, width: 300, margin: "18px auto 0" }} />
      </section>
    </main>
  );
}
