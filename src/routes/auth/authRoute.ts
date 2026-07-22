import { createUserSchema, forgotPasswordSchema, loginSchema, resetPasswordSchema } from '../../validations/user.schema.js';

import { Router } from "express";
import authController from "../../controllers/auth/authController.js";
import { validateBody } from "../../middlewares/validateBody.js";
import authentication from "../../middlewares/authentication.js";

const router = Router();

const { login, register, logout, refresh, forgotPassword, resetPassword } = authController;

router.post("/login", validateBody(loginSchema), login);
router.post("/register", validateBody(createUserSchema), register);
router.post("/logout", authentication, logout);
router.post("/refresh", refresh);
router.post("/forgot-password", validateBody(forgotPasswordSchema), forgotPassword)
router.post("/reset-password/:token", validateBody(resetPasswordSchema), resetPassword)

export default router;