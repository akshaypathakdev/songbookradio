import express from "express";
import {
  login,
  logout,
  getCurrentAdmin,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route
router.post("/login", login);

// Protected routes
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getCurrentAdmin);

export default router;
