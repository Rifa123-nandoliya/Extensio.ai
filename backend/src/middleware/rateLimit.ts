import rateLimit from "express-rate-limit";
import { isProduction } from "../config/env";

const jsonMessage = (message: string) => ({
  success: false,
  message,
});

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction() ? 300 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonMessage("Too many requests. Please try again later."),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction() ? 15 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: jsonMessage("Too many authentication attempts. Please try again later."),
});

export const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isProduction() ? 40 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonMessage("Generation rate limit exceeded. Please try again later."),
});
