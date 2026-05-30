import { v4 as uuidv4 } from "uuid";
import ProjectVersion from "../models/projectVersion.model";
import Project from "../models/project.model";
import { GeneratedFile } from "../schemas/extension.schema";
import { AppError } from "../utils/AppError";
import { assertProjectAccess } from "./projectAccess.service";
import { recordUsageEvent } from "./usageTracking.service";

interface CreateVersionInput {
  projectId: string;
  versionNumber: number;
  projectName: string;
  description?: string;
  prompt: string;
  files: GeneratedFile[];
  createdBy: string;
  label?: string;
  changeSummary?: string;
}

export const createProjectVersion = async (input: CreateVersionInput) => {
  return ProjectVersion.create({
    versionId: uuidv4(),
    projectId: input.projectId,
    versionNumber: input.versionNumber,
    projectName: input.projectName,
    description: input.description,
    prompt: input.prompt,
    files: input.files,
    createdBy: input.createdBy,
    label: input.label ?? null,
    changeSummary: input.changeSummary ?? null,
  });
};

export const listProjectVersions = async (
  userId: string,
  projectId: string
) => {
  const project = await Project.findOne({ projectId });
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await assertProjectAccess(userId, project, "view");

  const versions = await ProjectVersion.find({ projectId })
    .sort({ versionNumber: -1 })
    .select(
      "versionId versionNumber projectName label changeSummary createdBy createdAt"
    );

  return {
    currentVersion: project.currentVersion,
    versions,
  };
};

export const getProjectVersion = async (
  userId: string,
  projectId: string,
  versionNumber: number
) => {
  const project = await Project.findOne({ projectId });
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await assertProjectAccess(userId, project, "view");

  const version = await ProjectVersion.findOne({ projectId, versionNumber });
  if (!version) {
    throw new AppError("Version not found", 404);
  }

  return version;
};

export const restoreProjectVersion = async (
  userId: string,
  projectId: string,
  versionNumber: number
) => {
  const project = await Project.findOne({ projectId });
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await assertProjectAccess(userId, project, "edit");

  const version = await ProjectVersion.findOne({ projectId, versionNumber });
  if (!version) {
    throw new AppError("Version not found", 404);
  }

  const nextVersion = (project.currentVersion ?? 1) + 1;

  project.projectName = version.projectName;
  project.description = version.description;
  project.prompt = version.prompt;
  project.files = version.files;
  project.currentVersion = nextVersion;
  await project.save();

  await createProjectVersion({
    projectId,
    versionNumber: nextVersion,
    projectName: version.projectName,
    description: version.description,
    prompt: version.prompt,
    files: version.files,
    createdBy: userId,
    label: `Restored from v${versionNumber}`,
    changeSummary: `Restored from version ${versionNumber}`,
  });

  await recordUsageEvent({
    userId,
    eventType: "version_restore",
    workspaceId: project.workspaceId,
    metadata: { projectId, fromVersion: versionNumber, toVersion: nextVersion },
  });

  return project;
};
