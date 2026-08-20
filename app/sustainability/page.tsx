import Link from "next/link";

export const metadata = { title: "Sustainability — Mehr" };

export default function SustainabilityPage() {
  return (
    <main>
      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow">The House</p>
          <h1 className="h-xl">Made with less waste in mind</h1>
          <p className="lead" style={{ maxWidth: "48ch", marginTop: 14 }}>
            We won&apos;t claim to be a zero-impact brand — but here&apos;s what we actually do, plainly stated.
          </p>
        </div>
      </section>

      <section className="about-pillars">
        <div className="wrap">
          <div className="pillar-grid">
            <div className="pillar">
              <span className="serif-num">01</span>
              <h3 className="h-sm">Made to last</h3>
              <p className="muted">40% concentration means a little goes a long way — fewer bottles bought and shipped over time.</p>
            </div>
            <div className="pillar">
              <span className="serif-num">02</span>
              <h3 className="h-sm">Real glass, not plastic</h3>
              <p className="muted">Every bottle is weighted glass — heavier to hold, easier to recycle, and built to last.</p>
            </div>
            <div className="pillar">
              <span className="serif-num">03</span>
              <h3 className="h-sm">Traceable sourcing</h3>
              <p className="muted">Naturals and clean synthetics chosen deliberately, not for the lowest price.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section center">
        <div className="wrap">
          <p className="eyebrow">Read more</p>
          <h2 className="h-lg" style={{ margin: "16px auto 28px", maxWidth: "20ch" }}>
            The full story behind how we build a scent
          </h2>
          <Link className="btn btn-outline btn-lg" href="/about">
            Our Story
          </Link>
        </div>
      </section>
    </main>
  );
}
