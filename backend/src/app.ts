import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import generateRoute from "./routes/generate";
import projectRoutes from "./routes/project";
import downloadRoutes from "./routes/download";
import downloadHistoryRoutes from "./routes/downloadHistory";
import authRoutes from "./routes/auth";
import templateRoutes from "./routes/template";
import billingRoutes from "./routes/billing";
import stripeWebhookRoutes from "./routes/stripeWebhook";
import workspaceRoutes from "./routes/workspace";
import marketplaceRoutes from "./routes/marketplace";
import chatRoutes from "./routes/chat";
import analyticsRoutes from "./routes/analytics";
import adminRoutes from "./routes/admin";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFound";
import { requestLogger } from "./middleware/requestLogger";
import { globalLimiter } from "./middleware/rateLimit";
import { authenticate } from "./middleware/auth.middleware";
import { requireAdmin } from "./middleware/requireAdmin";
import { getAllowedOrigins, isProduction } from "./config/env";

const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(requestLogger);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = getAllowedOrigins();

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookRoutes
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(globalLimiter);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: isProduction() ? "production" : "development",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/billing", authenticate, billingRoutes);
app.use("/api/workspaces", authenticate, workspaceRoutes);
app.use("/api/marketplace", authenticate, marketplaceRoutes);
app.use("/api/chat", authenticate, chatRoutes);
app.use("/api/analytics", authenticate, analyticsRoutes);
app.use("/api/admin", authenticate, requireAdmin, adminRoutes);
app.use("/api/templates", authenticate, templateRoutes);
app.use("/api/projects", authenticate, projectRoutes);
app.use("/api/generate", authenticate, generateRoute);
app.use("/api/downloads", authenticate, downloadHistoryRoutes);
app.use("/api/download", authenticate, downloadRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Extensio AI API is running" });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
