import { Router } from "express";
import {
  adminOverview,
  adminUsers,
  adminUsage,
  adminReferrals,
} from "../controllers/admin.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/overview", asyncHandler(adminOverview));
router.get("/users", asyncHandler(adminUsers));
router.get("/usage", asyncHandler(adminUsage));
router.get("/referrals", asyncHandler(adminReferrals));

export default router;
