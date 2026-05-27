const ROLES = require("../constants/roles");

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === ROLES.ADMIN) {
    return next();
  }
  res.status(403);
  throw new Error("Access denied — admin role required");
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      res.status(403);
      throw new Error(`Access denied — requires one of: ${roles.join(", ")}`);
    }
    next();
  };
};

module.exports = { adminOnly, authorize };