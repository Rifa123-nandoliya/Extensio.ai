import mongoose from "mongoose";

const versionFileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const projectVersionSchema = new mongoose.Schema(
  {
    versionId: {
      type: String,
      required: true,
      unique: true,
    },
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    versionNumber: {
      type: Number,
      required: true,
    },
    projectName: { type: String, required: true },
    description: { type: String },
    prompt: { type: String, required: true },
    files: [versionFileSchema],
    createdBy: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: null,
    },
    changeSummary: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

projectVersionSchema.index({ projectId: 1, versionNumber: -1 }, { unique: true });

export default mongoose.model("ProjectVersion", projectVersionSchema);
