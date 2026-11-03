import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Request parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Lyricist API is running",
  });
});

import authRoutes from "./routes/auth.routes.js";
import songRoutes from "./routes/song.routes.js";

app.use("/api/admin/auth", authRoutes);
app.use("/api/songs", songRoutes);

export default app;
