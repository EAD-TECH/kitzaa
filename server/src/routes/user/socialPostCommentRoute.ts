import { Router } from "express";
import socialPostCommentController from "../../controllers/user/socialPostCommentController.js";
import authentication from "../../middlewares/authentication.js";
import { isOwnerOrAdmin } from "../../middlewares/permissions.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { validateObjectIdParam } from "../../middlewares/validateObjectId.js";
import PostComment from "../../models/postCommentModel.js";
import {
  createPostCommentSchema,
  updatePostCommentSchema,
} from "../../validations/postComment.schema.js";

const router = Router();
router.use(authentication);
router.param("id", validateObjectIdParam);

const { list, create, update } = socialPostCommentController;

router.route("/").get(list).post(validateBody(createPostCommentSchema), create);
router
  .route("/:id")
  .put(isOwnerOrAdmin(PostComment, "authorId"), validateBody(updatePostCommentSchema), update);

export default router;
