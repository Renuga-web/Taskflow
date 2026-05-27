const Joi = require("joi");

const createTaskSchema = Joi.object({
  title:       Joi.string().min(2).max(200).required(),
  description: Joi.string().max(2000).optional().allow(""),
  status:      Joi.string().valid("todo", "in progress", "completed").optional(),
  priority:    Joi.string().valid("high", "medium", "normal", "low").optional(),
  team:        Joi.array().items(Joi.string()).optional(),
  dueDate:     Joi.date().optional().allow(null),
});

const updateTaskSchema = Joi.object({
  title:       Joi.string().min(2).max(200).optional(),
  description: Joi.string().max(2000).optional().allow(""),
  priority:    Joi.string().valid("high", "medium", "normal", "low").optional(),
  team:        Joi.array().items(Joi.string()).optional(),
  dueDate:     Joi.date().optional().allow(null),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid("todo", "in progress", "completed").required(),
});

const subTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  date:  Joi.date().optional(),
  tag:   Joi.string().max(50).optional().allow(""),
});

module.exports = { createTaskSchema, updateTaskSchema, updateStatusSchema, subTaskSchema };