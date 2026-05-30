export const TEMPLATE_CATEGORIES = [
  "Productivity",
  "Developer Tools",
  "AI Tools",
  "Social Media",
  "Accessibility",
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

export const isValidCategory = (
  value: string
): value is TemplateCategory => {
  return TEMPLATE_CATEGORIES.includes(value as TemplateCategory);
};
