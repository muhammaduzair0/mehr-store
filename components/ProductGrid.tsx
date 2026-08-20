import { WCProduct } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  className,
  showRank,
}: {
  products: WCProduct[];
  className?: string;
  /** Show a "No. 0X" rank badge on the first 5 cards, in list order. */
  showRank?: boolean;
}) {
  return (
    <div className={"grid-products" + (className ? " " + className : "")}>
      {products.map((p, i) => (
        <ProductCard key={p.id} p={p} rank={showRank && i < 5 ? i + 1 : undefined} />
      ))}
    </div>
  );
}