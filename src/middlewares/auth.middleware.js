const jwt          = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const User         = require("../models/User");
const env          = require("../config/env");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized — no token provided");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("Not authorized — user no longer exists");
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error("Account is disabled — contact admin");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      res.status(401);
      throw new Error("Not authorized — invalid token");
    }
    if (err.name === "TokenExpiredError") {
      res.status(401);
      throw new Error("Token expired — please log in again");
    }
    throw err;
  }
});

module.exports = { protect };