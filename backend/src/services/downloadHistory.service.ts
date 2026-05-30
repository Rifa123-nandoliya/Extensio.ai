import { v4 as uuidv4 } from "uuid";
import Download from "../models/download.model";
import { getProjectById } from "./project.service";

export interface RecordDownloadInput {
  userId: string;
  projectId: string;
  source?: "generate" | "redownload";
}

export const recordDownload = async ({
  userId,
  projectId,
  source = "redownload",
}: RecordDownloadInput) => {
  const project = await getProjectById(userId, projectId);
  if (!project) {
    return null;
  }

  return Download.create({
    downloadId: uuidv4(),
    userId,
    projectId,
    projectName: project.projectName,
    description: project.description,
    zipPath: project.zipPath || `temp/${projectId}.zip`,
    source,
  });
};

export const getDownloadHistory = async (userId: string, limit = 50) => {
  return Download.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const getDownloadAnalytics = async (userId: string) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalDownloads, downloadsThisMonth, recentDownloads, byProjectAgg, distinctProjects] =
    await Promise.all([
      Download.countDocuments({ userId }),
      Download.countDocuments({
        userId,
        createdAt: { $gte: startOfMonth },
      }),
      Download.find({ userId }).sort({ createdAt: -1 }).limit(5),
      Download.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: "$projectId",
            projectName: { $first: "$projectName" },
            count: { $sum: 1 },
            lastDownloadedAt: { $max: "$createdAt" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Download.distinct("projectId", { userId }),
    ]);

  const uniqueProjects = distinctProjects.length;

  const downloadCountsByProject = byProjectAgg.map((row) => ({
    projectId: row._id,
    projectName: row.projectName,
    count: row.count,
    lastDownloadedAt: row.lastDownloadedAt,
  }));

  return {
    totalDownloads,
    downloadsThisMonth,
    uniqueProjects,
    downloadCountsByProject,
    recentDownloads,
  };
};
