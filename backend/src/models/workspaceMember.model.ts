import mongoose from "mongoose";
import { WORKSPACE_ROLES } from "../constants/workspaceRoles";

const workspaceMemberSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: WORKSPACE_ROLES,
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

workspaceMemberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });

export default mongoose.model("WorkspaceMember", workspaceMemberSchema);
