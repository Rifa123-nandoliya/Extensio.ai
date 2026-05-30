import { Router } from "express";
import {
  getConversations,
  createConversationHandler,
  getMessages,
  postMessage,
  removeConversation,
} from "../controllers/chat.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/conversations", asyncHandler(getConversations));
router.post("/conversations", asyncHandler(createConversationHandler));
router.get("/conversations/:conversationId/messages", asyncHandler(getMessages));
router.post("/conversations/:conversationId/messages", asyncHandler(postMessage));
router.delete("/conversations/:conversationId", asyncHandler(removeConversation));

export default router;
