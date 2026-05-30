import mongoose from "mongoose";
import { logger } from "../utils/logger";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(uri, {
      dbName: "extensio",
      autoIndex: true,
    });

    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
};

export default connectDB;
