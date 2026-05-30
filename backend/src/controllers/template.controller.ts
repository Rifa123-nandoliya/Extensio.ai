import { Response } from "express";
import { AuthRequest } from "../types/express";
import { isValidCategory } from "../constants/templateCategories";
import {
  createTemplateSchema,
  updateTemplateSchema,
} from "../schemas/template.schema";
import {
  listTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../services/template.service";
import { isProPlan } from "../constants/plans";

export const getTemplates = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const category =
    typeof req.query.category === "string" ? req.query.category : undefined;
  const search =
    typeof req.query.search === "string" ? req.query.search : undefined;

  if (category && !isValidCategory(category)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category",
    });
  }

  const isPro = isProPlan(
    req.user!.subscriptionPlan,
    req.user!.subscriptionStatus
  );
  const templates = await listTemplates({
    userId,
    category,
    search,
    isPro,
  });

  res.status(200).json({
    success: true,
    templates,
    categories: [
      "Productivity",
      "Developer Tools",
      "AI Tools",
      "Social Media",
      "Accessibility",
    ],
  });
};

export const getTemplate = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const templateId = String(req.params.id);
  const template = await getTemplateById(userId, templateId);

  if (!template) {
    return res.status(404).json({
      success: false,
      message: "Template not found",
    });
  }

  if (
    template.isPremium &&
    !isProPlan(req.user!.subscriptionPlan, req.user!.subscriptionStatus)
  ) {
    return res.status(403).json({
      success: false,
      message: "Premium template. Upgrade to Pro to use this template.",
    });
  }

  res.status(200).json({
    success: true,
    template,
  });
};

export const createTemplateHandler = async (
  req: AuthRequest,
  res: Response
) => {
  const parsed = createTemplateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors[0]?.message || "Invalid input",
    });
  }

  const template = await createTemplate(req.user!.id, parsed.data);

  res.status(201).json({
    success: true,
    template,
  });
};

export const updateTemplateHandler = async (
  req: AuthRequest,
  res: Response
) => {
  const parsed = updateTemplateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors[0]?.message || "Invalid input",
    });
  }

  const template = await updateTemplate(
    req.user!.id,
    String(req.params.id),
    parsed.data
  );

  res.status(200).json({
    success: true,
    template,
  });
};

export const deleteTemplateHandler = async (
  req: AuthRequest,
  res: Response
) => {
  await deleteTemplate(req.user!.id, String(req.params.id));

  res.status(200).json({
    success: true,
    message: "Template deleted successfully",
  });
};
