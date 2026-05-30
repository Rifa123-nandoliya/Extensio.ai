import crypto from "crypto";
import { UsageEventType } from "../constants/usageEvents";
import UsageEvent from "../models/usageEvent.model";

export const recordUsageEvent = async (input: {
  userId: string;
  eventType: UsageEventType;
  workspaceId?: string | null;
  metadata?: Record<string, unknown>;
}) => {
  return UsageEvent.create({
    userId: input.userId,
    workspaceId: input.workspaceId ?? null,
    eventType: input.eventType,
    metadata: input.metadata ?? {},
  });
};

export const getUserUsageSummary = async (
  userId: string,
  days = 30
) => {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const events = await UsageEvent.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: since },
      },
    },
    {
      $group: {
        _id: "$eventType",
        count: { $sum: 1 },
      },
    },
  ]);

  const byType = Object.fromEntries(
    events.map((row) => [row._id, row.count])
  );

  const daily = await UsageEvent.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: since },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    periodDays: days,
    totalEvents: events.reduce((sum, row) => sum + row.count, 0),
    byType,
    dailyActivity: daily.map((row) => ({
      date: row._id,
      count: row.count,
    })),
  };
};

export const getPlatformUsageSummary = async (days = 30) => {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [totals, byType, topUsers] = await Promise.all([
    UsageEvent.countDocuments({ createdAt: { $gte: since } }),
    UsageEvent.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$eventType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    UsageEvent.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ]);

  return {
    periodDays: days,
    totalEvents: totals,
    byType: Object.fromEntries(byType.map((row) => [row._id, row.count])),
    topUsers: topUsers.map((row) => ({
      userId: row._id,
      eventCount: row.count,
    })),
  };
};

export const generateReferralCode = (): string =>
  `ext_${crypto.randomBytes(4).toString("hex")}`;
