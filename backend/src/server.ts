import dotenv from "dotenv";
import connectDB from "./config/db";
dotenv.config({ path: "./.env" }); // FORCE PATH

console.log("Loaded key:", process.env.GROQ_API_KEY); // debug

(async () => {
  await connectDB(); // Connect to MongoDB

  const app = (await import("./app")).default;

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();