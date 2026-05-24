import mongoose from "mongoose";

const FileSchema =
new mongoose.Schema({

  filename: String,

  content: String,

});

const ProjectSchema =
new mongoose.Schema({

  projectId: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  prompt: {
    type: String,
    required: true,
  },

  zipPath: {
    type: String,
    required: true,
  },

  files: [FileSchema],

}, {
  timestamps: true,
});

export default mongoose.model(
  "Project",
  ProjectSchema
);