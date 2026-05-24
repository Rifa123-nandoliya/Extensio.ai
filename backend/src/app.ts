import express from "express";
import cors from "cors";
import downloadRoutes
from "./routes/download";


import generateRoute from "./routes/generate";

const app = express();

app.use(cors());

app.use(express.json());
app.use(
  "/api/download",
  downloadRoutes
);
app.use(
  "/api/generate",
  generateRoute
);

export default app;