import express from "express";
import {
  createSong,
  getSongs,
  getSongBySlug,
  updateSong,
  deleteSong,
} from "../controllers/songController.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  validateCreateSong,
  validateUpdateSong,
} from "../middleware/songValidation.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getSongs);
router.get("/:slug", getSongBySlug);

// Protected admin routes
router.post("/", authMiddleware, validateCreateSong, createSong);

router.patch("/:id", authMiddleware, validateUpdateSong, updateSong);

router.delete("/:id", authMiddleware, deleteSong);

export default router;
