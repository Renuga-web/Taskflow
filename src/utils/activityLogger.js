const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({ user, task, type, description }) => {
  try {
    await ActivityLog.create({ user, task, type, description });
  } catch (err) {
    console.error("Activity log error:", err.message);
  }
};

module.exports = { logActivity };