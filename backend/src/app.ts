import express from "express";
import cors from "cors";
import path from "path";
import generateRoute from "./routes/generate";
import projectRoutes from "./routes/project";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/api/generate", generateRoute);

app.use(
  "/downloads",
  express.static(path.join(process.cwd(), "temp", "zips"))
);

export default app;