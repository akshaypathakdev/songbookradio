import Song from "../models/song.model.js";
import { getFile } from "../services/b2.service.js";

const streamSongFile = async (req, res, field) => {
  try {
    const song = await Song.findOne({ slug: req.params.slug });

    if (!song || !song[field]?.key) {
      return res.status(404).json({
        success: false,
        message: "Song file not found.",
      });
    }

    const file = await getFile(song[field].key);

    res.set({
      "Content-Type": song[field].contentType,
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    });

    file.Body.pipe(res);
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

export const getSongLyrics = (req, res) =>
  streamSongFile(req, res, "lyrics");

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
      return res.redirect(302, song.artwork.url);
    }

    // Uploaded artwork (including older records without source)
    if (song.artwork.key) {
      return streamSongFile(req, res, "artwork");
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
