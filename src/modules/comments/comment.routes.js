const express      = require("express");
const router       = express.Router({ mergeParams: true });
const ctrl         = require("./comment.controller");
const { protect }  = require("../../middlewares/auth.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const { commentSchema } = require("./comment.validation");

router.use(protect);

router.route("/")
  .get(ctrl.getComments)
  .post(validate(commentSchema), ctrl.addComment);

router.delete("/:commentId", ctrl.deleteComment);

module.exports = router;