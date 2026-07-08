import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const metadata = { title: "Shop — Mehr" };

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopClient />
    </Suspense>
  );
}
