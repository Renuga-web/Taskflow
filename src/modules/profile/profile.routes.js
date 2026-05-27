const express       = require("express");
const router        = express.Router();
const ctrl          = require("./profile.controller");
const { protect }   = require("../../middlewares/auth.middleware");
const { validate }  = require("../../middlewares/validate.middleware");
const { uploadAvatar } = require("../../config/cloudinary");
const { updateProfileSchema } = require("./profile.validation");

router.use(protect);

router.get( "/",       ctrl.getProfile);
router.put( "/",       validate(updateProfileSchema), ctrl.updateProfile);
router.post("/avatar", uploadAvatar.single("avatar"), ctrl.uploadAvatar);

module.exports = router;