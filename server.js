const express      = require("express");
const http         = require("http");
const cors         = require("cors");
const env          = require("./src/config/env");
const connectDB    = require("./src/config/db");
const { initSocket } = require("./src/config/socket");
const errorMiddleware = require("./src/middlewares/error.middleware");
require("dotenv").config();
// Route modules
const authRoutes      = require("./src/modules/auth/auth.routes");
const userRoutes      = require("./src/modules/users/user.routes");
const profileRoutes   = require("./src/modules/profile/profile.routes");
const taskRoutes      = require("./src/modules/tasks/task.routes");
const commentRoutes   = require("./src/modules/comments/comment.routes");
const dashboardRoutes = require("./src/modules/dashboard/dashboard.routes");
const trashRoutes     = require("./src/modules/trash/trash.routes");

// Bootstrap
connectDB();

const app    = express();
const server = http.createServer(app);
initSocket(server);

// Core middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => res.json({ status: "ok", message: "Task Manager API" }));

// API routes
app.use("/api/auth",      authRoutes);
app.use("/api/users",     userRoutes);
app.use("/api/profile",   profileRoutes);
app.use("/api/tasks",     taskRoutes);
app.use("/api/tasks/:taskId/comments", commentRoutes);  // nested comments
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/trash",     trashRoutes);




// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler (must be last)
app.use(errorMiddleware);

server.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
});
console.log("MONGO_URI:", process.env.MONGO_URI); 