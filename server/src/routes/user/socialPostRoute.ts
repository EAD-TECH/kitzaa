import { Router } from 'express';
import socialPostController from '../../controllers/user/socialPostController.js';
import authentication from '../../middlewares/authentication.js';
import { validateBody } from '../../middlewares/validateBody.js';
import { createPostSchema } from '../../validations/post.schema.js';

const router = Router();
router.use(authentication);

const { list, create } = socialPostController;

router.route('/').get(list).post(validateBody(createPostSchema), create);

export default router;
