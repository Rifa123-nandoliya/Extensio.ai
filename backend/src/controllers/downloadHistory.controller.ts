import { Response } from "express";
import { AuthRequest } from "../types/express";
import {
  getDownloadHistory,
  getDownloadAnalytics,
} from "../services/downloadHistory.service";

export const listDownloadHistory = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user!.id;
  const limit =
    typeof req.query.limit === "string"
      ? Math.min(parseInt(req.query.limit, 10) || 50, 100)
      : 50;

  const downloads = await getDownloadHistory(userId, limit);

  res.status(200).json({
    success: true,
    downloads,
  });
};

export const getDownloadsAnalytics = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user!.id;
  const analytics = await getDownloadAnalytics(userId);

  res.status(200).json({
    success: true,
    analytics,
  });
};
