import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ExtensionProject } from "../schemas/extension.schema";

export async function writeProjectFiles(project: ExtensionProject) {
  const projectId = uuidv4();
  const projectFolder = path.join(process.cwd(), "temp", projectId);

  await fs.mkdir(projectFolder, { recursive: true });

  for (const file of project.files) {
    const filePath = path.join(projectFolder, file.filename);
    await fs.writeFile(filePath, file.content, "utf-8");
  }

  return { projectId, projectFolder };
}