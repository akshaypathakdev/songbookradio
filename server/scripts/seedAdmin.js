import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../src/models/admin.model.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Missing required environment variables.");
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error("Admin password must be at least 12 characters.");
    }

    await mongoose.connect(MONGODB_URI);

    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
      console.log("An admin account already exists.");
      return;
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await Admin.create({
      email: ADMIN_EMAIL.trim().toLowerCase(),
      passwordHash,
    });

    console.log("Admin account created successfully.");
  } catch (error) {
    console.error("Admin seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

seedAdmin();
