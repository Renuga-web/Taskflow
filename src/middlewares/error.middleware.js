const env = require("../config/env");

const errorMiddleware = (err, req, res, next) => {
  // Use statusCode set before throw, or default to 500
  const statusCode = res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : err.statusCode || 500;

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ID: ${err.value}`,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ success: false, message: messages });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack:   env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = errorMiddleware;