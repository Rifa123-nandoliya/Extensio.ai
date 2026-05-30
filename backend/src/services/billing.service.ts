import User from "../models/user.model";
import { AppError } from "../utils/AppError";
import { PLANS } from "../constants/plans";
import { getGenerationUsage } from "./usage.service";
import {
  getStripe,
  isStripeCheckoutConfigured,
  isStripeWebhookConfigured,
} from "../config/stripe";

export const getBillingOverview = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const usage = await getGenerationUsage(userId);
  const planKey = user.subscriptionPlan === "pro" ? "pro" : "free";
  const plan = PLANS[planKey];

  let currentPeriodEnd: number | null = null;
  let cancelAtPeriodEnd = false;

  if (user.stripeSubscriptionId && isStripeCheckoutConfigured()) {
    try {
      const stripe = getStripe();
      const sub = await stripe.subscriptions.retrieve(
        user.stripeSubscriptionId
      );
      currentPeriodEnd =
        sub.items?.data?.[0]?.current_period_end ?? null;
      cancelAtPeriodEnd = sub.cancel_at_period_end;
    } catch {
      // subscription may be stale
    }
  }

  return {
    subscriptionPlan: user.subscriptionPlan,
    subscriptionInterval: user.subscriptionInterval,
    subscriptionStatus: user.subscriptionStatus,
    stripeCustomerId: user.stripeCustomerId,
    hasSubscription: Boolean(user.stripeSubscriptionId),
    cancelAtPeriodEnd,
    currentPeriodEnd,
    usage: {
      generationsToday: usage.count,
      dailyLimit: usage.limit,
      remaining: usage.remaining,
    },
    features: plan,
    plans: {
      free: PLANS.free,
      pro: PLANS.pro,
    },
    stripe: {
      checkoutConfigured: isStripeCheckoutConfigured(),
      webhookConfigured: isStripeWebhookConfigured(),
    },
  };
};
