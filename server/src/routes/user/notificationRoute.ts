import { Router } from "express";
import authentication from "../../middlewares/authentication.js";
import { validateObjectIdParam } from "../../middlewares/validateObjectId.js";
import {
  getUnReadNotificationCount,
  listNotificationsById,
  patchAllNotificationAsRead,
  patchNotification,
} from "../../controllers/user/notificationController.js";

const router = Router();

/* kullanici giris yaptmi */
router.use(authentication);

router.param("id", validateObjectIdParam);

/* statik rotalarım */
router.route("/unread-count").get(getUnReadNotificationCount);
router.route("/mark-all-read").get(patchAllNotificationAsRead);

/* kok rotada listeleme yapması ıcın rota */

router.route("/").get(listNotificationsById);

/* id ye tek bildirmin gore okundu yapmak ısterse  */

router.route("/:id").patch(patchNotification);

export default router;
