import { Response } from "express";
import fs from "fs";
import { AuthRequest } from "../types/express";
import { getZipPath } from "../utils/paths";
import { getProjectById } from "../services/project.service";
import { recordDownload } from "../services/downloadHistory.service";
import { recordUsageEvent } from "../services/usageTracking.service";

export const downloadProjectZip = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const projectId = String(req.params.projectId);

  const project = await getProjectById(userId, projectId);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  const zipPath = getZipPath(projectId);

  if (!fs.existsSync(zipPath)) {
    return res.status(404).json({
      success: false,
      message: "ZIP file not found",
    });
  }

  const source =
    req.query.source === "generate" ? "generate" : "redownload";

  await recordDownload({ userId, projectId, source });

  await recordUsageEvent({
    userId,
    workspaceId: project.workspaceId ?? null,
    eventType: "download",
    metadata: { projectId, source },
  });

  res.download(zipPath, `${project.projectName || "extension"}.zip`);
};
