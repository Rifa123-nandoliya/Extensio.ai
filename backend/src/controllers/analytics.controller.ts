import { Response } from "express";
import { AuthRequest } from "../types/express";
import { getUserAnalytics } from "../services/analytics.service";
import { getUserUsageSummary } from "../services/usageTracking.service";
import { getReferralStats } from "../services/referral.service";

export const getMyAnalytics = async (req: AuthRequest, res: Response) => {
  const analytics = await getUserAnalytics(req.user!.id);
  res.json({ success: true, analytics });
};

export const getMyUsage = async (req: AuthRequest, res: Response) => {
  const days = req.query.days ? Number(req.query.days) : 30;
  const usage = await getUserUsageSummary(req.user!.id, days);
  res.json({ success: true, usage });
};

export const getMyReferrals = async (req: AuthRequest, res: Response) => {
  const referrals = await getReferralStats(req.user!.id);
  res.json({ success: true, referrals });
};
