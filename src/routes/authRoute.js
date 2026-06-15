import { Router } from "express";
import authController from "../controllers/authController.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createUserSchema, loginSchema } from "../validations/user.schema.js";
import authentication from "../middlewares/authentication.js";

const router = Router();

const { login, register, logout, refresh } = authController;

router.post("/login",validateBody(loginSchema),login);
router.post("/register", validateBody(createUserSchema), register);
router.post("/logout", authentication, logout);
router.post("/refresh", refresh);

export default router;