import {
  createUserSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  setupAccountSchema,
} from "../../validations/user.schema.js";

import { Router } from "express";
import authController from "../../controllers/auth/authController.js";
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

export default router;
