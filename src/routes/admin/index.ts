import { Router } from "express";

import adminUserRoute from "./admin.userRoute.js";
import adminEventCategoryRoute from "./admin.eventCategoryRoute.js";
import adminEventRoute from "./admin.eventRoute.js";

const router = Router();

router.use("/users", adminUserRoute);
router.use("/categories", adminEventCategoryRoute);
router.use("/events", adminEventRoute);

export default router;
