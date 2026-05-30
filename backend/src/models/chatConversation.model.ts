import mongoose from "mongoose";

const chatConversationSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    workspaceId: {
      type: String,
      default: null,
      index: true,
    },
    projectId: {
      type: String,
      default: null,
      index: true,
    },
    type: {
      type: String,
      enum: ["assistant", "project"],
      default: "assistant",
    },
    title: {
      type: String,
      default: "New conversation",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

chatConversationSchema.index({ userId: 1, lastMessageAt: -1 });

export default mongoose.model("ChatConversation", chatConversationSchema);
