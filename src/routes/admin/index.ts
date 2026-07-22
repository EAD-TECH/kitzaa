import { Router } from "express";

import adminUserRoute from "./admin.userRoute.js";

const router = Router();

router.use("/users", adminUserRoute);

export default router;
