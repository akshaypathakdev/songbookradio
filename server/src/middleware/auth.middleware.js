import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not configured.");

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }

  const token = req.cookies?.adminToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    if (
      !decoded ||
      typeof decoded !== "object" ||
      typeof decoded.id !== "string" ||
      typeof decoded.email !== "string" ||
      decoded.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    req.admin = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token.",
      });
    }

    return next(error);
  }
};

export default authMiddleware;
