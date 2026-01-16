import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.js";
import {
  registerUserController,
  loginUserController,
  logoutController,
  refreshTokenController,
  getGoogleOAuthUrlController,
  loginWithGoogleController,
  updateUserController,
  getUserProfileController,
  getCurrentUserController,
} from "../controllers/auth.js";
import {
  createUserSchema,
  loginUserSchema,
  loginWithGoogleOAuthSchema,
  needHelp,
  updateUserSchema,
} from "../validation/auth.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";
import { needHelpController } from "../controllers/needHelp.js";

const router = Router();

router.post(
  "/register",
  validateBody(createUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  "/login",
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post("/refresh-token", ctrlWrapper(refreshTokenController));

router.get("/get-oauth-url", ctrlWrapper(getGoogleOAuthUrlController));

router.post(
  "/confirm-oauth",
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

router.get("/confirm-oauth", (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Code yok");
  }

  const frontendCallbackUrl = `https://taskpro-omega.vercel.app/oauth/google?code=${code}`;

  return res.redirect(frontendCallbackUrl);
});

// 🔐 PROTECTED ROUTES

router.use(authMiddleware);

router.post("/logout", ctrlWrapper(logoutController));

router.patch(
  "/",
  upload.single("profilePhotoFile"),
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserController),
);

router.get("/current/profile", ctrlWrapper(getUserProfileController));
router.get("/current", ctrlWrapper(getCurrentUserController));

router.post(
  "/needHelp",
  validateBody(needHelp),
  ctrlWrapper(needHelpController),
);

export default router;
