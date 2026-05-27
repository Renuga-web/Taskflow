const express    = require("express");
const router     = express.Router();
const ctrl       = require("./auth.controller");
const { protect }  = require("../../middlewares/auth.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const { registerSchema, loginSchema, changePasswordSchema } = require("./auth.validation");

router.post("/register",         validate(registerSchema),       ctrl.register);
router.post("/login",            validate(loginSchema),          ctrl.login);
router.get( "/me",               protect,                        ctrl.getMe);
router.put( "/change-password",  protect, validate(changePasswordSchema), ctrl.changePassword);
router.post("/logout",           protect,                        ctrl.logout);

module.exports = router;