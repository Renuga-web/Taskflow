const Joi = require("joi");

const createUserSchema = Joi.object({
  name:     Joi.string().min(2).max(50).required(),
  email:    Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role:     Joi.string().valid("admin", "user").optional(),
  title:    Joi.string().max(100).optional().allow(""),
});

const updateUserSchema = Joi.object({
  name:     Joi.string().min(2).max(50).optional(),
  email:    Joi.string().email().optional(),
  role:     Joi.string().valid("admin", "user").optional(),
  title:    Joi.string().max(100).optional().allow(""),
  isActive: Joi.boolean().optional(),
});

module.exports = { createUserSchema, updateUserSchema };