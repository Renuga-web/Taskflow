const Comment        = require("../../models/Comment");
const Task           = require("../../models/Task");
const ACTIVITY_TYPES = require("../../constants/activityTypes");
const { logActivity } = require("../../utils/activityLogger");
const { getIO }      = require("../../config/socket");

const getByTask = async (taskId) => {
  return await Comment.find({ task: taskId })
    .populate("user", "name avatar title")
    .sort({ createdAt: 1 });
};

const add = async (taskId, text, user) => {
  const task = await Task.findById(taskId);
  if (!task) throw Object.assign(new Error("Task not found"), { statusCode: 404 });

  const comment = await Comment.create({ task: taskId, user: user._id, text });

  // Also embed in task activity log
  task.activities.push({ type: ACTIVITY_TYPES.COMMENTED, activity: text, by: user._id });
  await task.save();

  await logActivity({ user: user._id, task: taskId, type: ACTIVITY_TYPES.COMMENTED, description: `Commented on task: ${task.title}` });

  // Real-time broadcast to all team members
  try {
    const io = getIO();
    task.team.forEach((uid) => {
      io.to(uid.toString()).emit("newComment", {
        taskId,
        comment: { _id: comment._id, text, user: { name: user.name, avatar: user.avatar }, createdAt: comment.createdAt },
      });
    });
  } catch (_) {}

  return await comment.populate("user", "name avatar title");
};

const remove = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw Object.assign(new Error("Comment not found"), { statusCode: 404 });

  if (!comment.user.equals(userId))
    throw Object.assign(new Error("Not authorized to delete this comment"), { statusCode: 403 });

  await comment.deleteOne();
};

module.exports = { getByTask, add, remove };