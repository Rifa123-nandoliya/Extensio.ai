import { Response } from "express";
import { AuthRequest } from "../types/express";
import {
  listUserWorkspaces,
  createWorkspace,
  getWorkspaceById,
  updateWorkspace,
  listWorkspaceMembers,
  inviteWorkspaceMember,
  removeWorkspaceMember,
  setActiveWorkspace,
} from "../services/workspace.service";
import { getAllProjects } from "../services/project.service";

export const listWorkspaces = async (req: AuthRequest, res: Response) => {
  const workspaces = await listUserWorkspaces(req.user!.id);
  res.json({ success: true, workspaces });
};

export const createWorkspaceHandler = async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body ?? {};
  if (!name?.trim()) {
    return res.status(400).json({ success: false, message: "Name is required" });
  }

  const workspace = await createWorkspace(req.user!.id, name.trim(), {
    description,
  });

  res.status(201).json({ success: true, workspace });
};

export const getWorkspace = async (req: AuthRequest, res: Response) => {
  const { workspace, role } = await getWorkspaceById(
    String(req.params.workspaceId),
    req.user!.id
  );
  res.json({ success: true, workspace, role });
};

export const updateWorkspaceHandler = async (req: AuthRequest, res: Response) => {
  const workspace = await updateWorkspace(
    String(req.params.workspaceId),
    req.user!.id,
    req.body ?? {}
  );
  res.json({ success: true, workspace });
};

export const getMembers = async (req: AuthRequest, res: Response) => {
  const members = await listWorkspaceMembers(
    String(req.params.workspaceId),
    req.user!.id
  );
  res.json({ success: true, members });
};

export const inviteMember = async (req: AuthRequest, res: Response) => {
  const { email, role } = req.body ?? {};
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const member = await inviteWorkspaceMember(
    String(req.params.workspaceId),
    req.user!.id,
    email,
    role
  );

  res.status(201).json({ success: true, member });
};

export const removeMember = async (req: AuthRequest, res: Response) => {
  await removeWorkspaceMember(
    String(req.params.workspaceId),
    req.user!.id,
    String(req.params.userId)
  );
  res.json({ success: true, message: "Member removed" });
};

export const activateWorkspace = async (req: AuthRequest, res: Response) => {
  const result = await setActiveWorkspace(
    req.user!.id,
    String(req.params.workspaceId)
  );
  res.json({ success: true, ...result });
};

export const listWorkspaceProjects = async (req: AuthRequest, res: Response) => {
  const workspaceId = String(req.params.workspaceId);
  const projects = await getAllProjects(req.user!.id, workspaceId);
  res.json({ success: true, projects });
};
