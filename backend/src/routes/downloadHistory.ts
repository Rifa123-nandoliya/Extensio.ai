import { Router } from "express";
import {
  listDownloadHistory,
  getDownloadsAnalytics,
} from "../controllers/downloadHistory.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/analytics", asyncHandler(getDownloadsAnalytics));
router.get("/", asyncHandler(listDownloadHistory));

export default router;
