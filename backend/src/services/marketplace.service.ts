import Template from "../models/template.model";
import { AppError } from "../utils/AppError";
import { recordUsageEvent } from "./usageTracking.service";

export const listMarketplaceTemplates = async (query: {
  category?: string;
  search?: string;
  sort?: "popular" | "rating" | "newest";
  limit?: number;
}) => {
  const filter: Record<string, unknown> = { isPublic: true };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.search?.trim()) {
    const regex = new RegExp(query.search.trim(), "i");
    filter.$or = [
      { title: regex },
      { description: regex },
      { authorName: regex },
    ];
  }

  const sortMap = {
    popular: { usageCount: -1 as const, ratingAvg: -1 as const },
    rating: { ratingAvg: -1 as const, ratingCount: -1 as const },
    newest: { publishedAt: -1 as const },
  };

  const sort = sortMap[query.sort ?? "popular"];
  const limit = Math.min(query.limit ?? 50, 100);

  return Template.find(filter).sort(sort).limit(limit);
};

export const publishTemplateToMarketplace = async (
  userId: string,
  templateId: string,
  authorName: string
) => {
  const template = await Template.findOne({ templateId, userId });
  if (!template) {
    throw new AppError("Template not found", 404);
  }

  if (template.isBuiltIn) {
    throw new AppError("Built-in templates cannot be published", 400);
  }

  template.isPublic = true;
  template.authorName = authorName;
  template.publishedAt = new Date();
  await template.save();

  await recordUsageEvent({
    userId,
    eventType: "template_publish",
    metadata: { templateId },
  });

  return template;
};

export const unpublishTemplate = async (userId: string, templateId: string) => {
  const template = await Template.findOne({ templateId, userId });
  if (!template) {
    throw new AppError("Template not found", 404);
  }

  template.isPublic = false;
  await template.save();
  return template;
};

export const rateMarketplaceTemplate = async (
  userId: string,
  templateId: string,
  rating: number
) => {
  if (rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }

  const template = await Template.findOne({ templateId, isPublic: true });
  if (!template) {
    throw new AppError("Marketplace template not found", 404);
  }

  const newCount = template.ratingCount + 1;
  const newAvg =
    (template.ratingAvg * template.ratingCount + rating) / newCount;

  template.ratingAvg = Math.round(newAvg * 10) / 10;
  template.ratingCount = newCount;
  await template.save();

  await recordUsageEvent({
    userId,
    eventType: "template_use",
    metadata: { templateId, action: "rate", rating },
  });

  return template;
};

export const incrementTemplateUsage = async (templateId: string) => {
  await Template.updateOne({ templateId }, { $inc: { usageCount: 1 } });
};
