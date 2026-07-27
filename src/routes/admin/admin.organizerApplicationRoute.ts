import { Router } from "express";
import organizerApplicationController from "../../controllers/admin/admin.organizerApplicationController.js";
import authentication from "../../middlewares/authentication.js";
import { isAdmin } from "../../middlewares/permissions.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { rejectApplicationSchema } from "../../validations/organizerApplication.schema.js";

const router = Router();
router.use(authentication, isAdmin);

const { list, read, approve, reject } = organizerApplicationController;

router.route("/").get(list);
router.route("/:id/approve").put(approve);
router.route("/:id/reject").put(validateBody(rejectApplicationSchema), reject);
router.route("/:id").get(read);

export default router;
