import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
    },
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

chatMessageSchema.index({ conversationId: 1, createdAt: 1 });

export default mongoose.model("ChatMessage", chatMessageSchema);
