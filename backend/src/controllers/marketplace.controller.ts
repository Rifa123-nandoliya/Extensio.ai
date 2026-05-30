import { Response } from "express";
import { AuthRequest } from "../types/express";
import {
  listMarketplaceTemplates,
  publishTemplateToMarketplace,
  unpublishTemplate,
  rateMarketplaceTemplate,
} from "../services/marketplace.service";

export const browseMarketplace = async (req: AuthRequest, res: Response) => {
  const templates = await listMarketplaceTemplates({
    category: req.query.category as string | undefined,
    search: req.query.search as string | undefined,
    sort: (req.query.sort as "popular" | "rating" | "newest") || "popular",
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });

  res.json({ success: true, templates });
};

export const publishTemplate = async (req: AuthRequest, res: Response) => {
  const template = await publishTemplateToMarketplace(
    req.user!.id,
    String(req.params.id),
    req.user!.name
  );
  res.json({ success: true, template });
};

export const unpublishTemplateHandler = async (req: AuthRequest, res: Response) => {
  const template = await unpublishTemplate(req.user!.id, String(req.params.id));
  res.json({ success: true, template });
};

export const rateTemplate = async (req: AuthRequest, res: Response) => {
  const rating = Number(req.body?.rating);
  const template = await rateMarketplaceTemplate(
    req.user!.id,
    String(req.params.id),
    rating
  );
  res.json({ success: true, template });
};
