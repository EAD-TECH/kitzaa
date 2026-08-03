import { Router } from "express";
import socialPostCommentController from "../../controllers/user/socialPostCommentController.js";
import authentication from "../../middlewares/authentication.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { createPostCommentSchema } from "../../validations/postComment.schema.js";

const router = Router();
router.use(authentication);

const { list, create } = socialPostCommentController;

router.route("/").get(list).post(validateBody(createPostCommentSchema), create);

export default router;
