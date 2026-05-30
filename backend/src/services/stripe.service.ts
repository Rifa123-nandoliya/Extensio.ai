import User from "../models/user.model";
import { AppError } from "../utils/AppError";
import {
  getStripe,
  getPriceIdForPlan,
  getFrontendUrl,
  BillingPlanKey,
} from "../config/stripe";
import { SubscriptionInterval } from "../constants/plans";

export const getOrCreateStripeCustomer = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.stripeCustomerId) {
    return { user, customerId: user.stripeCustomerId };
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: { userId: user._id.toString() },
  });

  user.stripeCustomerId = customer.id;
  await user.save();

  return { user, customerId: customer.id };
};

export const createCheckoutSession = async (
  userId: string,
  plan: BillingPlanKey
) => {
  const { customerId } = await getOrCreateStripeCustomer(userId);
  const stripe = getStripe();
  const priceId = getPriceIdForPlan(plan);
  const frontendUrl = getFrontendUrl();

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${frontendUrl}/billing?checkout=success`,
    cancel_url: `${frontendUrl}/billing?checkout=canceled`,
    metadata: {
      userId,
      plan,
    },
    subscription_data: {
      metadata: {
        userId,
        plan,
      },
    },
  });

  if (!session.url) {
    throw new AppError("Failed to create checkout session", 500);
  }

  return { url: session.url, sessionId: session.id };
};

export const createBillingPortalSession = async (userId: string) => {
  const { customerId } = await getOrCreateStripeCustomer(userId);
  const stripe = getStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${getFrontendUrl()}/billing`,
  });

  return { url: session.url };
};

export const cancelSubscription = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user?.stripeSubscriptionId) {
    throw new AppError("No active subscription found", 404);
  }

  const stripe = getStripe();
  const subscription = await stripe.subscriptions.update(
    user.stripeSubscriptionId,
    { cancel_at_period_end: true }
  );

  return {
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd:
      subscription.items?.data?.[0]?.current_period_end ?? null,
  };
};

export const resumeSubscription = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user?.stripeSubscriptionId) {
    throw new AppError("No subscription found", 404);
  }

  const stripe = getStripe();
  const subscription = await stripe.subscriptions.update(
    user.stripeSubscriptionId,
    { cancel_at_period_end: false }
  );

  user.subscriptionStatus = mapStripeStatus(subscription.status);
  await user.save();

  return { status: subscription.status };
};

export const changeSubscriptionPlan = async (
  userId: string,
  plan: BillingPlanKey
) => {
  const user = await User.findById(userId);
  if (!user?.stripeSubscriptionId) {
    throw new AppError("No active subscription. Use checkout to subscribe.", 404);
  }

  const stripe = getStripe();
  const priceId = getPriceIdForPlan(plan);
  const subscription = await stripe.subscriptions.retrieve(
    user.stripeSubscriptionId
  );

  const itemId = subscription.items.data[0]?.id;
  if (!itemId) {
    throw new AppError("Subscription item not found", 500);
  }

  const updated = await stripe.subscriptions.update(user.stripeSubscriptionId, {
    items: [{ id: itemId, price: priceId }],
    proration_behavior: "create_prorations",
    metadata: { userId, plan },
  });

  const interval: SubscriptionInterval =
    plan === "pro_yearly" ? "yearly" : "monthly";

  user.subscriptionPlan = "pro";
  user.subscriptionInterval = interval;
  user.subscriptionStatus = mapStripeStatus(updated.status);
  await user.save();

  return { subscription: updated, interval };
};

export const syncSubscriptionFromStripe = async (
  stripeSubscriptionId: string
) => {
  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(
    stripeSubscriptionId
  );

  const userId =
    subscription.metadata?.userId ||
    (await findUserIdByCustomer(subscription.customer as string));

  if (!userId) {
    console.warn("No user for subscription", stripeSubscriptionId);
    return null;
  }

  const user = await User.findById(userId);
  if (!user) return null;

  const priceId = subscription.items.data[0]?.price?.id;
  const interval = resolveInterval(priceId, subscription.metadata?.plan);

  const activeStatuses = ["active", "trialing"];
  if (activeStatuses.includes(subscription.status)) {
    user.subscriptionPlan = "pro";
    user.subscriptionInterval = interval;
    user.subscriptionStatus =
      subscription.status === "trialing" ? "trialing" : "active";
    user.stripeSubscriptionId = subscription.id;
    user.stripeCustomerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
  } else if (
    subscription.status === "canceled" ||
    subscription.status === "unpaid"
  ) {
    user.subscriptionPlan = "free";
    user.subscriptionInterval = null;
    user.subscriptionStatus = "canceled";
    user.stripeSubscriptionId = null;
  } else {
    user.subscriptionStatus = mapStripeStatus(subscription.status);
  }

  await user.save();
  return user;
};

const findUserIdByCustomer = async (customerId: string) => {
  const user = await User.findOne({ stripeCustomerId: customerId });
  return user?._id.toString();
};

const resolveInterval = (
  priceId: string | undefined,
  planMeta?: string
): SubscriptionInterval => {
  if (planMeta === "pro_yearly") return "yearly";
  if (planMeta === "pro_monthly") return "monthly";

  const yearlyPrice = process.env.STRIPE_PRICE_PRO_YEARLY;
  const monthlyPrice = process.env.STRIPE_PRICE_PRO_MONTHLY;

  if (priceId && yearlyPrice && priceId === yearlyPrice) return "yearly";
  if (priceId && monthlyPrice && priceId === monthlyPrice) return "monthly";

  return "monthly";
};

const mapStripeStatus = (
  status: string
): "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "inactive" => {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
      return "canceled";
    case "incomplete":
    case "incomplete_expired":
      return "incomplete";
    case "paused":
      return "inactive";
    default:
      return "inactive";
  }
};

export const downgradeUserToFree = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return null;

  user.subscriptionPlan = "free";
  user.subscriptionInterval = null;
  user.subscriptionStatus = "inactive";
  user.stripeSubscriptionId = null;
  await user.save();
  return user;
};
