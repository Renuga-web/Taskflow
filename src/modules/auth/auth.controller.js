const asyncHandler  = require("../../utils/asyncHandler");
const apiResponse   = require("../../utils/apiResponse");
const authService   = require("./auth.service");

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  return apiResponse.created(res, data, "Registered successfully");
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  return apiResponse.success(res, data, "Login successful");
});

const getMe = asyncHandler(async (req, res) => {
  return apiResponse.success(res, req.user, "Profile fetched");
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body);
  return apiResponse.success(res, null, "Password changed successfully");
});

const logout = asyncHandler(async (req, res) => {
  return apiResponse.success(res, null, "Logged out successfully");
});

module.exports = { register, login, getMe, changePassword, logout };