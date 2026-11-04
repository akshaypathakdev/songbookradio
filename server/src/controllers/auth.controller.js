import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

const JWT_EXPIRES_IN = "1d";
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    }).select("+passwordHash");

    if (
      !admin ||
      !admin.passwordHash ||
      !(await bcrypt.compare(password, admin.passwordHash))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: JWT_EXPIRES_IN,
      },
    );

    res.cookie("adminToken", token, {
      ...cookieOptions,
      maxAge: COOKIE_MAX_AGE,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie("adminToken", cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};

export const getCurrentAdmin = (req, res) => {
  return res.status(200).json({
    success: true,
    admin: {
      id: req.admin.id,
      email: req.admin.email,
    },
  });
};
