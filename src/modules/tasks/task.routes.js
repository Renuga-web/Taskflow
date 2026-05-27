const express       = require("express");
const router        = express.Router();
const ctrl          = require("./task.controller");
const { protect }   = require("../../middlewares/auth.middleware");
const { adminOnly } = require("../../middlewares/role.middleware");
const { validate }  = require("../../middlewares/validate.middleware");
const { upload }    = require("../../config/cloudinary");
const uploadCtrl    = require("../uploads/upload.controller");
const { createTaskSchema, updateTaskSchema, updateStatusSchema, subTaskSchema } = require("./task.validation");

router.use(protect);

router.route("/")
  .get(ctrl.getTasks)
  .post(adminOnly, validate(createTaskSchema), ctrl.createTask);

router.route("/:id")
  .get(ctrl.getTaskById)
  .put(adminOnly, validate(updateTaskSchema), ctrl.updateTask);

router.put("/:id/status",                     validate(updateStatusSchema), ctrl.updateTaskStatus);
router.post("/:id/subtask",   adminOnly,      validate(subTaskSchema),      ctrl.addSubTask);
router.put( "/:id/subtask/:subId",            ctrl.updateSubTask);
router.post("/:id/assets",    adminOnly,      upload.single("asset"),       uploadCtrl.uploadTaskAsset);

module.exports = router;