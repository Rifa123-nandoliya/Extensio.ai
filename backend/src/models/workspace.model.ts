import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    isPersonal: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Workspace", workspaceSchema);
