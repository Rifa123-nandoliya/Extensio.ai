import { Response } from "express";
import { AuthRequest } from "../types/express";
import { BillingPlanKey, assertStripeCheckoutConfigured } from "../config/stripe";
import { AppError } from "../utils/AppError";import { getBillingOverview } from "../services/billing.service";
import {
  createCheckoutSession,
  createBillingPortalSession,
  cancelSubscription,
  resumeSubscription,
  changeSubscriptionPlan,
} from "../services/stripe.service";

const parsePlan = (value: unknown): BillingPlanKey | null => {
  if (value === "pro_monthly" || value === "pro_yearly") {
    return value;
  }
  return null;
};

export const getBilling = async (req: AuthRequest, res: Response) => {
  const overview = await getBillingOverview(req.user!.id);
  res.status(200).json({ success: true, billing: overview });
};

export const checkout = async (req: AuthRequest, res: Response) => {
  try {
    assertStripeCheckoutConfigured();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Stripe is not configured";
    throw new AppError(message, 503);
  }

  const plan = parsePlan(req.body?.plan);  if (!plan) {
    return res.status(400).json({
      success: false,
      message: "Invalid plan. Use pro_monthly or pro_yearly.",
    });
  }

  const session = await createCheckoutSession(req.user!.id, plan);
  res.status(200).json({ success: true, ...session });
};

export const billingPortal = async (req: AuthRequest, res: Response) => {
  try {
    assertStripeCheckoutConfigured();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Stripe is not configured";
    throw new AppError(message, 503);
  }

  const session = await createBillingPortalSession(req.user!.id);  res.status(200).json({ success: true, ...session });
};

export const cancel = async (req: AuthRequest, res: Response) => {
  const result = await cancelSubscription(req.user!.id);
  res.status(200).json({ success: true, ...result });
};

export const resume = async (req: AuthRequest, res: Response) => {
  const result = await resumeSubscription(req.user!.id);
  res.status(200).json({ success: true, ...result });
};

export const changePlan = async (req: AuthRequest, res: Response) => {
  const plan = parsePlan(req.body?.plan);
  if (!plan) {
    return res.status(400).json({
      success: false,
      message: "Invalid plan. Use pro_monthly or pro_yearly.",
    });
  }

  const result = await changeSubscriptionPlan(req.user!.id, plan);
  res.status(200).json({
    success: true,
    message: "Subscription plan updated",
    interval: result.interval,
  });
};
