const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Import JWT utilities
const { verifyJWT, optionalJWT } = require("./utils/verifyJWT");
const {
  verifyAdmin,
  verifyUserOrAdmin,
  verifyTokenOwnership,
} = require("./utils/authMiddleware");
const {
  generateTokenPair,
  verifyRefreshToken,
} = require("./utils/tokenGenerator");

const app = express();

// Security middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =============================================================================
// PUBLIC ROUTES (No authentication required)
// =============================================================================

app.get("/", (req, res) => {
  res.json({
    message: "JWT Authentication Template API",
    version: "1.0.0",
    documentation: "/docs",
  });
});

// Login endpoint - Generate tokens
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // TODO: Implement your user validation logic here
    // Example: const user = await User.findByEmailAndPassword(email, password);

    // Mock user validation (replace with your database logic)
    if (email === "admin@example.com" && password === "admin123") {
      const user = {
        id: 1,
        email: "admin@example.com",
        username: "admin",
        role: "admin",
      };

      const tokens = generateTokenPair({
        userLogin: user,
        roles: ["admin", "user"],
        permissions: ["read", "write", "delete"],
      });

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        ...tokens,
      });
    } else if (email === "user@example.com" && password === "user123") {
      const user = {
        id: 2,
        email: "user@example.com",
        username: "user",
        role: "user",
      };

      const tokens = generateTokenPair({
        userLogin: user,
        roles: ["user"],
        permissions: ["read"],
      });

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        ...tokens,
      });
    } else {
      res.status(401).json({
        error: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error during login",
    });
  }
});

// Refresh token endpoint
app.post("/api/auth/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token required",
      });
    }

    const decoded = await verifyRefreshToken(refreshToken);

    // Generate new access token
    const newTokens = generateTokenPair({
      userLogin: decoded.userLogin,
      roles: decoded.roles,
      permissions: decoded.permissions,
    });

    res.json({
      message: "Tokens refreshed successfully",
      ...newTokens,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(403).json({
      error: "Invalid refresh token",
    });
  }
});

// =============================================================================
// PUBLIC ROUTES WITH OPTIONAL AUTH
// =============================================================================

// Public route that works better with authentication
app.get("/api/public", optionalJWT, (req, res) => {
  const message = req.user
    ? `Welcome back, ${req.user.email || req.user.username}!`
    : "Welcome, guest user!";

  res.json({
    message,
    authenticated: !!req.user,
    user: req.user || null,
  });
});

// =============================================================================
// PROTECTED ROUTES (Authentication required)
// =============================================================================

// Basic protected route
app.get("/api/profile", verifyJWT, (req, res) => {
  res.json({
    message: "Profile data retrieved successfully",
    user: req.user,
  });
});

// Update profile (users can only update their own)
app.put(
  "/api/users/:userId/profile",
  verifyTokenOwnership("userId"),
  (req, res) => {
    const { userId } = req.params;
    const { name, bio } = req.body;

    // TODO: Implement profile update logic
    res.json({
      message: "Profile updated successfully",
      userId: userId,
      updates: { name, bio },
    });
  }
);

// =============================================================================
// ADMIN ONLY ROUTES
// =============================================================================

// Admin dashboard
app.get("/api/admin/dashboard", verifyAdmin, (req, res) => {
  res.json({
    message: "Admin dashboard data",
    stats: {
      totalUsers: 150,
      activeUsers: 45,
      totalRequests: 1250,
    },
  });
});

// Get all users (admin only)
app.get("/api/admin/users", verifyAdmin, (req, res) => {
  // TODO: Implement get all users logic
  res.json({
    message: "All users retrieved successfully",
    users: [
      { id: 1, email: "admin@example.com", role: "admin" },
      { id: 2, email: "user@example.com", role: "user" },
    ],
  });
});

// Delete user (admin only)
app.delete("/api/admin/users/:userId", verifyAdmin, (req, res) => {
  const { userId } = req.params;

  // TODO: Implement user deletion logic
  res.json({
    message: `User ${userId} deleted successfully`,
  });
});

// =============================================================================
// USER OR ADMIN ROUTES
// =============================================================================

// Dashboard accessible by users and admins
app.get("/api/dashboard", verifyUserOrAdmin, (req, res) => {
  const isAdmin = req.user.roles?.includes("admin");

  res.json({
    message: "Dashboard data retrieved successfully",
    data: isAdmin ? "Admin dashboard data" : "User dashboard data",
    userRole: req.user.roles || req.user.role,
  });
});

// =============================================================================
// ERROR HANDLING MIDDLEWARE
// =============================================================================

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// =============================================================================
// SERVER STARTUP
// =============================================================================

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📄 Environment: ${NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);

  // Development helpers
  if (NODE_ENV === "development") {
    console.log("\n🔑 Test credentials:");
    console.log("Admin: admin@example.com / admin123");
    console.log("User:  user@example.com / user123");
    console.log("\n📝 Example requests:");
    console.log(`POST http://localhost:${PORT}/api/auth/login`);
    console.log(
      `GET  http://localhost:${PORT}/api/profile (with Bearer token)`
    );
    console.log(
      `GET  http://localhost:${PORT}/api/admin/dashboard (admin only)`
    );
  }
});

module.exports = app;
