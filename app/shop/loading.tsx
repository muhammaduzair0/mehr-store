import { ProductGridSkeleton, Skel } from "@/components/Skeletons";

export default function Loading() {
  return (
    <main>
      <section className="shop-hero">
        <div className="wrap">
          <Skel style={{ height: 12, width: 100 }} />
          <Skel style={{ height: 34, width: 260, marginTop: 14 }} />
        </div>
      </section>
      <div className="wrap" style={{ paddingBottom: 80 }}>
        <ProductGridSkeleton count={12} />
      </div>
    </main>
  );
}
