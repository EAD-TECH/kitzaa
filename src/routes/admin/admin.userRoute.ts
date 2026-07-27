
import { Router } from "express";
import adminUserController from "../../controllers/admin/admin.userController.js";
import authentication from "../../middlewares/authentication.js";
import { isAdmin } from "../../middlewares/permissions.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { validateObjectIdParam } from "../../middlewares/validateObjectId.js";
import { adminCreateUserSchema, adminUpdateUserSchema, changePasswordSchema } from "../../validations/user.schema.js";

const router = Router();
router.use(authentication, isAdmin);
router.param('id', validateObjectIdParam);

const { list, create, read, update, updatePassword, deletee } = adminUserController;

router.route("/").get(list).post(validateBody(adminCreateUserSchema), create);
router.route("/:id").get(read).put(validateBody(adminUpdateUserSchema), update).delete(deletee);
router.route("/:id/password").put(validateBody(changePasswordSchema), updatePassword)

export default router;