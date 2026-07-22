import { Router } from "express";
import adminEventCategoryController from "../../controllers/admin/admin.eventCategoryController.js";
import authentication from "../../middlewares/authentication.js";
import { isAdmin } from "../../middlewares/permissions.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { createEventCategorySchema, updateEventCategorySchema } from "../../validations/eventCategory.schema.js";

const router = Router();
router.use(authentication, isAdmin);

const { list, create, read, update, deletee } = adminEventCategoryController;

router.route("/").get(list).post(validateBody(createEventCategorySchema), create);
router.route("/:id").get(read).put(validateBody(updateEventCategorySchema), update).delete(deletee);

export default router;
