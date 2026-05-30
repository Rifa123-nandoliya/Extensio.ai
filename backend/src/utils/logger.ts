import { getEnv, isProduction } from "../config/env";

type LogLevel = "debug" | "info" | "warn" | "error";

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const getMinLevel = (): LogLevel => {
  const configured = getEnv().LOG_LEVEL;
  if (configured) return configured;
  return isProduction() ? "info" : "debug";
};

const shouldLog = (level: LogLevel): boolean =>
  levelPriority[level] >= levelPriority[getMinLevel()];

const formatMessage = (
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta ? { meta } : {}),
  };

  return JSON.stringify(entry);
};

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog("debug")) {
      console.debug(formatMessage("debug", message, meta));
    }
  },
  info: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog("info")) {
      console.info(formatMessage("info", message, meta));
    }
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", message, meta));
    }
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog("error")) {
      console.error(formatMessage("error", message, meta));
    }
  },
};
