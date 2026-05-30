import { Router } from "express";
import {
  browseMarketplace,
  publishTemplate,
  unpublishTemplateHandler,
  rateTemplate,
} from "../controllers/marketplace.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/templates", asyncHandler(browseMarketplace));
router.post("/templates/:id/publish", asyncHandler(publishTemplate));
router.post("/templates/:id/unpublish", asyncHandler(unpublishTemplateHandler));
router.post("/templates/:id/rate", asyncHandler(rateTemplate));

export default router;
