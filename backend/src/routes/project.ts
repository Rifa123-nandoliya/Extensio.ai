import { Router } from "express";
import Project from "../models/project.model";

const router = Router();

router.get("/", async (_, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: projects
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects"
    });
  }
});

export default router;