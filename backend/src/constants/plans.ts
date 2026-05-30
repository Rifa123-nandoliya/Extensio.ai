export const FREE_DAILY_GENERATION_LIMIT = 5;

export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    generationsPerDay: FREE_DAILY_GENERATION_LIMIT,
    premiumTemplates: false,
    priorityGeneration: false,
  },
  pro: {
    id: "pro",
    name: "Pro",
    generationsPerDay: null,
    premiumTemplates: true,
    priorityGeneration: true,
  },
} as const;

export type SubscriptionPlan = "free" | "pro";
export type SubscriptionInterval = "monthly" | "yearly" | null;

export const isProPlan = (
  plan: string,
  status?: string | null
): boolean => {
  if (plan !== "pro") return false;
  if (!status) return true;
  return status === "active" || status === "trialing";
};
