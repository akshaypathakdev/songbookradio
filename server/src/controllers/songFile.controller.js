import { pipeline } from "node:stream/promises";

import Song from "../models/song.model.js";
import { getFile } from "../services/b2.service.js";

const streamSongFile = async (req, res, song, field) => {
  try {
    const fileData = song[field];

    if (!fileData?.key) {
      return res.status(404).json({
        success: false,
        message: "Song file not found.",
      });
    }

    const file = await getFile(fileData.key);

    res.set({
      "Content-Type": fileData.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    });

    await pipeline(file.Body, res);
  } catch (error) {
    console.error(`Failed to retrieve song ${field}:`, error);

    if (res.headersSent) {
      return res.destroy(error);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve song file.",
    });
  }
};

// Get lyrics
export const getSongLyrics = async (req, res) => {
  try {
    const song = await Song.findOne({ slug: req.params.slug });

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found.",
      });
    }

    return streamSongFile(req, res, song, "lyrics");
  } catch (error) {
    console.error("Failed to retrieve song lyrics:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve song lyrics.",
    });
  }
};

// Get artwork
export const getSongArtwork = async (req, res) => {
  try {
    const song = await Song.findOne({ slug: req.params.slug });

    if (!song?.artwork) {
      return res.status(404).json({
        success: false,
        message: "Song artwork not found.",
      });
    }

    // External artwork
    if (song.artwork.source === "external" && song.artwork.url) {
      let artworkUrl;

      try {
        artworkUrl = new URL(song.artwork.url);
      } catch {
        return res.status(500).json({
          success: false,
          message: "Invalid artwork URL.",
        });
      }

      if (!["http:", "https:"].includes(artworkUrl.protocol)) {
        return res.status(500).json({
          success: false,
          message: "Invalid artwork URL.",
        });
      }

      res.set("Cache-Control", "public, max-age=3600");

      return res.redirect(302, artworkUrl.href);
    }

    // Uploaded artwork, including older records without source
    if (song.artwork.key) {
      return streamSongFile(req, res, song, "artwork");
    }

    return res.status(404).json({
      success: false,
      message: "Song artwork not found.",
    });
  } catch (error) {
    console.error("Failed to retrieve song artwork:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve song artwork.",
    });
  }
};
