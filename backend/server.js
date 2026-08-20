const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const returnRoutes = require("./routes/returnRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://fashion-ecommerce-psi-red.vercel.app",
];

const envOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const allowedOrigins = new Set([...defaultOrigins, ...envOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.has(cleanOrigin) ||
        cleanOrigin.endsWith(".vercel.app") ||
        cleanOrigin.startsWith("http://localhost:") ||
        cleanOrigin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.send("Fashion E-commerce Backend Running");
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exitCode = 1;
  }
}

startServer();