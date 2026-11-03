import express from "express";

import {
  createSong,
  getSongs,
  getSongBySlug,
  updateSong,
  deleteSong,
} from "../controllers/song.controller.js";

import {
  getSongLyrics,
  getSongArtwork,
} from "../controllers/songFile.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

import {
  validateCreateSong,
  validateUpdateSong,
} from "../middleware/songValidation.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getSongs);
router.get("/:slug/lyrics", getSongLyrics);
router.get("/:slug/artwork", getSongArtwork);
router.get("/:slug", getSongBySlug);

// Protected admin routes
router.post(
  "/",
  authMiddleware,
  upload.single("artwork"),
  validateCreateSong,
  createSong,
);

router.patch(
  "/:id",
  authMiddleware,
  upload.single("artwork"),
  validateUpdateSong,
  updateSong,
);

router.delete("/:id", authMiddleware, deleteSong);

export default router;
