import { Router } from "express";
import { downloadProjectZip } from "../controllers/download.controller";

const router = Router();

router.get("/:projectId.zip", downloadProjectZip);

export default router;
