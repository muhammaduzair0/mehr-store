import { BlogGridSkeleton, Skel } from "@/components/Skeletons";

export default function Loading() {
  return (
    <main>
      <section className="shop-hero">
        <div className="wrap">
          <Skel style={{ height: 12, width: 100 }} />
          <Skel style={{ height: 34, width: 320, marginTop: 14 }} />
          <Skel style={{ height: 15, width: 420, marginTop: 18 }} />
        </div>
      </section>
      <div className="wrap" style={{ paddingBottom: 80 }}>
        <BlogGridSkeleton />
      </div>
    </main>
  );
}
