import createHttpError from "http-errors";
import { User } from "../db/models/user.js";

const ALLOWED_THEMES = ["light", "dark", "system"];

export const getTheme = async (userId) => {
  const user = await User.findById(userId).select("theme");
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return user.theme || "light";
};

export const changeTheme = async (theme, userId) => {
  if (theme && !ALLOWED_THEMES.includes(theme)) {
    throw createHttpError(400, "Invalid theme value");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { theme },
    { new: true, select: "theme email name" }
  );

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return user;
};
