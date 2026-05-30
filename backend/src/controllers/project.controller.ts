import { Response } from "express";
import { AuthRequest } from "../types/express";
import {
  getAllProjects,
  getProjectById,
  deleteProject,
} from "../services/project.service";
import {
  shareProjectWithUser,
  unshareProject,
  updateProjectVisibility,
} from "../services/projectAccess.service";
import {
  listProjectVersions,
  getProjectVersion,
  restoreProjectVersion,
} from "../services/versionHistory.service";
import { recordUsageEvent } from "../services/usageTracking.service";

export const listProjects = async (req: AuthRequest, res: Response) => {
  const workspaceId =
    (req.headers["x-workspace-id"] as string) ||
    (req.query.workspaceId as string) ||
    null;

  const projects = await getAllProjects(req.user!.id, workspaceId);
  res.json({ success: true, projects });
};

export const getProject = async (req: AuthRequest, res: Response) => {
  const project = await getProjectById(req.user!.id, String(req.params.id));
  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }
  res.json({ success: true, project });
};

export const removeProject = async (req: AuthRequest, res: Response) => {
  await deleteProject(req.user!.id, String(req.params.id));
  res.json({ success: true, message: "Project deleted successfully" });
};

export const shareProject = async (req: AuthRequest, res: Response) => {
  const { email, role } = req.body ?? {};
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const share = await shareProjectWithUser(
    req.user!.id,
    String(req.params.id),
    email,
    role === "edit" ? "edit" : "view"
  );

  await recordUsageEvent({
    userId: req.user!.id,
    eventType: "project_share",
    metadata: { projectId: req.params.id, targetEmail: email },
  });

  res.json({ success: true, share });
};

export const unshareProjectHandler = async (req: AuthRequest, res: Response) => {
  await unshareProject(
    req.user!.id,
    String(req.params.id),
    String(req.params.userId)
  );
  res.json({ success: true, message: "Share removed" });
};

export const setVisibility = async (req: AuthRequest, res: Response) => {
  const { visibility, workspaceId } = req.body ?? {};
  const project = await updateProjectVisibility(
    req.user!.id,
    String(req.params.id),
    visibility,
    workspaceId
  );
  res.json({ success: true, project });
};

export const getVersions = async (req: AuthRequest, res: Response) => {
  const data = await listProjectVersions(req.user!.id, String(req.params.id));
  res.json({ success: true, ...data });
};

export const getVersion = async (req: AuthRequest, res: Response) => {
  const version = await getProjectVersion(
    req.user!.id,
    String(req.params.id),
    Number(req.params.versionNumber)
  );
  res.json({ success: true, version });
};

export const restoreVersion = async (req: AuthRequest, res: Response) => {
  const project = await restoreProjectVersion(
    req.user!.id,
    String(req.params.id),
    Number(req.params.versionNumber)
  );
  res.json({ success: true, project });
};
