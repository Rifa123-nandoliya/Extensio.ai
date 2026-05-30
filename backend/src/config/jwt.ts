export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
};

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const COOKIE_NAME = "token";
