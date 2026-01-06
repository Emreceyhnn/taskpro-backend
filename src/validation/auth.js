import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().min(5).max(50).required(),
  password: Joi.string().min(6).max(20).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().min(5).max(50).required(),
  password: Joi.string().min(6).max(20).required(),
});
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
export const logoutSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().min(5).max(50).optional(),
  password: Joi.string().min(6).max(20).optional(),
});
export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).max(20).required(),
  newPassword: Joi.string().min(6).max(20).required(),
});
export const verifyEmailSchema = Joi.object({
  email: Joi.string().email().min(5).max(50).required(),
});
export const changeEmailSchema = Joi.object({
  newEmail: Joi.string().email().min(5).max(50).required(),
  password: Joi.string().min(6).max(20).required(),
});
export const verifyChangeEmailSchema = Joi.object({
  token: Joi.string().required(),
});
export const deleteUserSchema = Joi.object({
  password: Joi.string().min(6).max(20).required(),
});
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});
