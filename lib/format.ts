export function money(n: number): string {
  return "$" + Number(n).toFixed(0);
}
