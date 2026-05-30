import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import { AppError } from "../utils/AppError";
import { getMemberRole, hasWorkspaceRole } from "../services/workspace.service";
import { WorkspaceRole } from "../constants/workspaceRoles";

export const requireWorkspace =
  (minimumRole: WorkspaceRole = "viewer") =>
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      const workspaceId =
        (req.headers["x-workspace-id"] as string) ||
        req.params.workspaceId ||
        req.body?.workspaceId;

      if (!workspaceId) {
        throw new AppError("Workspace ID is required", 400);
      }

      if (!req.user) {
        throw new AppError("Authentication required", 401);
      }

      const role = await getMemberRole(workspaceId, req.user.id);
      if (!role) {
        throw new AppError("You are not a member of this workspace", 403);
      }

      if (!hasWorkspaceRole(role, minimumRole)) {
        throw new AppError("Insufficient workspace permissions", 403);
      }

      req.workspace = { workspaceId, role };
      next();
    } catch (error) {
      next(error);
    }
  };
