const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const env = require("./env");

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key:    env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "taskmanager/assets",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation:  [{ width: 1000, crop: "limit" }],
  },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "taskmanager/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation:  [{ width: 200, height: 200, crop: "fill" }],
  },
});

const upload       = multer({ storage });
const uploadAvatar = multer({ storage: avatarStorage });

module.exports = { cloudinary, upload, uploadAvatar };