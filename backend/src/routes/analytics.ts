import { Router } from "express";
import {
  getMyAnalytics,
  getMyUsage,
  getMyReferrals,
} from "../controllers/analytics.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/me", asyncHandler(getMyAnalytics));
router.get("/usage", asyncHandler(getMyUsage));
router.get("/referrals", asyncHandler(getMyReferrals));

export default router;
