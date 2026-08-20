export function money(n: number | string): string {
  const num = parseFloat(String(n));
  if (isNaN(num)) return "Rs —";
  return "Rs " + num.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/** Percent off, rounded, from a regular/sale price pair — null if there's no real discount. */
export function discountPercent(regular: number | string, sale: number | string): number | null {
  const r = parseFloat(String(regular));
  const s = parseFloat(String(sale));
  if (!r || !s || s >= r) return null;
  return Math.round((1 - s / r) * 100);
}