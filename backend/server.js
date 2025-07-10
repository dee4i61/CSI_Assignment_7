// server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const socketIO = require("socket.io");

dotenv.config();

const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/fileRoutes");
const userRoutes = require("./routes/userRoutes");
const socketHandler = require("./socketHandler");

const app = express();
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Use external socket handler
socketHandler(io); // 👈 This replaces the old inline Socket.IO logic

// Make io accessible in routes if needed
app.set("io", io);

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
