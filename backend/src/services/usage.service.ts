import User from "../models/user.model";
import { FREE_DAILY_GENERATION_LIMIT, isProPlan } from "../constants/plans";
import { AppError } from "../utils/AppError";

const todayKey = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const getGenerationUsage = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isPro = isProPlan(user.subscriptionPlan, user.subscriptionStatus);
  const today = todayKey();
  const count =
    user.generationUsageDate === today ? user.generationUsageCount : 0;

  return {
    isPro,
    count,
    limit: isPro ? null : FREE_DAILY_GENERATION_LIMIT,
    remaining: isPro ? null : Math.max(0, FREE_DAILY_GENERATION_LIMIT - count),
  };
};

export const assertCanGenerate = async (userId: string) => {
  const usage = await getGenerationUsage(userId);

  if (usage.isPro) {
    return usage;
  }

  if (usage.count >= FREE_DAILY_GENERATION_LIMIT) {
    throw new AppError(
      `Daily generation limit reached (${FREE_DAILY_GENERATION_LIMIT}/day). Upgrade to Pro for unlimited generations.`,
      403
    );
  }

  return usage;
};

export const incrementGenerationUsage = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return;

  if (isProPlan(user.subscriptionPlan, user.subscriptionStatus)) {
    return;
  }

  const today = todayKey();
  if (user.generationUsageDate !== today) {
    user.generationUsageDate = today;
    user.generationUsageCount = 1;
  } else {
    user.generationUsageCount += 1;
  }

  await user.save();
};
