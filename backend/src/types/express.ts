import { Request } from "express";
import { SafeUser } from "../services/auth.service";
import { WorkspaceRole } from "../constants/workspaceRoles";

export interface AuthRequest extends Request {
  user?: SafeUser;
  workspace?: {
    workspaceId: string;
    role: WorkspaceRole;
  };
}
