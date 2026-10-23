import {
  completeProfileSchema,
  createUserSchema,
  forgotPasswordSchema,
  googleSignInSchema,
  loginSchema,
  resetPasswordSchema,
  setupAccountSchema,
} from "../../validations/user.schema.js";

import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import authController from "../../controllers/auth/authController.js";
import googleAuthController from "../../controllers/auth/googleAuthController.js";
import { validateBody } from "../../middlewares/validateBody.js";
import authentication from "../../middlewares/authentication.js";

const router = Router();

const {
  login,
  register,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  verifyEmail,
  setupAccount
} = authController;

router.post("/login", validateBody(loginSchema), login);
router.post("/register", validateBody(createUserSchema), register);
router.post("/logout", authentication, logout);
router.post("/refresh", refresh);
router.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  forgotPassword,
);
router.post(
  "/reset-password/:token",
  validateBody(resetPasswordSchema),
  resetPassword,
);
router.get("/verify-email/:token", verifyEmail);


router.post(
  "/setup-account/:token",
  validateBody(setupAccountSchema),
  setupAccount,
);

const googleAuthLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many Google sign-in attempts. Please try again later.",
});

router.get("/google/nonce", googleAuthLimit, googleAuthController.issueNonce);
router.post(
  "/google",
  googleAuthLimit,
  validateBody(googleSignInSchema),
  googleAuthController.signIn,
);
router.post(
  "/complete-profile",
  authentication,
  validateBody(completeProfileSchema),
  googleAuthController.completeProfile,
);

export default router;
