const Joi = require("joi");

const registerSchema = Joi.object({
  name:     Joi.string().min(2).max(50).required(),
  email:    Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role:     Joi.string().valid("admin", "user").optional(),
  title:    Joi.string().max(100).optional().allow(""),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword:     Joi.string().min(6).required(),
});

module.exports = { registerSchema, loginSchema, changePasswordSchema };