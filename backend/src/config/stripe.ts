import Stripe from "stripe";

let stripeClient: InstanceType<typeof Stripe> | null = null;

export const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
};

export const getStripeWebhookSecret = (): string => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error(
      "STRIPE_WEBHOOK_SECRET is not defined in environment variables"
    );
  }
  return secret;
};

export type BillingPlanKey = "pro_monthly" | "pro_yearly";

export const getPriceIdForPlan = (plan: BillingPlanKey): string => {
  const map: Record<BillingPlanKey, string | undefined> = {
    pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
  };

  const priceId = map[plan];
  if (!priceId) {
    throw new Error(
      `Stripe price ID for ${plan} is not configured. Set STRIPE_PRICE_PRO_MONTHLY / STRIPE_PRICE_PRO_YEARLY.`
    );
  }

  return priceId;
};

export const getFrontendUrl = (): string => {
  return process.env.FRONTEND_URL || "http://localhost:5173";
};

/** True when Checkout / Billing Portal can run (secret key + price IDs). */
export const isStripeCheckoutConfigured = (): boolean =>
  Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
      process.env.STRIPE_PRICE_PRO_MONTHLY?.trim() &&
      process.env.STRIPE_PRICE_PRO_YEARLY?.trim()
  );

/** True when webhook signature verification is configured. */
export const isStripeWebhookConfigured = (): boolean =>
  Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim());

export const assertStripeCheckoutConfigured = (): void => {
  if (!isStripeCheckoutConfigured()) {
    throw new Error(
      "Stripe is not configured. Set STRIPE_SECRET_KEY, STRIPE_PRICE_PRO_MONTHLY, and STRIPE_PRICE_PRO_YEARLY in backend/.env"
    );
  }
};
