import { Response } from "express";
import { AuthRequest } from "../types/express";
import { getAdminOverview, listAdminUsers } from "../services/analytics.service";
import { getPlatformUsageSummary } from "../services/usageTracking.service";
import Referral from "../models/referral.model";

export const adminOverview = async (_req: AuthRequest, res: Response) => {
  const overview = await getAdminOverview();
  res.json({ success: true, overview });
};

export const adminUsers = async (req: AuthRequest, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const result = await listAdminUsers(page, limit);
  res.json({ success: true, ...result });
};

export const adminUsage = async (req: AuthRequest, res: Response) => {
  const days = req.query.days ? Number(req.query.days) : 30;
  const usage = await getPlatformUsageSummary(days);
  res.json({ success: true, usage });
};

export const adminReferrals = async (_req: AuthRequest, res: Response) => {
  const referrals = await Referral.find()
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ success: true, referrals });
};
