import { Router } from "express";
import eventCategoryController from "../../controllers/user/eventCategoryController.js";
import authentication from "../../middlewares/authentication.js";

const router = Router();
router.use(authentication);

const { list, read } = eventCategoryController;

router.route("/").get(list);
router.route("/:id").get(read);

export default router;
