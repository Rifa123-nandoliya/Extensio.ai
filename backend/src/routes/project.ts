import { Router, Request, Response } from "express";
import Project from "../models/project.model";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: projects });
  } catch (error: any) {
    console.error("Project route error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error"
    });
  }
});

export default router;
