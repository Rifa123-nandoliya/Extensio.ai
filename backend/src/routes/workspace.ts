import { Router } from "express";
import {
  listWorkspaces,
  createWorkspaceHandler,
  getWorkspace,
  updateWorkspaceHandler,
  getMembers,
  inviteMember,
  removeMember,
  activateWorkspace,
  listWorkspaceProjects,
} from "../controllers/workspace.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(listWorkspaces));
router.post("/", asyncHandler(createWorkspaceHandler));
router.get("/:workspaceId", asyncHandler(getWorkspace));
router.patch("/:workspaceId", asyncHandler(updateWorkspaceHandler));
router.post("/:workspaceId/activate", asyncHandler(activateWorkspace));
router.get("/:workspaceId/members", asyncHandler(getMembers));
router.post("/:workspaceId/members", asyncHandler(inviteMember));
router.delete("/:workspaceId/members/:userId", asyncHandler(removeMember));
router.get("/:workspaceId/projects", asyncHandler(listWorkspaceProjects));

export default router;
