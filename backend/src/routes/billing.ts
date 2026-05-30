import { Router } from "express";
import {
  getBilling,
  checkout,
  billingPortal,
  cancel,
  resume,
  changePlan,
} from "../controllers/billing.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getBilling));
router.post("/checkout", asyncHandler(checkout));
router.post("/portal", asyncHandler(billingPortal));
router.post("/cancel", asyncHandler(cancel));
router.post("/resume", asyncHandler(resume));
router.post("/change-plan", asyncHandler(changePlan));

export default router;
