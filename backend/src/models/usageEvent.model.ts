import mongoose from "mongoose";
import { USAGE_EVENT_TYPES } from "../constants/usageEvents";

const usageEventSchema = new mongoose.Schema(
  {
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
    eventType: {
      type: String,
      enum: USAGE_EVENT_TYPES,
      required: true,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

usageEventSchema.index({ userId: 1, createdAt: -1 });
usageEventSchema.index({ eventType: 1, createdAt: -1 });

export default mongoose.model("UsageEvent", usageEventSchema);
