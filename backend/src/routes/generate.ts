import { Router } from "express";
import { generateExtension } from "../controllers/generate.controller";
import { generateLimiter } from "../middleware/rateLimit";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/", generateLimiter, asyncHandler(generateExtension));

export default router;
