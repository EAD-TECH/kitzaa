import { Router } from "express";
import userController from "../controllers/userController.js";
import authentication from "../middlewares/authentication.js";
import { validateBody } from "../middlewares/validateBody.js";
import { changePasswordSchema, updateUserSchema } from "../validations/user.schema.js";

const router = Router();
router.use(authentication);

const { list, read, update, updatePassword, deletee } = userController;

router.route("/").get(list);
router.route("/:id").get(read).put(validateBody(updateUserSchema), update).delete(deletee);
router.route("/:id/password").put(validateBody(changePasswordSchema), updatePassword)

export default router;







