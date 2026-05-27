const express       = require("express");
const router        = express.Router();
const asyncHandler  = require("../../utils/asyncHandler");
const apiResponse   = require("../../utils/apiResponse");
const Task          = require("../../models/Task");
const User          = require("../../models/User");
const ActivityLog   = require("../../models/ActivityLog");
const ROLES         = require("../../constants/roles");
const { protect }   = require("../../middlewares/auth.middleware");

router.use(protect);

// GET /api/dashboard
router.get("/", asyncHandler(async (req, res) => {
  const isAdmin  = req.user.role === ROLES.ADMIN;
  const baseFilter = { isTrashed: false };
  const taskFilter = isAdmin
    ? baseFilter
    : { ...baseFilter, team: { $in: [req.user._id] } };

  const [
    totalTasks,
    todo,
    inProgress,
    completed,
    totalUsers,
    recentTasks,
    priorityStats,
    recentActivity,
  ] = await Promise.all([
    Task.countDocuments(taskFilter),
    Task.countDocuments({ ...taskFilter, status: "todo" }),
    Task.countDocuments({ ...taskFilter, status: "in progress" }),
    Task.countDocuments({ ...taskFilter, status: "completed" }),
    isAdmin ? User.countDocuments() : Promise.resolve(null),
    Task.find(taskFilter)
      .populate("team", "name avatar")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(5),
    Task.aggregate([
      { $match: taskFilter },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    ActivityLog.find(isAdmin ? {} : { user: req.user._id })
      .populate("user", "name avatar")
      .populate("task", "title")
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  const data = {
    summary: { totalTasks, todo, inProgress, completed },
    priorityStats,
    recentTasks,
    recentActivity,
    ...(isAdmin && { totalUsers }),
  };

  return apiResponse.success(res, data, "Dashboard data fetched");
}));

module.exports = router;