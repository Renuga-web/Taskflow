const multer = require("multer");

// Validate file type before passing to Cloudinary
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and WEBP images are allowed"), false);
  }
};

// 5MB limit
const limits = { fileSize: 5 * 1024 * 1024 };

const uploadMiddleware = multer({ fileFilter, limits });

module.exports = uploadMiddleware;