require("dns").setDefaultResultOrder("ipv4first");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const fs = require("fs");
const path = require("path");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Core routes
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const dsaRoutes = require("./routes/dsaRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// AI routes (Ollama-based)
const resumeAIRoutes = require("./routes/resumeAIRoutes");
const chatAIRoutes = require("./routes/chatAIRoutes");
const autoProjectsRoutes = require("./routes/autoProjectsRoutes");

// Middleware
const allowedOrigins = [
  "https://notion-app-for-college-students.vercel.app",
  "https://notion-app-for-colleg-git-3fc5da-medoragomes1402-3897s-projects.vercel.app",
  "https://notion-app-for-college-students.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Core API routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/dashboard", dashboardRoutes);

// AI routes (all under one namespace)
app.use("/api/ai", resumeAIRoutes);
app.use("/api/ai", chatAIRoutes);
app.use("/api/ai", autoProjectsRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
