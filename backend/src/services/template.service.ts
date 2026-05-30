import { v4 as uuidv4 } from "uuid";
import Template from "../models/template.model";
import { BUILTIN_TEMPLATES } from "../data/builtinTemplates";
import { AppError } from "../utils/AppError";
import {
  CreateTemplateInput,
  UpdateTemplateInput,
} from "../schemas/template.schema";

export interface ListTemplatesQuery {
  userId: string;
  category?: string;
  search?: string;
  isPro?: boolean;
}

export const seedBuiltinTemplates = async () => {
  const count = await Template.countDocuments({ isBuiltIn: true });

  if (count === 0) {
    const docs = BUILTIN_TEMPLATES.map((t) => ({
      templateId: uuidv4(),
      userId: null,
      title: t.title,
      description: t.description,
      prompt: t.prompt,
      category: t.category,
      isBuiltIn: true,
      isPremium: Boolean(t.isPremium),
    }));

    await Template.insertMany(docs);
    console.log(`✅ Seeded ${docs.length} built-in templates`);
    return;
  }

  for (const t of BUILTIN_TEMPLATES) {
    await Template.updateOne(
      { isBuiltIn: true, title: t.title },
      { $set: { isPremium: Boolean(t.isPremium) } }
    );
  }
};

export const listTemplates = async ({
  userId,
  category,
  search,
  isPro = false,
}: ListTemplatesQuery) => {
  const accessFilter = isPro
    ? { $or: [{ isBuiltIn: true }, { userId }] }
    : {
        $or: [
          { userId },
          { isBuiltIn: true, isPremium: { $ne: true } },
        ],
      };

  const conditions: Record<string, unknown>[] = [accessFilter];

  if (category) {
    conditions.push({ category });
  }

  if (search?.trim()) {
    const regex = new RegExp(search.trim(), "i");
    conditions.push({
      $or: [{ title: regex }, { description: regex }, { prompt: regex }],
    });
  }

  return Template.find({ $and: conditions }).sort({
    isBuiltIn: -1,
    createdAt: -1,
  });
};

export const getTemplateById = async (
  userId: string,
  templateId: string
) => {
  return Template.findOne({
    templateId,
    $or: [{ isBuiltIn: true }, { userId }],
  });
};

export const createTemplate = async (
  userId: string,
  input: CreateTemplateInput
) => {
  return Template.create({
    templateId: uuidv4(),
    userId,
    title: input.title,
    description: input.description,
    prompt: input.prompt,
    category: input.category,
    isBuiltIn: false,
  });
};

export const updateTemplate = async (
  userId: string,
  templateId: string,
  input: UpdateTemplateInput
) => {
  const template = await Template.findOne({ templateId, userId });

  if (!template) {
    throw new AppError("Template not found or not editable", 404);
  }

  if (template.isBuiltIn) {
    throw new AppError("Built-in templates cannot be modified", 403);
  }

  Object.assign(template, input);
  await template.save();

  return template;
};

export const deleteTemplate = async (
  userId: string,
  templateId: string
) => {
  const template = await Template.findOne({ templateId, userId });

  if (!template) {
    throw new AppError("Template not found or not deletable", 404);
  }

  if (template.isBuiltIn) {
    throw new AppError("Built-in templates cannot be deleted", 403);
  }

  await template.deleteOne();
  return template;
};
