import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const metadata = { title: "Search — Mehr", robots: { index: false, follow: true } };

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchClient />
    </Suspense>
  );
}
