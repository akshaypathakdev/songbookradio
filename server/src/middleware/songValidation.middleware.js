import { body, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};

// Create song validation
export const validateCreateSong = [
  body("title").trim().notEmpty().withMessage("Song title is required."),

  body("language").trim().notEmpty().withMessage("Song language is required."),

  body("singers")
    .isArray({ min: 1 })
    .withMessage("At least one singer is required."),

  body("singers.*")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Singer names cannot be empty."),

  body("lyrics").trim().notEmpty().withMessage("Lyrics are required."),

  body("albumOrMovie").optional().isString().trim(),
  body("musicDirector").optional().isString().trim(),
  body("lyricist").optional().isString().trim(),

  body("artwork").optional().isObject(),
  body("artwork.url").optional().isString().trim(),
  body("artwork.key").optional().isString().trim(),
  body("artwork.source")
    .optional()
    .isIn(["external", "upload"])
    .withMessage("Invalid artwork source."),

  handleValidationErrors,
];

// Update song validation
export const validateUpdateSong = [
  body("title").optional().trim().notEmpty(),
  body("language").optional().trim().notEmpty(),

  body("singers")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one singer is required."),

  body("singers.*").optional().isString().trim().notEmpty(),

  body("lyrics").optional().trim().notEmpty(),

  body("albumOrMovie").optional().isString().trim(),
  body("musicDirector").optional().isString().trim(),
  body("lyricist").optional().isString().trim(),

  body("artwork").optional().isObject(),
  body("artwork.url").optional().isString().trim(),
  body("artwork.key").optional().isString().trim(),
  body("artwork.source").optional().isIn(["external", "upload"]),

  handleValidationErrors,
];
