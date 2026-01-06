import crypto from "crypto";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { User } from "../db/models/user.js";
import { Session } from "../db/models/sessions.js";
import { randomBytes } from "node:crypto";
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from "../utils/googleOAuth2.js";
import { sendEmail } from "../utils/sendMail.js";

const ALLOWED_FIELDS = ["name", "email", "theme", "photo"];

const generateTokens = () => {
  return {
    accessToken: crypto.randomBytes(64).toString("hex"),
    refreshToken: crypto.randomBytes(64).toString("hex"),
  };
};

export const registerUserService = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, "User with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  return newUser;
};

export const loginUserService = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, "Email or password is wrong");
  }

  await Session.deleteMany({ userId: user._id });

  const { accessToken, refreshToken } = generateTokens();

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshSessionService = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  if (new Date() > session.refreshTokenValidUntil) {
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, "Refresh token expired");
  }

  await Session.deleteOne({ _id: session._id });

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    generateTokens();

  const newSession = await Session.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: newSession.accessTokenValidUntil,
  };
};

export const logoutUserService = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (session) {
    await Session.deleteOne({ _id: session._id });
  }
};

export const findSessionByAccessToken = async (accessToken) => {
  const session = await Session.findOne({ accessToken }).populate("userId");

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  if (new Date() > session.accessTokenValidUntil) {
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, "Access token expired");
  }

  return session;
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();

  if (!payload || !payload.email) {
    throw createHttpError(401, "Invalid Google token");
  }

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    const rawPassword = randomBytes(10).toString("hex");
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    user = await User.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password: hashedPassword,
      role: "parent",
    });
  }

  await Session.deleteMany({ userId: user._id });

  const { accessToken, refreshToken } = generateTokens();

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const updateUserService = async (userId, updateData) => {
  const updates = {};

  // 🔒 Whitelist
  for (const key of ALLOWED_FIELDS) {
    if (updateData[key] !== undefined) {
      updates[key] = updateData[key];
    }
  }

  // 🔐 Email change
  if (updates.email) {
    const exists = await User.findOne({
      email: updates.email.toLowerCase(),
      _id: { $ne: userId },
    });

    if (exists) {
      console.log("Email already in use:", updates.email);
      throw createHttpError(409, "Email already in use");
    }

    updates.email = updates.email.toLowerCase();
  }

  // 🔐 Password change (ÖZEL)
  if (updateData.password) {
    if (updateData.password.length < 8) {
      throw createHttpError(400, "Password must be at least 8 characters long");
    }

    updates.password = await bcrypt.hash(updateData.password, 10);
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    select: "name email theme photo createdAt",
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return user;
};

export const getUserProfileService = async (userId) => {
  const user = await User.findById(userId).select(
    "name email photo theme createdAt password"
  );

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return user;
};

export const getCurrentUserService = async (userId) => {
  const user = await User.findById(userId).select(
    "name email photo theme createdAt"
  );

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return user;
};

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const resetToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5m",
      subject: user._id.toString(),
    }
  );

  const html = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif;">
    <h2>Reset Password</h2>
    <p>Merhaba ${user.name},</p>
    <p>Şifreni sıfırlamak için aşağıdaki linke tıkla:</p>
    <p>
      <a 
        href="${process.env.APP_DOMAIN}/reset-password?token=${resetToken}"
        style="
          display:inline-block;
          padding:10px 16px;
          background:#4CAF50;
          color:#ffffff;
          text-decoration:none;
          border-radius:4px;
        "
      >
        Reset Password
      </a>
    </p>
    <p style="font-size:12px;color:#777;">
      Eğer bu isteği siz yapmadıysanız bu maili görmezden gelebilirsiniz.
    </p>
  </body>
</html>
`;

  await sendEmail({
    to: email,
    subject: "Reset your password",
    html,
    text: `Hello ${user.name},\n\nPlease reset your password by clicking the link: ${process.env.APP_DOMAIN}/reset-password?token=${resetToken}\n\nThis link will expire in 5 minutes.\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nYour Company`,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, process.env.JWT_SECRET);
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
};
