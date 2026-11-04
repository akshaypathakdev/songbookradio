import multer from "multer";

const storage = multer.memoryStorage();

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const fileFilter = (req, file, cb) => {
  if (!allowedTypes.has(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, and WebP images are allowed."));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 20,
    parts: 21,
    fieldSize: 1024 * 1024,
  },
});

export default upload;
