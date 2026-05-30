import { validateEnv } from "./config/env";
import connectDB from "./config/db";
import app from "./app";
import { seedBuiltinTemplates } from "./services/template.service";
import { logger } from "./utils/logger";

validateEnv();

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    await seedBuiltinTemplates();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", {
      message: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
})();
