import { Router } from "express";
import organizerApplicationController from "../../controllers/admin/admin.organizerApplicationController.js";
import authentication from "../../middlewares/authentication.js";
import { isAdmin } from "../../middlewares/permissions.js";

const router = Router();
router.use(authentication, isAdmin);

const { list, read, approve } = organizerApplicationController;

router.route("/").get(list);
router.route("/:id/approve").put(approve);
router.route("/:id").get(read);

export default router;
