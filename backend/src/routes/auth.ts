import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimit";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/register", authLimiter, asyncHandler(register));
router.post("/login", authLimiter, asyncHandler(login));
router.post("/logout", logout);
router.get("/me", authenticate, getCurrentUser);

export default router;
