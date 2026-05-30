import morgan from "morgan";
import { logger } from "../utils/logger";
import { isProduction } from "../config/env";

const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export const requestLogger = morgan(
  isProduction() ? "combined" : "dev",
  { stream }
);
