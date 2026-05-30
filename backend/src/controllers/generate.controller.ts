import { Response } from "express";
import { AuthRequest } from "../types/express";

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
import {
  assertCanGenerate,
  incrementGenerationUsage,
} from "../services/usage.service";
import { isProPlan } from "../constants/plans";
import { recordUsageEvent } from "../services/usageTracking.service";
import User from "../models/user.model";

export const generateExtension = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { prompt, workspaceId: bodyWorkspaceId } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    await assertCanGenerate(userId);

    const usePriority = isProPlan(
      req.user!.subscriptionPlan,
      req.user!.subscriptionStatus
    );

    let workspaceId = bodyWorkspaceId ?? null;
    if (!workspaceId) {
      const dbUser = await User.findById(userId).select("activeWorkspaceId");
      workspaceId = dbUser?.activeWorkspaceId ?? null;
    }

    console.log("📝 Starting generation with prompt:", prompt.substring(0, 100));

    // Generate AI extension

    let result;
    try {
      console.log("🤖 Calling AI service...");
      result = await generateExtensionFromAI(prompt, {
        priority: usePriority,
      });
      console.log("✅ AI generation successful. Files:", result.files.length);
    } catch (aiError: any) {
      console.error("❌ AI generation failed:", aiError.message);
      throw aiError;
    }

    const validFiles = result.files.filter(
      (file) =>
        typeof file.content === "string" &&
        file.content.trim().length > 0
    );

    if (validFiles.length !== result.files.length) {
      const invalidFiles = result.files
        .filter(
          (file) =>
            !file.content ||
            (typeof file.content === "string" &&
              file.content.trim().length === 0)
        )
        .map((file) => file.filename);

      console.warn(
        "⚠️ Removing invalid generated files:",
        invalidFiles.join(", ")
      );

      result = {
        ...result,
        files: validFiles,
      };
    }

    if (validFiles.length === 0) {
      throw new Error(
        "AI returned no valid generated files with content"
      );
    }

    // Create unique project id

    const projectId =
      uuidv4();

    console.log("📦 Project ID:", projectId);

    // Write files locally

    let projectPath;
    try {
      console.log("💾 Writing files to disk...");
      projectPath =
        await writeProjectFiles(
          result,
          projectId
        );
      console.log("✅ Files written successfully to:", projectPath);
    } catch (writeError: any) {
      console.error("❌ File writing failed:", writeError.message);
      throw writeError;
    }

    // Create ZIP

    try {
      console.log("📦 Creating ZIP file...");
      await createZip(
        projectPath,
        projectId
      );
      console.log("✅ ZIP created successfully");
    } catch (zipError: any) {
      console.error("❌ ZIP creation failed:", zipError.message);
      throw zipError;
    }

    // Save project in MongoDB

    let savedProject;
    try {
      console.log("💾 Saving project to MongoDB...");
      savedProject = await saveProject({
        userId,
        projectId,
        title: result.projectName,
        description: result.description,
        prompt,
        zipPath: `temp/${projectId}.zip`,
        files: result.files,
        workspaceId,
      });
      console.log("✅ Project saved to MongoDB");
    } catch (dbError: any) {
      console.error("❌ Database save failed:", dbError.message);
      throw dbError;
    }

    await incrementGenerationUsage(userId);

    await recordUsageEvent({
      userId,
      workspaceId,
      eventType: "generation",
      metadata: { projectId, fileCount: result.files.length },
    });

    // Send response

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

    console.error("❌ FINAL ERROR:", error);

    res.status(500).json({

      success: false,

      message:
        error.message || "Unknown error occurred",

      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,

    });

  }

};