import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("5000"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  FRONTEND_URL: z.string().min(1).default("http://localhost:5173"),
  CORS_ORIGINS: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_PRO_MONTHLY: z.string().optional(),
  STRIPE_PRICE_PRO_YEARLY: z.string().optional(),
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional(),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export const validateEnv = (): Env => {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("Environment validation failed:");
    for (const issue of parsed.error.errors) {
      console.error(`  ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }

  const env = parsed.data;

  if (env.NODE_ENV === "production") {
    if (env.JWT_SECRET.length < 32) {
      console.error("JWT_SECRET must be at least 32 characters in production");
      process.exit(1);
    }

    if (!env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is required in production");
      process.exit(1);
    }

    if (!env.FRONTEND_URL.startsWith("http")) {
      console.error("FRONTEND_URL must be a valid URL in production");
      process.exit(1);
    }
  }

  cachedEnv = env;
  return env;
};

export const getEnv = (): Env => validateEnv();

export const isProduction = (): boolean =>
  getEnv().NODE_ENV === "production";

export const getAllowedOrigins = (): string[] => {
  const env = getEnv();
  const explicit = env.CORS_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (explicit?.length) {
    return explicit;
  }

  return env.FRONTEND_URL.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};
