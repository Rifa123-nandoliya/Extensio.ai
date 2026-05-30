const TEMPLATES_KEY = "templatesUsedCount";

export const getTemplatesUsedCount = () => {
  const raw = localStorage.getItem(TEMPLATES_KEY);
  return raw ? parseInt(raw, 10) || 0 : 0;
};

export const incrementTemplatesUsed = () => {
  const count = getTemplatesUsedCount() + 1;
  localStorage.setItem(TEMPLATES_KEY, String(count));
  return count;
};
