const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config");

/**
 * Generate access token
 * @param {Object} payload - User data to encode in the token
 * @param {Object} options - Additional options for token generation
 * @returns {string} JWT access token
 */
const generateAccessToken = (payload, options = {}) => {
  const tokenPayload = {
    ...payload,
    type: "access",
  };

  const signOptions = {
    expiresIn: options.expiresIn || jwtConfig.TOKEN_EXPIRATION,
    issuer: jwtConfig.ISSUER,
    audience: jwtConfig.AUDIENCE,
    algorithm: jwtConfig.ALGORITHM,
  };

  return jwt.sign(tokenPayload, jwtConfig.TOKEN_SECRET, signOptions);
};

/**
 * Generate refresh token
 * @param {Object} payload - User data to encode in the token
 * @param {Object} options - Additional options for token generation
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload, options = {}) => {
  const tokenPayload = {
    ...payload,
    type: "refresh",
  };

  const signOptions = {
    expiresIn: options.expiresIn || jwtConfig.REFRESH_TOKEN_EXPIRATION,
    issuer: jwtConfig.ISSUER,
    audience: jwtConfig.AUDIENCE,
    algorithm: jwtConfig.ALGORITHM,
  };

  return jwt.sign(tokenPayload, jwtConfig.REFRESH_TOKEN_SECRET, signOptions);
};

/**
 * Generate both access and refresh tokens
 * @param {Object} payload - User data to encode
 * @returns {Object} Object containing both tokens
 */
const generateTokenPair = (payload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    tokenType: "Bearer",
    expiresIn: jwtConfig.TOKEN_EXPIRATION,
  };
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {Promise} Promise that resolves with decoded token or rejects with error
 */
const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtConfig.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else if (decoded.type !== "refresh") {
        reject(new Error("Invalid token type"));
      } else {
        resolve(decoded);
      }
    });
  });
};

/**
 * Decode token without verification (for debugging purposes)
 * @param {string} token - Token to decode
 * @returns {Object|null} Decoded token or null if invalid
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyRefreshToken,
  decodeToken,
};
