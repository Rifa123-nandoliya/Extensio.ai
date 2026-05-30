import User from "../models/user.model";
import Project from "../models/project.model";
import Template from "../models/template.model";
import Download from "../models/download.model";
import Referral from "../models/referral.model";
import Workspace from "../models/workspace.model";
import { getUserUsageSummary, getPlatformUsageSummary } from "./usageTracking.service";
import { getGenerationUsage } from "./usage.service";
import { getDownloadAnalytics } from "./downloadHistory.service";

export const getUserAnalytics = async (userId: string) => {
  const [usage, generation, downloads, projectCount, templateCount, referralCount] =
    await Promise.all([
      getUserUsageSummary(userId, 30),
      getGenerationUsage(userId),
      getDownloadAnalytics(userId),
      Project.countDocuments({ $or: [{ userId }, { createdBy: userId }] }),
      Template.countDocuments({ userId }),
      Referral.countDocuments({ referrerId: userId }),
    ]);

  return {
    usage,
    generation,
    downloads,
    totals: {
      projects: projectCount,
      templates: templateCount,
      referrals: referralCount,
    },
  };
};

export const getAdminOverview = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    newUsers,
    totalProjects,
    totalDownloads,
    publicTemplates,
    totalWorkspaces,
    totalReferrals,
    proUsers,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Project.countDocuments(),
    Download.countDocuments(),
    Template.countDocuments({ isPublic: true }),
    Workspace.countDocuments(),
    Referral.countDocuments(),
    User.countDocuments({ subscriptionPlan: "pro" }),
  ]);

  const platformUsage = await getPlatformUsageSummary(30);

  return {
    users: { total: totalUsers, newLast30Days: newUsers, pro: proUsers },
    projects: { total: totalProjects },
    downloads: { total: totalDownloads },
    templates: { publicMarketplace: publicTemplates },
    workspaces: { total: totalWorkspaces },
    referrals: { total: totalReferrals },
    usage: platformUsage,
  };
};

export const listAdminUsers = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find()
      .select("name email role subscriptionPlan subscriptionStatus createdAt referralCode")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(),
  ]);

  return {
    users: users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      subscriptionPlan: u.subscriptionPlan,
      subscriptionStatus: u.subscriptionStatus,
      referralCode: u.referralCode,
      createdAt: u.createdAt,
    })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};
