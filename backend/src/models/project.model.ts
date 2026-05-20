import mongoose from "mongoose";

const generatedFileSchema = new mongoose.Schema({
  filename: String,
  content: String
});

const projectSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true
  },

  projectName: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  files: [generatedFileSchema],

  zipUrl: {
    type: String
  }

}, {
  timestamps: true
});

export default mongoose.model(
  "Project",
  projectSchema
);