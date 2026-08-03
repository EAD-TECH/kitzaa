import { Router } from 'express';
import socialPostController from '../../controllers/user/socialPostController.js';
import authentication from '../../middlewares/authentication.js';
import { isOwnerOrAdmin } from '../../middlewares/permissions.js';
import { validateBody } from '../../middlewares/validateBody.js';
import { validateObjectIdParam } from '../../middlewares/validateObjectId.js';
import Post from '../../models/postModel.js';
import { createPostSchema, updatePostSchema } from '../../validations/post.schema.js';

const router = Router();
router.use(authentication);
router.param('id', validateObjectIdParam);

const { list, read, create, update, deletee, toggleLike } = socialPostController;

router.route('/').get(list).post(validateBody(createPostSchema), create);
router
  .route('/:id')
  .get(read)
  .put(isOwnerOrAdmin(Post, 'authorId'), validateBody(updatePostSchema), update)
  .delete(isOwnerOrAdmin(Post, 'authorId'), deletee);
router.route("/:id/like").post(toggleLike);

export default router;
