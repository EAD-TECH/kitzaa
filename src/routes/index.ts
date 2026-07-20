import { Router } from "express";

import userRoute from "./userRoute.js";
import authRoute from "./authRoute.js";

const router = Router();

router.use("/users", userRoute);
router.use("/auth", authRoute);

export default router;




