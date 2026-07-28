import { Router } from "express";
import adminEventController from "../../controllers/admin/admin.eventController.js";
import authentication from "../../middlewares/authentication.js";
import { isAdmin } from "../../middlewares/permissions.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { validateObjectIdParam } from "../../middlewares/validateObjectId.js";
import { rejectEventSchema } from "../../validations/event.schema.js";

const router = Router();
router.use(authentication, isAdmin);
router.param('id', validateObjectIdParam);

const { list, read, approve, reject, cancel, deletee } = adminEventController;

router.route("/").get(list);
router.route("/:id").get(read).delete(deletee);
router.route("/:id/approve").put(approve);
router.route("/:id/reject").put(validateBody(rejectEventSchema), reject);
router.route("/:id/cancel").put(cancel);

export default router;
