const asyncHandler     = require("../../utils/asyncHandler");
const apiResponse      = require("../../utils/apiResponse");
const commentService   = require("./comment.service");

const getComments = asyncHandler(async (req, res) => {
  const comments = await commentService.getByTask(req.params.taskId);
  return apiResponse.success(res, comments, "Comments fetched");
});

const addComment = asyncHandler(async (req, res) => {
  const comment = await commentService.add(req.params.taskId, req.body.text, req.user);
  return apiResponse.created(res, comment, "Comment added");
});

const deleteComment = asyncHandler(async (req, res) => {
  await commentService.remove(req.params.commentId, req.user._id);
  return apiResponse.success(res, null, "Comment deleted");
});

module.exports = { getComments, addComment, deleteComment };