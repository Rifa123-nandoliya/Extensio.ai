export const USAGE_EVENT_TYPES = [
  "generation",
  "download",
  "template_use",
  "template_publish",
  "chat_message",
  "project_share",
  "version_restore",
  "referral_signup",
  "login",
] as const;

export type UsageEventType = (typeof USAGE_EVENT_TYPES)[number];
