const asyncHandler    = require("../../utils/asyncHandler");
const apiResponse     = require("../../utils/apiResponse");
const profileService  = require("./profile.service");

const getProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getProfile(req.user._id);
  return apiResponse.success(res, profile, "Profile fetched");
});

const updateProfile = asyncHandler(async (req, res) => {
  const updated = await profileService.updateProfile(req.user._id, req.body);
  return apiResponse.success(res, updated, "Profile updated");
});

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }
  const updated = await profileService.updateAvatar(req.user._id, req.file.path);
  return apiResponse.success(res, updated, "Avatar updated");
});

module.exports = { getProfile, updateProfile, uploadAvatar };