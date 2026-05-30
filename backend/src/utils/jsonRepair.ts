import { extractJsonFromText } from "./jsonExtract";

export const mechanicallyRepairJson = (text: string): string => {
  let json = extractJsonFromText(text);

  json = json.replace(/,\s*}/g, "}");
  json = json.replace(/,\s*]/g, "]");

  json = json.replace(/[\x00-\x1F\x7F]/g, (char) => {
    if (char === "\n" || char === "\r" || char === "\t") return char;
    return "";
  });

  return json;
};

export const safeJsonParse = (
  text: string
): { success: true; data: unknown } | { success: false; error: string } => {
  try {
    return { success: true, data: JSON.parse(text) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
};
