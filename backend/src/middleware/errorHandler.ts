import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { isProduction } from "../config/env";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier";
  } else if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON payload";
  } else if (!isProduction()) {
    message = err.message || message;
  }

  logger.error("Request failed", {
    statusCode,
    message: err.message,
    path: req.originalUrl,
    method: req.method,
    ...(isProduction() ? {} : { stack: err.stack }),
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction() ? {} : { stack: err.stack }),
  });
};
