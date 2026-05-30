import { z } from "zod";
import { TEMPLATE_CATEGORIES } from "../constants/templateCategories";

const categorySchema = z.enum([
  TEMPLATE_CATEGORIES[0],
  TEMPLATE_CATEGORIES[1],
  TEMPLATE_CATEGORIES[2],
  TEMPLATE_CATEGORIES[3],
  TEMPLATE_CATEGORIES[4],
]);

export const createTemplateSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().min(1, "Description is required").max(500),
  prompt: z.string().min(10, "Prompt must be at least 10 characters").max(8000),
  category: categorySchema,
});

export const updateTemplateSchema = createTemplateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field is required to update" }
);

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
