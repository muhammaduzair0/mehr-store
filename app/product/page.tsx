import { Suspense } from "react";
import ProductClient from "./ProductClient";

export const metadata = { title: "Product — Mehr" };

export default function ProductPage() {
  return (
    <Suspense fallback={null}>
      <ProductClient />
    </Suspense>
  );
}