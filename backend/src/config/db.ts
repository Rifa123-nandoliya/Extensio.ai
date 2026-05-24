import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error(
      "MONGO_URI is not defined in environment variables"
    );
  }

  try {
    await mongoose.connect(uri, {
      dbName: "extensio",
      autoIndex: true,
    });

    console.log("MongoDB connected");
  } catch (error: any) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

export default connectDB;