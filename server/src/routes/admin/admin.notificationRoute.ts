import { Router } from "express";
import authentication from "../../middlewares/authentication.js";
import { isAdmin } from "../../middlewares/permissions.js";
import { getAdminNotificationQueue } from "../../controllers/admin/admin.notificationController.js";

const router = Router();

/* rotaya gıren bu kapılardan gecsın */

router.use(authentication, isAdmin);

router.route("/").get(getAdminNotificationQueue);


export default router;