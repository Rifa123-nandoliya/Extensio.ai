import { Router } from "express";

import {
  generateExtension
} from "../controllers/generate.controller";

const router = Router();

router.post(
  "/",
  generateExtension
);

export default router;