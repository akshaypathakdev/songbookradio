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

const validateOptionalString = (field, maxLength = 150) =>
  body(field)
    .optional()
    .isString()
    .withMessage(`${field} must be a string.`)
    .bail()
    .trim()
    .isLength({ max: maxLength })
    .withMessage(`${field} cannot exceed ${maxLength} characters.`);

const validateArtworkUrl = () =>
  body("artworkUrl")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("Artwork URL must be a string.")
    .bail()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
    })
    .withMessage("Artwork URL must be a valid HTTP or HTTPS URL.");

export const validateCreateSong = [
  body("title")
    .isString()
    .withMessage("Song title must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Song title is required.")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Song title cannot exceed 200 characters."),

  body("language")
    .isString()
    .withMessage("Language must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Song language is required.")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Language cannot exceed 50 characters."),

  body("singers")
    .customSanitizer(parseSingers)
    .isArray({ min: 1, max: 20 })
    .withMessage("Provide between 1 and 20 singers."),

  body("singers.*")
    .isString()
    .withMessage("Singer names must be strings.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Singer names cannot be empty.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Singer names cannot exceed 100 characters."),

  body("lyrics")
    .isString()
    .withMessage("Lyrics must be a string.")
    .bail()
    .custom((value) => value.trim().length > 0)
    .withMessage("Lyrics are required."),

  validateOptionalString("albumOrMovie"),
  validateOptionalString("musicDirector"),
  validateOptionalString("lyricist"),

  validateArtworkUrl(),

  handleValidationErrors,
];

export const validateUpdateSong = [
  body().custom((value, { req }) => {
    const allowedFields = [
      "title",
      "language",
      "singers",
      "lyrics",
      "albumOrMovie",
      "musicDirector",
      "lyricist",
      "artworkUrl",
      "removeArtwork",
    ];

    const receivedFields = Object.keys(value);

    const unknownFields = receivedFields.filter(
      (field) => !allowedFields.includes(field),
    );

    if (unknownFields.length > 0) {
      throw new Error(`Unsupported fields: ${unknownFields.join(", ")}`);
    }

    if (receivedFields.length === 0 && !req.file) {
      throw new Error("Provide at least one field to update.");
    }

    return true;
  }),

  body("title")
    .optional()
    .isString()
    .withMessage("Song title must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Song title cannot be empty.")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Song title cannot exceed 200 characters."),

  body("language")
    .optional()
    .isString()
    .withMessage("Language must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Song language cannot be empty.")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Language cannot exceed 50 characters."),

  body("singers")
    .optional()
    .customSanitizer(parseSingers)
    .isArray({ min: 1, max: 20 })
    .withMessage("Provide between 1 and 20 singers."),

  body("singers.*")
    .optional()
    .isString()
    .withMessage("Singer names must be strings.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Singer names cannot be empty.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Singer names cannot exceed 100 characters."),

  body("lyrics")
    .optional()
    .isString()
    .withMessage("Lyrics must be a string.")
    .bail()
    .custom((value) => value.trim().length > 0)
    .withMessage("Lyrics cannot be empty."),

  validateOptionalString("albumOrMovie"),
  validateOptionalString("musicDirector"),
  validateOptionalString("lyricist"),

  validateArtworkUrl(),

  body("removeArtwork")
    .optional()
    .isIn(["true", "false"])
    .withMessage('removeArtwork must be either "true" or "false".'),

  handleValidationErrors,
];
