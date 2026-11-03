import Song from "../models/Song.js";

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

// Escape special regex characters in search input
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Handle common database errors
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
  try {
    const {
      title,
      language,
      albumOrMovie,
      musicDirector,
      singers,
      artwork,
      lyrics,
      lyricist,
    } = req.body;

    const slug = await generateUniqueSlug(title);

    const song = await Song.create({
      title,
      slug,
      language,
      albumOrMovie,
      musicDirector,
      singers,
      artwork,
      lyrics,
      lyricist,
    });

    return res.status(201).json({
      success: true,
      message: "Song created successfully.",
      song,
    });
  } catch (error) {
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
      Song.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),

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
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found.",
      });
    }

    const allowedFields = [
      "title",
      "language",
      "albumOrMovie",
      "musicDirector",
      "singers",
      "artwork",
      "lyrics",
      "lyricist",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        song[field] = req.body[field];
      }
    }

    if (req.body.title !== undefined) {
      song.slug = await generateUniqueSlug(req.body.title, song._id);
    }

    await song.save();

    return res.status(200).json({
      success: true,
      message: "Song updated successfully.",
      song,
    });
  } catch (error) {
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

    return res.status(200).json({
      success: true,
      message: "Song deleted successfully.",
    });
  } catch (error) {
    return handleError(res, error, "Delete song failed:");
  }
};
