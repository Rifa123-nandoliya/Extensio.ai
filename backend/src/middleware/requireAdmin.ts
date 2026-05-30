import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import { AppError } from "../utils/AppError";

export const requireAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  if (req.user.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }

  next();
};
