import { z } from "zod";
import {
  validateManifestV3,
  collectReferencedFiles,
} from "../utils/manifestValidate";

export const generatedFileSchema = z.object({
  filename: z
    .string()
    .min(1, "Filename is required")
    .regex(
      /^[a-zA-Z0-9._/-]+$/,
      "Filename contains invalid characters"
    ),
  content: z
    .string()
    .min(1, "File content cannot be empty"),
});

export const extensionProjectSchema = z
  .object({
    projectName: z.string().min(1, "Project name is required").max(120),
    description: z.string().min(1, "Description is required").max(500),
    files: z.array(generatedFileSchema).min(1, "At least one file is required"),
  })
  .superRefine((data, ctx) => {
    const filenames = data.files.map((file) => file.filename);

    if (!filenames.includes("manifest.json")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "manifest.json is required",
        path: ["files"],
      });
      return;
    }

    const uniqueFiles = new Set(filenames);
    if (uniqueFiles.size !== filenames.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duplicate filenames detected",
        path: ["files"],
      });
    }

    const manifestFile = data.files.find((f) => f.filename === "manifest.json");
    if (!manifestFile) return;

    const manifestCheck = validateManifestV3(manifestFile.content);
    if (!manifestCheck.valid) {
      for (const err of manifestCheck.errors) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: err,
          path: ["files"],
        });
      }
    }

    const referenced = collectReferencedFiles(manifestFile.content);
    const missing = referenced.filter((ref) => !filenames.includes(ref));
    if (missing.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Manifest references missing files: ${missing.join(", ")}`,
        path: ["files"],
      });
    }
  });

export type GeneratedFile = z.infer<typeof generatedFileSchema>;
export type ExtensionProject = z.infer<typeof extensionProjectSchema>;

export const formatZodErrors = (error: z.ZodError): string => {
  return error.issues.map((issue) => issue.message).join("; ");
};
