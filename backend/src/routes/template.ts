import { Router } from "express";
import {
  getTemplates,
  getTemplate,
  createTemplateHandler,
  updateTemplateHandler,
  deleteTemplateHandler,
} from "../controllers/template.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getTemplates));
router.get("/:id", asyncHandler(getTemplate));
router.post("/", asyncHandler(createTemplateHandler));
router.put("/:id", asyncHandler(updateTemplateHandler));
router.delete("/:id", asyncHandler(deleteTemplateHandler));

export default router;
