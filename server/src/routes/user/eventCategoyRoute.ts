import { Router } from "express";
import eventCategoryController from "../../controllers/user/eventCategoryController.js";

const router = Router();

const { list, read } = eventCategoryController;

router.route("/").get(list);
router.route("/:id").get(read);

export default router;
