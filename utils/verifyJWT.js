const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Middleware to verify JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Access denied. No token provided or invalid format.",
        message: 'Authorization header must start with "Bearer "',
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        const errorMessage =
          err.name === "TokenExpiredError"
            ? "Token has expired"
            : "Invalid token";

        return res.status(403).json({
          error: errorMessage,
          type: err.name,
        });
      }

      // Support both userLogin and user properties for flexibility
      req.user = decoded.userLogin || decoded.user || decoded;
      next();
    });
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(500).json({
      error: "Internal server error during token verification.",
    });
  }
};

/**
 * Optional middleware for routes that work with or without authentication
 */
const optionalJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      req.user = null;
    } else {
      req.user = decoded.userLogin || decoded.user || decoded;
    }
    next();
  });
};

module.exports = { verifyJWT, optionalJWT };
