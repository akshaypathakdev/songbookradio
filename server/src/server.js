import dotenv from "dotenv";
dotenv.config();

const { default: connectDB } = await import("./config/db.js");
const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 5000;

let server;
let isShuttingDown = false;

const shutdown = async (signal) => {
  if (isShuttingDown) return;

  isShuttingDown = true;
  console.log(`${signal} received. Shutting down...`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }

    const mongoose = await import("mongoose");
    await mongoose.default.connection.close();

    console.log("Server shut down successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(`Lyricist API running on port ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("HTTP server error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();
