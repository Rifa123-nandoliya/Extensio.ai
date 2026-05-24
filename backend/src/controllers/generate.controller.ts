import { Request, Response }
from "express";
import { v4 as uuidv4 }
from "uuid";

import {
  writeProjectFiles
} from "../services/fileWriter.service";

import {
  createZip
} from "../services/zip.service";

import {
  generateExtensionFromAI
} from "../services/ai.service";
import {
  saveProject
} from "../services/project.service";

export const generateExtension =
async (
  req: Request,
  res: Response
) => {

  try {

    const { prompt } = req.body;

    if (!prompt) {

      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });

    }

   const result =
  await generateExtensionFromAI(prompt);

const projectId =
  uuidv4();

const projectPath =
  await writeProjectFiles(
    result,
    projectId
  );

await createZip(
  projectPath,
  projectId
);
const savedProject =
  await saveProject({

    projectId,

    title:
      result.projectName,

    description:
      result.description,

    prompt,

    zipPath:
      `temp/${projectId}.zip`,

    files:
      result.files,

});

res.status(200).json({

  success: true,

  message:
    "Extension generated successfully",

  projectId,

  downloadUrl:
    `/api/download/${projectId}.zip`,

  savedProject,

  data: result,

});

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};