const asyncHandler  = require("../../utils/asyncHandler");
const apiResponse   = require("../../utils/apiResponse");
const taskService   = require("./task.service");

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getAll(req.user, req.query);
  return apiResponse.success(res, tasks, "Tasks fetched");
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getById(req.params.id, req.user);
  return apiResponse.success(res, task);
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.create(req.body, req.user._id);
  return apiResponse.created(res, task, "Task created");
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.update(req.params.id, req.body, req.user);
  return apiResponse.success(res, task, "Task updated");
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await taskService.updateStatus(req.params.id, req.body.status, req.user);
  return apiResponse.success(res, task, "Status updated");
});

const addSubTask = asyncHandler(async (req, res) => {
  const subTasks = await taskService.addSubTask(req.params.id, req.body, req.user);
  return apiResponse.created(res, subTasks, "Sub-task added");
});

const updateSubTask = asyncHandler(async (req, res) => {
  const subTasks = await taskService.updateSubTask(req.params.id, req.params.subId, req.body);
  return apiResponse.success(res, subTasks, "Sub-task updated");
});

module.exports = { getTasks, getTaskById, createTask, updateTask, updateTaskStatus, addSubTask, updateSubTask };