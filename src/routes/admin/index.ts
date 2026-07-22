import { Router } from "express";

import adminUserRoute from "./admin.userRoute.js";
import adminEventCategoryRoute from "./admin.eventCategoryRoute.js";

const router = Router();

router.use("/users", adminUserRoute);
router.use("/categories", adminEventCategoryRoute);

export default router;
