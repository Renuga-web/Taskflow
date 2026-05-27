const asyncHandler = require("../../utils/asyncHandler");
const apiResponse  = require("../../utils/apiResponse");
const Task         = require("../../models/Task");

// POST /api/tasks/:id/assets
// Multer + Cloudinary middleware runs before this, populates req.file
const uploadTaskAsset = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.assets.push(req.file.path); // Cloudinary secure URL
  await task.save();

  return apiResponse.created(res, { assets: task.assets }, "Asset uploaded");
});

module.exports = { uploadTaskAsset };