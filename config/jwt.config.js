require("dotenv").config();

/**
 * JWT Configuration settings
 * Centralized configuration for JWT tokens
 */
module.exports = {
  // Main JWT token settings
  TOKEN_SECRET:
    process.env.TOKEN_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production",
  TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION || "1h",

  // Refresh token settings
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET ||
    "your-super-secret-refresh-key-change-this-in-production",
  REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION || "7d",

  // Token issuer and audience (optional)
  ISSUER: process.env.JWT_ISSUER || "your-app-name",
  AUDIENCE: process.env.JWT_AUDIENCE || "your-app-users",

  // Algorithm for signing tokens
  ALGORITHM: "HS256",
};
