import Link from "next/link";

export const metadata = { title: "Find Your Scent — Mehr" };

const GUIDE = [
  {
    title: "Want something that feels unmistakably you, no gendered aisles",
    label: "Unisex",
    href: "/shop?category=unisex",
  },
  {
    title: "Bold, magnetic, built on woods and spice",
    label: "For Him",
    href: "/shop?category=for-him",
  },
  {
    title: "Florals softened with warmth and a little audacity",
    label: "For Her",
    href: "/shop?category=for-her",
  },
  {
    title: "Not sure yet — see what everyone reaches for first",
    label: "Best Sellers",
    href: "/shop?featured=true",
  },
];

export default function FindYourScentPage() {
  return (
    <main>
      <section className="shop-hero">
        <div className="wrap">
          <p className="eyebrow">A place to start</p>
          <h1 className="h-xl">Find your scent</h1>
          <p className="lead" style={{ maxWidth: "48ch", marginTop: 14 }}>
            No quiz, no algorithm — just a few honest starting points. Every listing has full notes so you can read
            before you buy.
          </p>
        </div>
      </section>

      <div className="wrap" style={{ paddingBlock: "clamp(36px, 4.5vw, 60px) clamp(64px, 8vw, 108px)" }}>
        <div className="guide-list">
          {GUIDE.map((g) => (
            <Link key={g.href} href={g.href} className="guide-row">
              <span className="h-sm" style={{ fontWeight: 400 }}>{g.title}</span>
              <span className="btn btn-outline">{g.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
