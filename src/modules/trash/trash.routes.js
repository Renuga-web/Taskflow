const express       = require("express");
const router        = express.Router();
const asyncHandler  = require("../../utils/asyncHandler");
const apiResponse   = require("../../utils/apiResponse");
const Task          = require("../../models/Task");
const { logActivity } = require("../../utils/activityLogger");
const ACTIVITY_TYPES = require("../../constants/activityTypes");
const { protect }   = require("../../middlewares/auth.middleware");
const { adminOnly } = require("../../middlewares/role.middleware");

router.use(protect, adminOnly);

// GET /api/trash — list all trashed tasks
router.get("/", asyncHandler(async (req, res) => {
  const tasks = await Task.find({ isTrashed: true })
    .populate("team",      "name email avatar")
    .populate("createdBy", "name email")
    .sort({ updatedAt: -1 });

  return apiResponse.success(res, tasks, "Trashed tasks fetched");
}));

// PUT /api/trash/:id/trash — soft delete (move to trash)
router.put("/:id/trash", asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) { res.status(404); throw new Error("Task not found"); }

  task.isTrashed = true;
  task.activities.push({
    type:     ACTIVITY_TYPES.TRASHED,
    activity: `Task moved to trash by ${req.user.name}`,
    by:       req.user._id,
  });
  await task.save();

  await logActivity({
    user:        req.user._id,
    task:        task._id,
    type:        ACTIVITY_TYPES.TRASHED,
    description: `Trashed task: ${task.title}`,
  });

  return apiResponse.success(res, null, "Task moved to trash");
}));

// PUT /api/trash/:id/restore — restore from trash
router.put("/:id/restore", asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) { res.status(404); throw new Error("Task not found"); }

  task.isTrashed = false;
  task.activities.push({
    type:     ACTIVITY_TYPES.RESTORED,
    activity: `Task restored from trash by ${req.user.name}`,
    by:       req.user._id,
  });
  await task.save();

  await logActivity({
    user:        req.user._id,
    task:        task._id,
    type:        ACTIVITY_TYPES.RESTORED,
    description: `Restored task: ${task.title}`,
  });

  return apiResponse.success(res, null, "Task restored");
}));

// DELETE /api/trash/:id — permanent delete
router.delete("/:id", asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) { res.status(404); throw new Error("Task not found"); }

  await task.deleteOne();
  return apiResponse.success(res, null, "Task permanently deleted");
}));

// DELETE /api/trash/empty — permanently delete ALL trashed tasks
router.delete("/empty", asyncHandler(async (req, res) => {
  const result = await Task.deleteMany({ isTrashed: true });
  return apiResponse.success(res, { deleted: result.deletedCount }, "Trash emptied");
}));

module.exports = router;