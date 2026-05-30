import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import { verifyToken, getUserById } from "../services/auth.service";
import { AppError } from "../utils/AppError";
import { COOKIE_NAME } from "../config/jwt";

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null;

    const token = req.cookies?.[COOKIE_NAME] || bearerToken;

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const payload = verifyToken(token);
    const user = await getUserById(payload.userId);

    if (!user) {
      throw new AppError("User not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
