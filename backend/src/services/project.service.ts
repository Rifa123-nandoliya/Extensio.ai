import fs from "fs/promises";
import Project from "../models/project.model";
import { GeneratedFile } from "../schemas/extension.schema";
import { getProjectDir, getZipPath } from "../utils/paths";
import { AppError } from "../utils/AppError";
import {
  buildAccessibleProjectsQuery,
  assertProjectAccess,
  getProjectAccess,
} from "./projectAccess.service";
import { createProjectVersion } from "./versionHistory.service";

interface SaveProjectInput {
  userId: string;
  projectId: string;
  title: string;
  description: string;
  prompt: string;
  zipPath: string;
  files: GeneratedFile[];
  workspaceId?: string | null;
  visibility?: "private" | "workspace" | "public";
}

const removeProjectFiles = async (projectId: string) => {
  await Promise.allSettled([
    fs.rm(getProjectDir(projectId), { recursive: true, force: true }),
    fs.rm(getZipPath(projectId), { force: true }),
  ]);
};

export const saveProject = async (data: SaveProjectInput) => {
  const project = await Project.create({
    userId: data.userId,
    createdBy: data.userId,
    workspaceId: data.workspaceId ?? null,
    visibility: data.visibility ?? "private",
    projectId: data.projectId,
    projectName: data.title,
    description: data.description,
    prompt: data.prompt,
    zipPath: data.zipPath,
    files: data.files,
    currentVersion: 1,
  });

  await createProjectVersion({
    projectId: data.projectId,
    versionNumber: 1,
    projectName: data.title,
    description: data.description,
    prompt: data.prompt,
    files: data.files,
    createdBy: data.userId,
    label: "Initial version",
    changeSummary: "Project created",
  });

  return project;
};

export const getAllProjects = async (
  userId: string,
  workspaceId?: string | null
) => {
  const query = await buildAccessibleProjectsQuery(userId, workspaceId);
  const projects = await Project.find(query).sort({ createdAt: -1 });

  const enriched = await Promise.all(
    projects.map(async (project) => {
      const access = await getProjectAccess(userId, project);
      return {
        ...project.toObject(),
        access,
        isShared: access !== "owner",
      };
    })
  );

  return enriched;
};

export const getProjectById = async (userId: string, projectId: string) => {
  const project = await Project.findOne({ projectId });
  if (!project) return null;

  const access = await getProjectAccess(userId, project);
  if (!access) return null;

  return {
    ...project.toObject(),
    access,
  };
};

export const deleteProject = async (userId: string, projectId: string) => {
  const project = await Project.findOne({ projectId });
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await assertProjectAccess(userId, project, "owner");

  await Project.deleteOne({ projectId });
  await removeProjectFiles(projectId);

  return project;
};
