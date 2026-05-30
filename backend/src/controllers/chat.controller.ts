import { Response } from "express";
import { AuthRequest } from "../types/express";
import {
  listConversations,
  createConversation,
  listMessages,
  sendMessage,
  deleteConversation,
} from "../services/chat.service";

export const getConversations = async (req: AuthRequest, res: Response) => {
  const conversations = await listConversations(req.user!.id);
  res.json({ success: true, conversations });
};

export const createConversationHandler = async (
  req: AuthRequest,
  res: Response
) => {
  const conversation = await createConversation({
    userId: req.user!.id,
    title: req.body?.title,
    workspaceId: req.body?.workspaceId,
    projectId: req.body?.projectId,
    type: req.body?.type,
  });
  res.status(201).json({ success: true, conversation });
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  const messages = await listMessages(
    req.user!.id,
    String(req.params.conversationId)
  );
  res.json({ success: true, messages });
};

export const postMessage = async (req: AuthRequest, res: Response) => {
  const content = req.body?.content?.trim();
  if (!content) {
    return res.status(400).json({ success: false, message: "Message required" });
  }

  const result = await sendMessage(
    req.user!.id,
    String(req.params.conversationId),
    content
  );

  res.json({ success: true, ...result });
};

export const removeConversation = async (req: AuthRequest, res: Response) => {
  await deleteConversation(req.user!.id, String(req.params.conversationId));
  res.json({ success: true, message: "Conversation deleted" });
};
