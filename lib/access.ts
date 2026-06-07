// Gedeelde toegangs-/paywall-configuratie.
//
// Gratis (zonder code): thema 1-3 (samenvatting + oefeningen), de rekenmachine
// en de examen-tab. De rest is afgeschermd tot je de pack ontgrendelt met een code.

export const FREE_THEMES = ["grondbeginselen", "btw", "aankoop-verkoop"];

export function isFreeTheme(slug: string): boolean {
  return FREE_THEMES.includes(slug);
}

// Stripe-betaallink (publieke env var, mag client-side). Stel in op Vercel.
export const STRIPE_LINK =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || "https://buy.stripe.com/";

// Prijs (enkel voor weergave op de salespagina).
export const PRIJS = process.env.NEXT_PUBLIC_PRIJS || "€15";

export const MAX_DEVICES = 2;
