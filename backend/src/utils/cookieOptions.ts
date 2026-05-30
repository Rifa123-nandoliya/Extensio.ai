import { CookieOptions } from "express";
import { COOKIE_NAME } from "../config/jwt";
import { getEnv, isProduction } from "../config/env";

const resolveSameSite = (): CookieOptions["sameSite"] => {
  const configured = getEnv().COOKIE_SAME_SITE;
  if (configured) return configured;

  return isProduction() ? "none" : "lax";
};

const baseCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProduction() || resolveSameSite() === "none",
  sameSite: resolveSameSite(),
  path: "/",
});

export const authCookieOptions: CookieOptions = {
  ...baseCookieOptions(),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const clearAuthCookieOptions: CookieOptions = baseCookieOptions();

export { COOKIE_NAME };
