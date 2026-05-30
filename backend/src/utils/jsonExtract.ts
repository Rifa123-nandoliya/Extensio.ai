export const extractJsonFromText = (text: string): string => {
  let cleaned = text.trim();

  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  cleaned = cleaned.replace(/```\s*$/i, "");
  cleaned = cleaned.trim();

  if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
    return cleaned;
  }

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.slice(start, end + 1);
  }

  return cleaned;
};
