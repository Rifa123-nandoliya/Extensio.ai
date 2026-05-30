import Project from "../models/project.model";
import User from "../models/user.model";
import { getMemberRole } from "./workspace.service";
import { AppError } from "../utils/AppError";

type ProjectDoc = InstanceType<typeof Project>;

export type ProjectAccess = "owner" | "edit" | "view";

export const getProjectAccess = async (
  userId: string,
  project: ProjectDoc
): Promise<ProjectAccess | null> => {
  if (project.userId === userId || project.createdBy === userId) {
    return "owner";
  }

  const share = project.sharedWith?.find((s) => s.userId === userId);
  if (share) {
    return share.role === "edit" ? "edit" : "view";
  }

  if (project.visibility === "workspace" && project.workspaceId) {
    const role = await getMemberRole(project.workspaceId, userId);
    if (role) return role === "viewer" ? "view" : "edit";
  }

  if (project.visibility === "public") {
    return "view";
  }

  return null;
};

export const assertProjectAccess = async (
  userId: string,
  project: ProjectDoc,
  minimum: ProjectAccess = "view"
) => {
  const access = await getProjectAccess(userId, project);
  if (!access) {
    throw new AppError("Project not found", 404);
  }

  const rank = { view: 1, edit: 2, owner: 3 };
  if (rank[access] < rank[minimum]) {
    throw new AppError("Insufficient project permissions", 403);
  }

  return access;
};

export const buildAccessibleProjectsQuery = async (
  userId: string,
  workspaceId?: string | null
) => {
  const orConditions: Record<string, unknown>[] = [
    { userId },
    { createdBy: userId },
    { "sharedWith.userId": userId },
  ];

  if (workspaceId) {
    orConditions.push({
      workspaceId,
      visibility: { $in: ["workspace", "public"] },
    });
  }

  return { $or: orConditions };
};

export const shareProjectWithUser = async (
  ownerId: string,
  projectId: string,
  email: string,
  role: "view" | "edit" = "view"
) => {
  const project = await Project.findOne({ projectId });
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await assertProjectAccess(ownerId, project, "owner");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError("User not found with that email", 404);
  }

  const targetId = user._id.toString();
  if (targetId === ownerId) {
    throw new AppError("Cannot share with yourself", 400);
  }

  const existing = project.sharedWith?.find((s) => s.userId === targetId);

  if (existing) {
    await Project.updateOne(
      { projectId, "sharedWith.userId": targetId },
      { $set: { "sharedWith.$.role": role } }
    );
  } else {
    await Project.updateOne(
      { projectId },
      {
        $push: {
          sharedWith: { userId: targetId, role, addedAt: new Date() },
        },
      }
    );
  }

  return {
    userId: targetId,
    name: user.name,
    email: user.email,
    role,
  };
};

export const unshareProject = async (
  ownerId: string,
  projectId: string,
  targetUserId: string
) => {
  const project = await Project.findOne({ projectId });
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await assertProjectAccess(ownerId, project, "owner");

  const sharedWith = (project.sharedWith ?? []).filter(
    (s) => s.userId !== targetUserId
  );
  project.set("sharedWith", sharedWith);
  await project.save();
};

export const updateProjectVisibility = async (
  userId: string,
  projectId: string,
  visibility: "private" | "workspace" | "public",
  workspaceId?: string | null
) => {
  const project = await Project.findOne({ projectId });
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await assertProjectAccess(userId, project, "owner");

  project.visibility = visibility;
  if (workspaceId !== undefined) {
    project.workspaceId = workspaceId;
  }

  await project.save();
  return project;
};
