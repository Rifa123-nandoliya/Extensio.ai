import { v4 as uuidv4 } from "uuid";
import Workspace from "../models/workspace.model";
import WorkspaceMember from "../models/workspaceMember.model";
import User from "../models/user.model";
import { AppError } from "../utils/AppError";
import {
  WorkspaceRole,
  hasWorkspaceRole,
} from "../constants/workspaceRoles";

export { hasWorkspaceRole };

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

const uniqueSlug = async (base: string) => {
  let slug = base;
  let attempt = 0;
  while (await Workspace.exists({ slug })) {
    attempt += 1;
    slug = `${base}-${attempt}`;
  }
  return slug;
};

export const createWorkspace = async (
  ownerId: string,
  name: string,
  options?: { isPersonal?: boolean; description?: string }
) => {
  const workspaceId = uuidv4();
  const slug = await uniqueSlug(slugify(name) || "workspace");

  const workspace = await Workspace.create({
    workspaceId,
    name,
    slug,
    ownerId,
    description: options?.description ?? "",
    isPersonal: options?.isPersonal ?? false,
  });

  await WorkspaceMember.create({
    workspaceId,
    userId: ownerId,
    role: "owner",
  });

  return workspace;
};

export const createPersonalWorkspace = async (
  userId: string,
  userName: string
) => {
  const workspace = await createWorkspace(
    userId,
    `${userName.split(" ")[0]}'s Workspace`,
    { isPersonal: true, description: "Personal workspace" }
  );

  await User.findByIdAndUpdate(userId, {
    activeWorkspaceId: workspace.workspaceId,
  });

  return workspace;
};

export const getMemberRole = async (
  workspaceId: string,
  userId: string
): Promise<WorkspaceRole | null> => {
  const member = await WorkspaceMember.findOne({ workspaceId, userId });
  return (member?.role as WorkspaceRole) ?? null;
};

export const listUserWorkspaces = async (userId: string) => {
  const memberships = await WorkspaceMember.find({ userId }).sort({
    joinedAt: 1,
  });

  const workspaceIds = memberships.map((m) => m.workspaceId);
  const workspaces = await Workspace.find({
    workspaceId: { $in: workspaceIds },
  });

  const workspaceMap = new Map(
    workspaces.map((w) => [w.workspaceId, w])
  );

  return memberships
    .map((m) => {
      const workspace = workspaceMap.get(m.workspaceId);
      if (!workspace) return null;
      return {
        workspaceId: workspace.workspaceId,
        name: workspace.name,
        slug: workspace.slug,
        description: workspace.description,
        isPersonal: workspace.isPersonal,
        role: m.role,
        ownerId: workspace.ownerId,
        createdAt: workspace.createdAt,
      };
    })
    .filter(Boolean);
};

export const getWorkspaceById = async (
  workspaceId: string,
  userId: string
) => {
  const role = await getMemberRole(workspaceId, userId);
  if (!role) {
    throw new AppError("Workspace not found", 404);
  }

  const workspace = await Workspace.findOne({ workspaceId });
  if (!workspace) {
    throw new AppError("Workspace not found", 404);
  }

  return { workspace, role };
};

export const updateWorkspace = async (
  workspaceId: string,
  userId: string,
  updates: { name?: string; description?: string }
) => {
  const role = await getMemberRole(workspaceId, userId);
  if (!role || !hasWorkspaceRole(role, "admin")) {
    throw new AppError("Insufficient permissions", 403);
  }

  const workspace = await Workspace.findOneAndUpdate(
    { workspaceId },
    {
      ...(updates.name ? { name: updates.name } : {}),
      ...(updates.description !== undefined
        ? { description: updates.description }
        : {}),
    },
    { new: true }
  );

  if (!workspace) {
    throw new AppError("Workspace not found", 404);
  }

  return workspace;
};

export const listWorkspaceMembers = async (
  workspaceId: string,
  userId: string
) => {
  const role = await getMemberRole(workspaceId, userId);
  if (!role) {
    throw new AppError("Workspace not found", 404);
  }

  const members = await WorkspaceMember.find({ workspaceId });
  const userIds = members.map((m) => m.userId);
  const users = await User.find({ _id: { $in: userIds } }).select(
    "name email"
  );

  const userMap = new Map(users.map((u) => [u._id.toString(), u]));

  return members.map((m) => ({
    userId: m.userId,
    role: m.role,
    joinedAt: m.joinedAt,
    name: userMap.get(m.userId)?.name ?? "Unknown",
    email: userMap.get(m.userId)?.email ?? "",
  }));
};

export const inviteWorkspaceMember = async (
  workspaceId: string,
  actorId: string,
  email: string,
  role: WorkspaceRole = "member"
) => {
  const actorRole = await getMemberRole(workspaceId, actorId);
  if (!actorRole || !hasWorkspaceRole(actorRole, "admin")) {
    throw new AppError("Insufficient permissions", 403);
  }

  if (role === "owner") {
    throw new AppError("Cannot assign owner role via invite", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError("User not found with that email", 404);
  }

  const existing = await WorkspaceMember.findOne({
    workspaceId,
    userId: user._id.toString(),
  });

  if (existing) {
    throw new AppError("User is already a member", 409);
  }

  await WorkspaceMember.create({
    workspaceId,
    userId: user._id.toString(),
    role,
  });

  return {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role,
  };
};

export const removeWorkspaceMember = async (
  workspaceId: string,
  actorId: string,
  targetUserId: string
) => {
  const actorRole = await getMemberRole(workspaceId, actorId);
  if (!actorRole || !hasWorkspaceRole(actorRole, "admin")) {
    throw new AppError("Insufficient permissions", 403);
  }

  const target = await WorkspaceMember.findOne({
    workspaceId,
    userId: targetUserId,
  });

  if (!target) {
    throw new AppError("Member not found", 404);
  }

  if (target.role === "owner") {
    throw new AppError("Cannot remove workspace owner", 400);
  }

  await target.deleteOne();
};

export const setActiveWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  const role = await getMemberRole(workspaceId, userId);
  if (!role) {
    throw new AppError("Workspace not found", 404);
  }

  await User.findByIdAndUpdate(userId, { activeWorkspaceId: workspaceId });
  return { activeWorkspaceId: workspaceId };
};
