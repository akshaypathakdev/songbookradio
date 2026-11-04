import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import songRoutes from "./routes/song.routes.js";

const app = express();

if (!process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL is not defined.");
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
    parameterLimit: 100,
  }),
);

app.use(cookieParser());

// Health check / database readiness
app.get("/api/health", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;

  return res.status(databaseReady ? 200 : 503).json({
    success: databaseReady,
    message: databaseReady
      ? "Lyricist API is running"
      : "Database connection is unavailable",
  });
});

// Routes
app.use("/api/admin/auth", authRoutes);
app.use("/api/songs", songRoutes);

// Unmatched routes
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Centralized error handler
app.use((error, req, res, next) => {
  console.error("API Error:", error);

  if (res.headersSent) {
    return next(error);
  }

  // Multer errors
  if (error.name === "MulterError") {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;

    return res.status(status).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Uploaded file exceeds the allowed size."
          : "File upload failed.",
    });
  }

  // Request body errors
  if (error.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request payload is too large.",
    });
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid request body.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

export default app;
