import {z} from "zod";

export const generatedFileSchema = z.object({
    filename: z.string().min(1,"Filename is required").regex(
        /^[a-zA-Z0-9._/-]+$/,
        "Filename contains invalid characters"
    ),
    content: z.string()
});
export const extensionProjectSchema = z.object({
    projectName: z.string().min(1,"Project name is required"),
    description: z.string().min(1,"Description is required"),
    files: z.array(generatedFileSchema).min(1,"At least one file is required")
}).superRefine((data,ctx)=>{
    const filenames = data.files.map((file)=> file.filename);
    if(!filenames.includes("manifest.json")){
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "manifest.json is required"
        });
    }
});

export type GeneratedFile = z.infer<typeof generatedFileSchema>;
export type ExtensionProject = z.infer<typeof extensionProjectSchema>;