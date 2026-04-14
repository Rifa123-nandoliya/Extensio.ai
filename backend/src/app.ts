import express from "express";
import cors from "cors";
import path from "path";
import generateRoute from "./routes/generate";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/api/generate", generateRoute);

app.use(
  "/downloads",
  express.static(path.join(process.cwd(), "temp", "zips"))
);

export default app;