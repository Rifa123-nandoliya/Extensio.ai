import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema(
  {
    downloadId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    zipPath: {
      type: String,
    },
    source: {
      type: String,
      enum: ["generate", "redownload"],
      default: "redownload",
    },
  },
  { timestamps: true }
);

downloadSchema.index({ userId: 1, createdAt: -1 });
downloadSchema.index({ userId: 1, projectId: 1 });

export default mongoose.model("Download", downloadSchema);
