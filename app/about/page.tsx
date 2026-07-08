import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Our Story — Mehr" };

export default function AboutPage() {
  return (
    <main>
      {/* hero */}
      <section className="about-hero wrap">
        <p className="eyebrow">Est. 2021 · Composed in cool light</p>
        <h1 className="display" style={{ margin: "20px 0 0", maxWidth: "16ch" }}>
          A scent should outlast the moment.
        </h1>
      </section>
      <div className="wrap">
        <div style={{ position: "relative", width: "100%", aspectRatio: "21/9" }}>
          <Image src="/whisper-campaign.png" alt="Atelier" fill style={{ objectFit: "cover" }} />
        </div>
      </div>

      {/* intro */}
      <section className="section">
        <div className="wrap about-intro">
          <p className="eyebrow">Our story</p>
          <p className="h-md" style={{ fontWeight: 300, maxWidth: "24ch", lineHeight: 1.25 }}>
            Mehr means <em style={{ fontStyle: "italic" }}>love</em>, and <em style={{ fontStyle: "italic" }}>light</em>.
          </p>
          <div className="about-intro-body lead flow" style={{ "--flow": "1.2em" } as React.CSSProperties}>
            <p>
              We started Mehr with a single frustration: the fragrances we loved disappeared by lunchtime. So we
              built scent the slow way — higher concentrations, fewer fillers, and raw materials chosen for how they
              evolve on skin over hours, not minutes.
            </p>
            <p>
              Every formula opens in the cool, clean light of morning and settles into something warmer by evening.
              The result is fragrance that becomes a memory — the part of you they remember long after you&apos;ve
              left the room.
            </p>
          </div>
        </div>
      </section>

      {/* pillars */}
      <section className="about-pillars">
        <div className="wrap">
          <div className="pillar-grid">
            <div className="pillar">
              <span className="serif-num">01</span>
              <h3 className="h-sm">Composed, not blended</h3>
              <p className="muted">
                Each scent is built note by note by our perfumer, then aged six weeks before it&apos;s ever bottled.
              </p>
            </div>
            <div className="pillar">
              <span className="serif-num">02</span>
              <h3 className="h-sm">30% concentration</h3>
              <p className="muted">A higher oil load than most eaux de parfum — for sillage and longevity you can actually feel.</p>
            </div>
            <div className="pillar">
              <span className="serif-num">03</span>
              <h3 className="h-sm">Responsibly sourced</h3>
              <p className="muted">Cruelty-free, with traceable naturals and clean synthetics. No animal testing, ever.</p>
            </div>
            <div className="pillar">
              <span className="serif-num">04</span>
              <h3 className="h-sm">Made to refill</h3>
              <p className="muted">Keep the weighted glass bottle and renew the scent — less packaging, the same ritual.</p>
            </div>
          </div>
        </div>
      </section>

      {/* split editorial */}
      <section className="section">
        <div className="wrap about-split">
          <div style={{ position: "relative", width: "100%", aspectRatio: "4/5" }}>
            <Image src="/whisper-campaign.png" alt="Ingredient detail" fill style={{ objectFit: "cover" }} />
          </div>
          <div className="about-split-copy">
            <p className="eyebrow">The materials</p>
            <h2 className="h-lg" style={{ margin: "16px 0 22px" }}>
              From field to flacon
            </h2>
            <p className="lead" style={{ maxWidth: "44ch" }}>
              Damask rose from Isparta. Oud distilled in small batches. Bergamot pressed in Calabria. We trace every
              material to its source and pay growers fairly — because a scent is only as honest as what goes into
              it.
            </p>
            <ul className="about-stats">
              <li>
                <span className="serif-num">24</span>
                <span>raw materials, on average, per scent</span>
              </li>
              <li>
                <span className="serif-num">6 wks</span>
                <span>maceration before bottling</span>
              </li>
              <li>
                <span className="serif-num">100%</span>
                <span>recyclable, refillable packaging</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* quote */}
      <section className="about-quote">
        <div className="wrap center">
          <p className="h-lg" style={{ fontWeight: 300, maxWidth: "22ch", marginInline: "auto", lineHeight: 1.2 }}>
            &ldquo;We don&apos;t make perfume to be noticed. We make it to be remembered.&rdquo;
          </p>
          <p className="eyebrow" style={{ marginTop: 28 }}>
            — Mehr Atelier
          </p>
        </div>
      </section>

      {/* cta */}
      <section className="section center">
        <div className="wrap">
          <p className="eyebrow">Find yours</p>
          <h2 className="h-xl" style={{ margin: "16px auto 28px", maxWidth: "16ch" }}>
            Discover the scent they&apos;ll remember
          </h2>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn btn-primary btn-lg" href="/shop">
              Shop the collection
            </Link>
            <Link className="btn btn-outline btn-lg" href="/product?id=discovery">
              Try the Discovery Set
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
