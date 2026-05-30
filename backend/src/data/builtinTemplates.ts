import { TemplateCategory } from "../constants/templateCategories";

export interface BuiltinTemplateSeed {
  title: string;
  description: string;
  prompt: string;
  category: TemplateCategory;
  isPremium?: boolean;
}

export const BUILTIN_TEMPLATES: BuiltinTemplateSeed[] = [
  {
    title: "Dark Mode Toggle",
    description: "Add a popup to enable dark mode on any website.",
    category: "Productivity",
    prompt:
      "Create a Manifest V3 Chrome extension with a popup toggle that applies a dark theme filter to all websites, persists the preference in chrome.storage, and includes a content script to inject dark styles.",
  },
  {
    title: "Tab Organizer",
    description: "Group and save tab sessions for later.",
    category: "Productivity",
    prompt:
      "Build a Manifest V3 extension with a popup to save the current window's tabs as a named session, list saved sessions, and restore them. Use a background service worker and chrome.tabs APIs.",
  },
  {
    title: "Quick Notes",
    description: "Capture notes from any page in a popup.",
    category: "Productivity",
    isPremium: true,
    prompt:
      "Create a Chrome extension with a popup note editor that saves notes to chrome.storage.local, shows a list of saved notes with timestamps, and allows delete per note.",
  },
  {
    title: "JSON Formatter",
    description: "Format and validate JSON in a devtools-style popup.",
    category: "Developer Tools",
    prompt:
      "Build a Manifest V3 extension with a popup where users paste JSON, see formatted/pretty-printed output, validation errors, and a copy button. Use a clean developer-focused UI.",
  },
  {
    title: "API Header Injector",
    description: "Add custom headers to requests on matched URLs.",
    category: "Developer Tools",
    isPremium: true,
    prompt:
      "Create a Chrome extension using declarativeNetRequest or webRequest (MV3 compatible) to let users configure custom HTTP headers per domain pattern via an options page and background service worker.",
  },
  {
    title: "Color Picker",
    description: "Pick colors from any page pixel.",
    category: "Developer Tools",
    prompt:
      "Build an extension with a content script that shows an eyedropper on click, copies hex/RGB to clipboard, and a popup showing the last picked colors history.",
  },
  {
    title: "Page Summarizer",
    description: "Summarize the current page from the popup.",
    category: "AI Tools",
    isPremium: true,
    prompt:
      "Create a Manifest V3 extension with a popup that extracts main article text from the active tab via content script messaging, displays it in the popup with a placeholder UI for 'Summarize' (mock the AI response with structured sections).",
  },
  {
    title: "Prompt Library",
    description: "Save and reuse AI prompts from the toolbar.",
    category: "AI Tools",
    isPremium: true,
    prompt:
      "Build a Chrome extension popup that stores a library of user-defined AI prompts in chrome.storage, with categories, search, insert-to-clipboard, and add/edit/delete prompts.",
  },
  {
    title: "Tweet Saver",
    description: "Save tweets and threads while browsing X.",
    category: "Social Media",
    isPremium: true,
    prompt:
      "Create an extension with a content script for x.com that adds a 'Save' button on tweets, stores saved tweets in chrome.storage with author and text, and a popup to browse saved items.",
  },
  {
    title: "LinkedIn Helper",
    description: "Draft posts and track character count.",
    category: "Social Media",
    prompt:
      "Build a popup extension for drafting LinkedIn posts with character count, hashtag suggestions (static list), copy to clipboard, and save drafts locally.",
  },
  {
    title: "Font Size Booster",
    description: "Increase text size on any site.",
    category: "Accessibility",
    prompt:
      "Create a Manifest V3 extension with popup sliders to increase base font size on pages via content script CSS injection, with reset and persist settings in chrome.storage.",
  },
  {
    title: "High Contrast Mode",
    description: "Improve readability with high contrast themes.",
    category: "Accessibility",
    isPremium: true,
    prompt:
      "Build an accessibility extension with popup presets (high contrast, yellow on black, large text) applied via content script, toggled per site with chrome.storage sync.",
  },
  {
    title: "Focus Reader",
    description: "Dim distractions and highlight main content.",
    category: "Accessibility",
    isPremium: true,
    prompt:
      "Create an extension that dims the page except the main article element identified by common selectors, with a popup on/off toggle and adjustable dim opacity.",
  },
];
