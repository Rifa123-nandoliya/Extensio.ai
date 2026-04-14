import { Router, Request, Response } from "express";
import { extensionProjectSchema } from "../schemas/extension.schema";
import { generateExtensionFromAI } from "../services/ai.service";
import { writeProjectFiles } from "../services/fileWriter.service";
import { zipProject } from "../services/zip.service";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid prompt is required"
      });
    }

    const aiResponse = await generateExtensionFromAI(prompt);

    const validationResult = extensionProjectSchema.safeParse(aiResponse);

    if (!validationResult.success) {
      return res.status(422).json({
        success: false,
        message: "AI output validation failed",
        errors: validationResult.error.flatten()
      });
    }

    const { projectId, projectFolder } = await writeProjectFiles(validationResult.data);
    await zipProject(projectFolder, projectId);

    return res.status(200).json({
       success: true,
       message: "Extension generated successfully",
       projectId,
       downloadUrl: `http://localhost:5000/downloads/${projectId}.zip`,
       data: validationResult.data
    });
  } catch (error: any) {
    console.error("Generate route error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error"
    });
  }
});

export default router;