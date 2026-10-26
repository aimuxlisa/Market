import Stripe from "stripe";

// Initialize official Stripe client
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export const stripe = stripeSecretKey.startsWith("sk_") && !stripeSecretKey.includes("mock")
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
      typescript: true,
    })
  : null;

/**
 * Check if Stripe is enabled in configuration
 */
export function isStripeEnabled(): boolean {
  return process.env.ENABLE_STRIPE === "true";
}

export function isMockStripeMode(): boolean {
  return !stripeSecretKey || stripeSecretKey.includes("mock") || !stripeSecretKey.startsWith("sk_");
}

/**
 * Convert local currency amount to smallest Stripe currency unit
 * For UZS: zero-decimal or cents depending on Stripe rules (in Stripe, UZS is 2 decimals, standard * 100)
 */
export function formatAmountForStripe(amount: number, currency: string = "uzs"): number {
  const zeroDecimalCurrencies = ["bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf"];
  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    return Math.round(amount);
  }
  return Math.round(amount * 100);
}
