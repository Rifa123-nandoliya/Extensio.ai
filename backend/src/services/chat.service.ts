import { v4 as uuidv4 } from "uuid";
import ChatConversation from "../models/chatConversation.model";
import ChatMessage from "../models/chatMessage.model";
import { AppError } from "../utils/AppError";
import { generateChatCompletion } from "./ai.service";
import { ASSISTANT_SYSTEM_PROMPT } from "../prompts/assistant.prompt";
import { recordUsageEvent } from "./usageTracking.service";

export const listConversations = async (userId: string) => {
  return ChatConversation.find({ userId })
    .sort({ lastMessageAt: -1 })
    .limit(50);
};

export const createConversation = async (input: {
  userId: string;
  title?: string;
  workspaceId?: string | null;
  projectId?: string | null;
  type?: "assistant" | "project";
}) => {
  return ChatConversation.create({
    conversationId: uuidv4(),
    userId: input.userId,
    title: input.title ?? "New conversation",
    workspaceId: input.workspaceId ?? null,
    projectId: input.projectId ?? null,
    type: input.type ?? "assistant",
  });
};

export const getConversation = async (
  userId: string,
  conversationId: string
) => {
  const conversation = await ChatConversation.findOne({
    conversationId,
    userId,
  });

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  return conversation;
};

export const listMessages = async (
  userId: string,
  conversationId: string
) => {
  await getConversation(userId, conversationId);

  return ChatMessage.find({ conversationId }).sort({ createdAt: 1 }).limit(200);
};

export const sendMessage = async (
  userId: string,
  conversationId: string,
  content: string
) => {
  const conversation = await getConversation(userId, conversationId);

  const userMessage = await ChatMessage.create({
    messageId: uuidv4(),
    conversationId,
    role: "user",
    content,
  });

  const history = await ChatMessage.find({ conversationId })
    .sort({ createdAt: 1 })
    .limit(20);

  const groqMessages: {
    role: "user" | "assistant" | "system";
    content: string;
  }[] = [{ role: "system", content: ASSISTANT_SYSTEM_PROMPT }];

  for (const msg of history) {
    groqMessages.push({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    });
  }

  const assistantContent = await generateChatCompletion(groqMessages);

  const assistantMessage = await ChatMessage.create({
    messageId: uuidv4(),
    conversationId,
    role: "assistant",
    content: assistantContent,
  });

  conversation.lastMessageAt = new Date();
  if (conversation.title === "New conversation" && content.length > 0) {
    conversation.title = content.slice(0, 60);
  }
  await conversation.save();

  await recordUsageEvent({
    userId,
    eventType: "chat_message",
    workspaceId: conversation.workspaceId,
    metadata: { conversationId },
  });

  return {
    userMessage,
    assistantMessage,
  };
};

export const deleteConversation = async (
  userId: string,
  conversationId: string
) => {
  await getConversation(userId, conversationId);
  await ChatMessage.deleteMany({ conversationId });
  await ChatConversation.deleteOne({ conversationId });
};
