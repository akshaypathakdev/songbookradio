import { randomUUID } from "node:crypto";

import Song from "../models/song.model.js";
import { uploadFile, deleteFile } from "../services/b2.service.js";

// Generate URL-friendly slug
const generateSlug = (title) => {
  return (
    title
      .normalize("NFC")
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "song"
  );
};

// Generate unique slug
const generateUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (
    await Song.exists({
      slug,
      ...(excludeId && { _id: { $ne: excludeId } }),
    })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};

// Escape special regex characters
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Parse singers from multipart form data
const parseSingers = (singers) => {
  if (typeof singers === "string") {
    try {
      singers = JSON.parse(singers);
    } catch {
      singers = [singers];
    }
  }

  if (!Array.isArray(singers)) {
    throw new Error("Singers must be an array.");
  }

  return singers
    .filter((singer) => typeof singer === "string")
    .map((singer) => singer.trim())
    .filter(Boolean);
};

// Validate external artwork URL
const isValidArtworkUrl = (value) => {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

// Upload lyrics to B2
const uploadLyrics = async (lyrics, slug) => {
  const key = `songs/${slug}/lyrics-${randomUUID()}.md`;

  await uploadFile({
    key,
    body: Buffer.from(lyrics, "utf-8"),
    contentType: "text/markdown; charset=utf-8",
  });

  return {
    key,
    contentType: "text/markdown",
  };
};

// Upload artwork to B2
const uploadArtwork = async (file, slug) => {
  const extensions = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };

  const extension = extensions[file.mimetype];

  if (!extension) {
    throw new Error("Unsupported artwork format.");
  }

  const key = `songs/${slug}/artwork-${randomUUID()}${extension}`;

  await uploadFile({
    key,
    body: file.buffer,
    contentType: file.mimetype,
  });

  return {
    source: "upload",
    key,
    contentType: file.mimetype,
  };
};

// Safely delete old B2 files
const cleanupFiles = async (keys) => {
  for (const key of keys) {
    if (!key) continue;

    try {
      await deleteFile(key);
    } catch (error) {
      console.error(`Failed to delete B2 file ${key}:`, error.message);
    }
  }
};

// Handle common errors
const handleError = (res, error, message) => {
  console.error(message, error);

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid song data.",
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A song with this unique value already exists.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
};

// Create song
export const createSong = async (req, res) => {
  const uploadedKeys = [];

  try {
    const {
      title,
      language,
      albumOrMovie,
      musicDirector,
      singers,
      lyrics,
      lyricist,
      artworkUrl,
    } = req.body;

    const parsedSingers = parseSingers(singers);

    if (parsedSingers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one singer is required.",
      });
    }

    if (!lyrics?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Lyrics are required.",
      });
    }

    if (req.file && artworkUrl?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Provide either an artwork upload or an artwork URL, not both.",
      });
    }

    if (artworkUrl?.trim() && !isValidArtworkUrl(artworkUrl.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid HTTP or HTTPS artwork URL.",
      });
    }

    const slug = await generateUniqueSlug(title);

    const lyricsFile = await uploadLyrics(lyrics, slug);
    uploadedKeys.push(lyricsFile.key);

    let artworkData;

    if (req.file) {
      artworkData = await uploadArtwork(req.file, slug);
      uploadedKeys.push(artworkData.key);
    } else if (artworkUrl?.trim()) {
      artworkData = {
        source: "external",
        url: artworkUrl.trim(),
      };
    }

    const song = await Song.create({
      title,
      slug,
      language,
      albumOrMovie,
      musicDirector,
      singers: parsedSingers,
      artwork: artworkData,
      lyrics: lyricsFile,
      lyricist,
    });

    return res.status(201).json({
      success: true,
      message: "Song created successfully.",
      song,
    });
  } catch (error) {
    await cleanupFiles(uploadedKeys);
    return handleError(res, error, "Create song failed:");
  }
};

// Get all songs with search and pagination
export const getSongs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10),
    );

    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();

    const filter = search
      ? {
          $or: [
            { title: { $regex: escapeRegex(search), $options: "i" } },
            { singers: { $regex: escapeRegex(search), $options: "i" } },
            { albumOrMovie: { $regex: escapeRegex(search), $options: "i" } },
            { musicDirector: { $regex: escapeRegex(search), $options: "i" } },
            { lyricist: { $regex: escapeRegex(search), $options: "i" } },
          ],
        }
      : {};

    const [songs, totalSongs] = await Promise.all([
      Song.find(filter)
        .select("-lyrics")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Song.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalSongs / limit);

    return res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages,
        totalSongs,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      songs,
    });
  } catch (error) {
    return handleError(res, error, "Fetch songs failed:");
  }
};

// Get song by slug
export const getSongBySlug = async (req, res) => {
  try {
    const song = await Song.findOne({ slug: req.params.slug });

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found.",
      });
    }

    return res.status(200).json({
      success: true,
      song,
    });
  } catch (error) {
    return handleError(res, error, "Fetch song failed:");
  }
};

// Update song
export const updateSong = async (req, res) => {
  const uploadedKeys = [];

  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found.",
      });
    }

    const oldKeys = [];

    if (req.body.title !== undefined) {
      song.title = req.body.title;
      song.slug = await generateUniqueSlug(req.body.title, song._id);
    }

    const allowedFields = [
      "language",
      "albumOrMovie",
      "musicDirector",
      "lyricist",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        song[field] = req.body[field];
      }
    }

    if (req.body.singers !== undefined) {
      const parsedSingers = parseSingers(req.body.singers);

      if (parsedSingers.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one singer is required.",
        });
      }

      song.singers = parsedSingers;
    }

    if (req.body.lyrics !== undefined) {
      if (!req.body.lyrics.trim()) {
        return res.status(400).json({
          success: false,
          message: "Lyrics cannot be empty.",
        });
      }

      const newLyrics = await uploadLyrics(req.body.lyrics, song.slug);
      uploadedKeys.push(newLyrics.key);

      oldKeys.push(song.lyrics.key);
      song.lyrics = newLyrics;
    }

    const artworkUrlProvided = req.body.artworkUrl !== undefined;
    const artworkUrl = req.body.artworkUrl?.trim();

    if (req.file && artworkUrlProvided && artworkUrl) {
      return res.status(400).json({
        success: false,
        message:
          "Provide either an artwork upload or an artwork URL, not both.",
      });
    }

    if (artworkUrlProvided && artworkUrl && !isValidArtworkUrl(artworkUrl)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid HTTP or HTTPS artwork URL.",
      });
    }

    const oldArtworkKey = song.artwork?.key;

    if (req.file) {
      const newArtwork = await uploadArtwork(req.file, song.slug);
      uploadedKeys.push(newArtwork.key);

      if (oldArtworkKey) {
        oldKeys.push(oldArtworkKey);
      }

      song.artwork = newArtwork;
    } else if (artworkUrlProvided) {
      if (oldArtworkKey) {
        oldKeys.push(oldArtworkKey);
      }

      song.artwork = artworkUrl
        ? {
            source: "external",
            url: artworkUrl,
          }
        : undefined;
    } else if (req.body.removeArtwork === "true") {
      if (oldArtworkKey) {
        oldKeys.push(oldArtworkKey);
      }

      song.artwork = undefined;
    }

    await song.save();

    // Delete old files only after the database update succeeds
    await cleanupFiles(oldKeys);

    return res.status(200).json({
      success: true,
      message: "Song updated successfully.",
      song,
    });
  } catch (error) {
    await cleanupFiles(uploadedKeys);
    return handleError(res, error, "Update song failed:");
  }
};

// Delete song
export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found.",
      });
    }

    await cleanupFiles([song.artwork?.key, song.lyrics?.key]);

    return res.status(200).json({
      success: true,
      message: "Song deleted successfully.",
    });
  } catch (error) {
    return handleError(res, error, "Delete song failed:");
  }
};
