import fs from "fs/promises";
import path from "path";
import { ExtensionProject } from "../schemas/extension.schema";
import { getProjectDir } from "../utils/paths";

export async function writeProjectFiles(
  project: ExtensionProject,
  projectId: string
) {
  const projectPath = getProjectDir(projectId);

  await fs.mkdir(
    projectPath,
    { recursive: true }
  );

  for (const file of project.files) {

    const filePath =
      path.join(
        projectPath,
        file.filename
      );

    await fs.writeFile(
      filePath,
      file.content
    );

  }

  return projectPath;

}