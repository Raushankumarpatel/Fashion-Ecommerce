const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const returnRoutes = require("./routes/returnRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",

  // Vercel frontend
  "https://fashion-ecommerce-kvzk.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without Origin
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/$/, "");

      // Exact match
      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      // Allow Vercel preview/production deployments
      if (cleanOrigin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // Allow localhost during development
      if (
        cleanOrigin.startsWith("http://localhost:") ||
        cleanOrigin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", cleanOrigin);

      return callback(null, false);
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],

    optionsSuccessStatus: 204,
  })
);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/auth", userRoutes);

// ==========================================
// ROOT ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.status(200).send("Fashion E-commerce Backend Running");
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==========================================
// MONGODB + SERVER
// ==========================================

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is missing");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
