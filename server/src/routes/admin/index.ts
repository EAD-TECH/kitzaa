import { Router } from "express";

import adminUserRoute from "./admin.userRoute.js";
import adminEventCategoryRoute from "./admin.eventCategoryRoute.js";
import adminEventRoute from "./admin.eventRoute.js";
import adminOrganizerApplicationRoute from "./admin.organizerApplicationRoute.js";
import adminNotificationRoute from "./admin.notificationRoute.js";

const router = Router();

router.use("/users", adminUserRoute);
router.use("/notifications", adminNotificationRoute);
router.use("/categories", adminEventCategoryRoute);
router.use("/events", adminEventRoute);
router.use("/organizer-applications", adminOrganizerApplicationRoute);
export default router;
