import express from "express";
import { rateLimit } from "express-rate-limit";

import {
  login,
  logout,
  getCurrentAdmin,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

// Public route
router.post("/login", loginLimiter, login);

// Protected routes
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getCurrentAdmin);

export default router;
