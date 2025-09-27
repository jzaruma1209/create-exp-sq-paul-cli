const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config");

/**
 * Middleware to verify JWT tokens with role-based access
 * @param {Array|string} allowedRoles - Roles allowed to access the route
 * @returns {Function} Middleware function
 */
const verifyJWTWithRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
          error: "Access denied. No token provided or invalid format.",
          message: 'Authorization header must start with "Bearer "',
        });
      }

      const token = authHeader.split(" ")[1];

      jwt.verify(token, jwtConfig.TOKEN_SECRET, (err, decoded) => {
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

        // Check if user has required role
        const userRoles = decoded.roles || decoded.role || [];
        const rolesArray = Array.isArray(allowedRoles)
          ? allowedRoles
          : [allowedRoles];

        if (rolesArray.length > 0) {
          const hasRequiredRole = rolesArray.some((role) =>
            Array.isArray(userRoles)
              ? userRoles.includes(role)
              : userRoles === role
          );

          if (!hasRequiredRole) {
            return res.status(403).json({
              error: "Access denied. Insufficient permissions.",
              requiredRoles: rolesArray,
              userRoles: userRoles,
            });
          }
        }

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
};

/**
 * Middleware to verify admin access
 */
const verifyAdmin = verifyJWTWithRoles(["admin", "administrator"]);

/**
 * Middleware to verify user or admin access
 */
const verifyUserOrAdmin = verifyJWTWithRoles([
  "user",
  "admin",
  "administrator",
]);

/**
 * Middleware to verify token ownership (user can only access their own data)
 * @param {string} userIdParam - Parameter name in the request that contains the user ID
 */
const verifyTokenOwnership = (userIdParam = "userId") => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
          error: "Access denied. No token provided or invalid format.",
        });
      }

      const token = authHeader.split(" ")[1];

      jwt.verify(token, jwtConfig.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({
            error: "Invalid token.",
          });
        }

        const tokenUserId =
          (decoded.userLogin && decoded.userLogin.id) ||
          (decoded.user && decoded.user.id) ||
          decoded.userId ||
          decoded.id;

        const requestUserId = req.params[userIdParam] || req.body[userIdParam];

        // Allow admin access or owner access
        const isAdmin =
          decoded.roles?.includes("admin") || decoded.role === "admin";

        if (!isAdmin && tokenUserId != requestUserId) {
          return res.status(403).json({
            error: "Access denied. You can only access your own data.",
          });
        }

        req.user = decoded.userLogin || decoded.user || decoded;
        next();
      });
    } catch (error) {
      console.error("JWT Ownership Verification Error:", error);
      return res.status(500).json({
        error: "Internal server error during token verification.",
      });
    }
  };
};

module.exports = {
  verifyJWTWithRoles,
  verifyAdmin,
  verifyUserOrAdmin,
  verifyTokenOwnership,
};
