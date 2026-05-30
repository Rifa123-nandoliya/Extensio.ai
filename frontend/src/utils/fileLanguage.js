export const getLanguageFromFilename = (filename) => {
  const lower = filename.toLowerCase();

  if (lower.endsWith(".json")) return "json";
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return "html";
  if (lower.endsWith(".css")) return "css";
  if (lower.endsWith(".ts")) return "typescript";
  if (lower.endsWith(".tsx")) return "typescript";
  if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "javascript";
  if (lower.endsWith(".md")) return "markdown";

  return "plaintext";
};

export const sortFilesForExplorer = (files) => {
  const priority = (name) => {
    if (name === "manifest.json") return 0;
    if (name.endsWith(".html")) return 1;
    if (name.includes("background")) return 2;
    if (name.includes("content")) return 3;
    if (name.includes("popup")) return 4;
    return 5;
  };

  return [...files].sort((a, b) => {
    const pa = priority(a.filename);
    const pb = priority(b.filename);
    if (pa !== pb) return pa - pb;
    return a.filename.localeCompare(b.filename);
  });
};
