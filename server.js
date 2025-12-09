// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/user.routes.js";
import nutritionRoutes from "./routes/nutrition.routes.js";

// Load environment variables FIRST
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ⭐ REQUIRED FOR RENDER

// Routes
app.use("/api/users", userRoutes);
app.use("/api/nutrition", nutritionRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Nutrition Tracker API is running...");
});

// Use Render's port OR local port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
