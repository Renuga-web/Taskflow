const asyncHandler = require("../../utils/asyncHandler");
const apiResponse  = require("../../utils/apiResponse");
const userService  = require("./user.service");

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAll();
  return apiResponse.success(res, users, "Users fetched");
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  return apiResponse.success(res, user);
});

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.create(req.body);
  return apiResponse.created(res, user, "User created");
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.update(req.params.id, req.body);
  return apiResponse.success(res, user, "User updated");
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const result = await userService.toggleStatus(req.params.id);
  const msg    = result.isActive ? "Account activated" : "Account deactivated";
  return apiResponse.success(res, result, msg);
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.remove(req.params.id);
  return apiResponse.success(res, null, "User deleted permanently");
});

module.exports = { getUsers, getUserById, createUser, updateUser, toggleUserStatus, deleteUser };