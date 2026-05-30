import mongoose from "mongoose";
import { TEMPLATE_CATEGORIES } from "../constants/templateCategories";

const templateSchema = new mongoose.Schema(
  {
    templateId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      default: null,
      index: true,
    },
    authorName: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: TEMPLATE_CATEGORIES,
      required: true,
    },
    isBuiltIn: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
    ratingAvg: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

templateSchema.index({ category: 1 });
templateSchema.index({ isPublic: 1, ratingAvg: -1 });
templateSchema.index({ title: "text", description: "text", prompt: "text" });

export default mongoose.model("Template", templateSchema);
