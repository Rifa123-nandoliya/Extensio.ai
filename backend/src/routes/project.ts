import { Router } from "express";
import {
  listProjects,
  getProject,
  removeProject,
  shareProject,
  unshareProjectHandler,
  setVisibility,
  getVersions,
  getVersion,
  restoreVersion,
} from "../controllers/project.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(listProjects));
router.get("/:id", asyncHandler(getProject));
router.delete("/:id", asyncHandler(removeProject));
router.post("/:id/share", asyncHandler(shareProject));
router.delete("/:id/share/:userId", asyncHandler(unshareProjectHandler));
router.patch("/:id/visibility", asyncHandler(setVisibility));
router.get("/:id/versions", asyncHandler(getVersions));
router.get("/:id/versions/:versionNumber", asyncHandler(getVersion));
router.post("/:id/versions/:versionNumber/restore", asyncHandler(restoreVersion));

export default router;
