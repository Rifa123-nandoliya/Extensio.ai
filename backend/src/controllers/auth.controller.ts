import { Response } from "express";
import { AuthRequest } from "../types/express";
import {
  registerUser,
  loginUser,
  signToken,
} from "../services/auth.service";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { AppError } from "../utils/AppError";
import {
  authCookieOptions,
  clearAuthCookieOptions,
  COOKIE_NAME,
} from "../utils/cookieOptions";

export const register = async (req: AuthRequest, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors[0]?.message || "Invalid input",
    });
  }

  const user = await registerUser({
    ...parsed.data,
    referralCode: req.body?.referralCode,
  });
  const token = signToken(user.id);

  res.cookie(COOKIE_NAME, token, authCookieOptions);

  res.status(201).json({
    success: true,
    user,
  });
};

export const login = async (req: AuthRequest, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors[0]?.message || "Invalid input",
    });
  }

  const user = await loginUser(parsed.data);
  const token = signToken(user.id);

  res.cookie(COOKIE_NAME, token, authCookieOptions);

  res.status(200).json({
    success: true,
    user,
  });
};

export const logout = (_req: AuthRequest, res: Response) => {
  res.clearCookie(COOKIE_NAME, clearAuthCookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getCurrentUser = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
};
