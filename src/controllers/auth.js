import {
  getCurrentUserService,
  getUserProfileService,
  loginOrSignupWithGoogle,
  loginUserService,
  logoutUserService,
  refreshSessionService,
  registerUserService,
  requestResetToken,
  resetPassword,
  updateUserService,
} from "../services/auth.js";
import { generateAuthUrl } from "../utils/googleOAuth2.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const registerUserController = async (req, res) => {
  const user = await registerUserService(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const { user, accessToken, refreshToken } = await loginUserService(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: "Successfully logged in an user!",
    data: { accessToken },
  });
};

export const refreshTokenController = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshSessionService(refreshToken);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: "Successfully refreshed a session!",
    data: { accessToken },
  });
};

export const logoutController = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await logoutUserService(refreshToken);
  }

  res.clearCookie("refreshToken");
  res.status(204).send();
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: "Successfully get Google OAuth url!",
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      status: 400,
      message: "Google OAuth code is required",
    });
  }

  const { user, accessToken, refreshToken } = await loginOrSignupWithGoogle(
    code
  );

  // 🔐 refresh token cookie (normal login ile AYNI)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "none",
  });

  res.status(200).json({
    status: 200,
    message: "Successfully logged in via Google OAuth!",
    data: {
      accessToken,
      user,
    },
  });
};

export const updateUserController = async (req, res) => {
  const photo = req.file;

  let photoUrl;
  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }

  const updateData = {
    ...req.body,
    ...(photoUrl && { photo: photoUrl }),
  };

  const updatedUser = await updateUserService(req.user._id, updateData);

  res.status(200).json({
    status: 200,
    message: "Successfully updated a user!",
    data: updatedUser,
  });
};

export const getUserProfileController = async (req, res) => {
  const userId = req.user._id;

  const user = await getUserProfileService(userId);

  res.status(200).json({
    status: 200,
    message: "Successfully fetched user profile",
    data: user,
  });
};

export const getCurrentUserController = async (req, res) => {
  const userId = req.user._id;

  const user = await getCurrentUserService(userId);

  res.status(200).json({
    status: 200,
    message: "Successfully fetched user profile",
    data: user,
  });
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: "Reset password email was successfully sent!",
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    message: "Password was successfully reset!",
    status: 200,
    data: {},
  });
};
