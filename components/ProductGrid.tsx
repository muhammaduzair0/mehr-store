import { Product } from "@/lib/data";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  return (
    <div className={"grid-products" + (className ? " " + className : "")}>
      {products.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
