import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const sharedWithSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    role: {
      type: String,
      enum: ["view", "edit"],
      default: "view",
    },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    createdBy: {
      type: String,
      required: true,
      index: true,
    },
    workspaceId: {
      type: String,
      default: null,
      index: true,
    },
    visibility: {
      type: String,
      enum: ["private", "workspace", "public"],
      default: "private",
    },
    projectId: {
      type: String,
      required: true,
      unique: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    prompt: {
      type: String,
      required: true,
    },
    files: [fileSchema],
    zipPath: {
      type: String,
    },
    currentVersion: {
      type: Number,
      default: 1,
    },
    sharedWith: {
      type: [sharedWithSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ workspaceId: 1, createdAt: -1 });
projectSchema.index({ "sharedWith.userId": 1 });

export default mongoose.model("Project", projectSchema);
