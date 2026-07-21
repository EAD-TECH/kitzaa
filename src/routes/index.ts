import { Router } from "express";

import userRoute from "./user/userRoute.js";
import authRoute from "./auth/authRoute.js";
import adminRoute from './admin/index.js';

const router = Router();

router.use("/users", userRoute);
router.use("/auth", authRoute);
router.use("/admin", adminRoute);

export default router;




