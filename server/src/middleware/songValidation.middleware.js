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

// Convert multipart singers string into an array
const parseSingers = (value) => {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const validateCreateSong = [
  body("title")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Song title is required."),

  body("language")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Song language is required."),

  body("singers")
    .customSanitizer(parseSingers)
    .isArray({ min: 1 })
    .withMessage("At least one singer is required."),

  body("singers.*")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Singer names cannot be empty."),

  body("lyrics")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Lyrics are required."),

  body("albumOrMovie").optional().isString().trim(),
  body("musicDirector").optional().isString().trim(),
  body("lyricist").optional().isString().trim(),

  handleValidationErrors,
];

export const validateUpdateSong = [
  body("title").optional().isString().trim().notEmpty(),
  body("language").optional().isString().trim().notEmpty(),

  body("singers")
    .optional()
    .customSanitizer(parseSingers)
    .isArray({ min: 1 })
    .withMessage("At least one singer is required."),

  body("singers.*").optional().isString().trim().notEmpty(),

  body("lyrics").optional().isString().trim().notEmpty(),

  body("albumOrMovie").optional().isString().trim(),
  body("musicDirector").optional().isString().trim(),
  body("lyricist").optional().isString().trim(),

  handleValidationErrors,
];
