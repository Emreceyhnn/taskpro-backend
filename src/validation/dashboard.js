import Joi from "joi";

export const createBoardSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
});

export const editBoardSchema = Joi.object({
  title: Joi.string().min(3).max(50).optional(),
}).min(1);

export const createColumnSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  boardId: Joi.string().required(),
});

export const editColumnSchema = Joi.object({
  name: Joi.string().min(2).max(30).optional(),
  order: Joi.number().optional(),
  boardId: Joi.string().required(),
}).min(1);

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  priority: Joi.string().valid("low", "medium", "high", "none").optional(),
  deadline: Joi.date().optional(),
  order: Joi.number().optional(),
});

export const editTaskSchema = Joi.object({
  title: Joi.string().min(1).max(100).optional(),
  description: Joi.string().max(500).optional(),
  priority: Joi.string().valid("low", "medium", "high", "none").optional(),
  deadline: Joi.date().optional(),
  order: Joi.number().optional(),
}).min(1);
