export function money(n: number | string): string {
  const num = parseFloat(String(n));
  if (isNaN(num)) return "Rs —";
  return "Rs " + num.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}