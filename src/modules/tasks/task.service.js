const Task           = require("../../models/Task");
const ACTIVITY_TYPES = require("../../constants/activityTypes");
const ROLES          = require("../../constants/roles");
const { logActivity } = require("../../utils/activityLogger");
const { getIO }      = require("../../config/socket");

const populateTask = (query) =>
  query
    .populate("team",      "name email avatar title")
    .populate("createdBy", "name email")
    .populate("activities.by", "name avatar");

const getAll = async (user, { status } = {}) => {
  const filter = { isTrashed: false };
  if (user.role !== ROLES.ADMIN) filter.team = { $in: [user._id] };
  if (status) filter.status = status;

  return await populateTask(Task.find(filter).sort({ createdAt: -1 }));
};

const getById = async (id, user) => {
  const task = await populateTask(Task.findById(id));
  if (!task || task.isTrashed)
    throw Object.assign(new Error("Task not found"), { statusCode: 404 });

  if (user.role !== ROLES.ADMIN && !task.team.some((m) => m._id.equals(user._id)))
    throw Object.assign(new Error("Not authorized to view this task"), { statusCode: 403 });

  return task;
};

const create = async (data, createdBy) => {
  const task = await Task.create({
    ...data,
    createdBy,
    activities: [{
      type:     ACTIVITY_TYPES.ASSIGNED,
      activity: `Task created and assigned`,
      by:       createdBy,
    }],
  });

  await logActivity({ user: createdBy, task: task._id, type: ACTIVITY_TYPES.ASSIGNED, description: `Created task: ${task.title}` });

  // Notify each assignee in real-time
  try {
    const io = getIO();
    (data.team || []).forEach((userId) => {
      io.to(userId.toString()).emit("taskAssigned", {
        message: `You were assigned: ${task.title}`,
        taskId:  task._id,
      });
    });
  } catch (_) {}

  return await populateTask(Task.findById(task._id));
};

const update = async (id, data, user) => {
  const task = await Task.findById(id);
  if (!task) throw Object.assign(new Error("Task not found"), { statusCode: 404 });

  Object.assign(task, data);
  task.activities.push({ type: ACTIVITY_TYPES.UPDATED, activity: `Task updated by ${user.name}`, by: user._id });

  await task.save();
  await logActivity({ user: user._id, task: id, type: ACTIVITY_TYPES.UPDATED, description: `Updated task: ${task.title}` });

  return await populateTask(Task.findById(id));
};

const updateStatus = async (id, status, user) => {
  const task = await Task.findById(id);
  if (!task) throw Object.assign(new Error("Task not found"), { statusCode: 404 });

  const isAssigned = task.team.map((u) => u.toString()).includes(user._id.toString());
  if (user.role !== ROLES.ADMIN && !isAssigned)
    throw Object.assign(new Error("Not authorized to update this task"), { statusCode: 403 });

  task.status = status;
  task.activities.push({ type: status, activity: `Status changed to "${status}" by ${user.name}`, by: user._id });
  await task.save();

  await logActivity({ user: user._id, task: id, type: status, description: `Changed status to ${status}` });

  try {
    const io = getIO();
    task.team.forEach((uid) => {
      io.to(uid.toString()).emit("taskUpdated", { taskId: id, status, updatedBy: user.name });
    });
  } catch (_) {}

  return await populateTask(Task.findById(id));
};

const addSubTask = async (taskId, subData, user) => {
  const task = await Task.findById(taskId);
  if (!task) throw Object.assign(new Error("Task not found"), { statusCode: 404 });

  task.subTasks.push(subData);
  task.activities.push({ type: ACTIVITY_TYPES.UPDATED, activity: `Sub-task added: ${subData.title}`, by: user._id });
  await task.save();
  return task.subTasks;
};

const updateSubTask = async (taskId, subId, data) => {
  const task = await Task.findById(taskId);
  if (!task) throw Object.assign(new Error("Task not found"), { statusCode: 404 });

  const sub = task.subTasks.id(subId);
  if (!sub) throw Object.assign(new Error("Sub-task not found"), { statusCode: 404 });

  Object.assign(sub, data);
  await task.save();
  return task.subTasks;
};

module.exports = { getAll, getById, create, update, updateStatus, addSubTask, updateSubTask };