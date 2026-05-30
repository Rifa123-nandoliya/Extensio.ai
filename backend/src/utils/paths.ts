import path from "path";

export const getTempDir = () => path.join(process.cwd(), "temp");

export const getZipPath = (projectId: string) =>
  path.join(getTempDir(), `${projectId}.zip`);

export const getProjectDir = (projectId: string) =>
  path.join(getTempDir(), projectId);
