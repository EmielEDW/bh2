export function euro(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "";
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n);
}

export function sum(nums: (number | null | undefined)[]): number {
  return nums.reduce<number>((a, b) => a + (b ?? 0), 0);
}

// Kleine afrondingsverschillen toelaten bij de debet=credit-controle.
export function balanceert(debet: number, credit: number): boolean {
  return Math.abs(debet - credit) < 0.005;
}
