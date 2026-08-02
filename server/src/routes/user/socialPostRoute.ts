import { Router } from 'express';
import socialPostController from '../../controllers/user/socialPostController.js';
import authentication from '../../middlewares/authentication.js';
import { validateBody } from '../../middlewares/validateBody.js';
import { validateObjectIdParam } from '../../middlewares/validateObjectId.js';
import { createPostSchema } from '../../validations/post.schema.js';

const router = Router();
router.use(authentication);
router.param('id', validateObjectIdParam);

const { list, read, create } = socialPostController;

router.route('/').get(list).post(validateBody(createPostSchema), create);
router.route('/:id').get(read);

export default router;
