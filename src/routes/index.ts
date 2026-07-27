import { Router } from "express";

import userRoute from "./user/userRoute.js";
import authRoute from "./auth/authRoute.js";
import adminRoute from './admin/index.js';
import eventCategoryRoute from './user/eventCategoyRoute.js';
import eventRoute from './user/eventRoute.js';
import organizerApplicationRoute from "./organizerApplicationRoute.js";

const router = Router();

router.use("/users", userRoute);
router.use("/auth", authRoute);
router.use("/admin", adminRoute);
router.use("/category", eventCategoryRoute);
router.use("/events", eventRoute);
router.use("/organizer-applications", organizerApplicationRoute)

export default router;




