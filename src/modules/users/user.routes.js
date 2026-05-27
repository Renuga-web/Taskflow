const express      = require("express");
const router       = express.Router();
const ctrl         = require("./user.controller");
const { protect }  = require("../../middlewares/auth.middleware");
const { adminOnly } = require("../../middlewares/role.middleware");
const { validate }  = require("../../middlewares/validate.middleware");
const { createUserSchema, updateUserSchema } = require("./user.validation");

router.use(protect, adminOnly);

router.route("/").get(ctrl.getUsers).post(validate(createUserSchema), ctrl.createUser);
router.route("/:id").get(ctrl.getUserById).put(validate(updateUserSchema), ctrl.updateUser).delete(ctrl.deleteUser);
router.put("/:id/toggle-status", ctrl.toggleUserStatus);

module.exports = router;