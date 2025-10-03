import { Router } from 'express';
import { body, param } from 'express-validator';

import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';
import commentBlog from '@/controllers/v1/comment/commentBlog';

const router = Router();

router.post(
    '/blog/:blogId',
    authenticate,
    authorize(['admin' , 'user']),
    param('blogId')
    .isMongoId()
    .withMessage('blogId must be a valid ObjectId'),
    body('content')
    .trim()
    .isEmpty()
    .withMessage('content must not be empty'),
    validationError,
    commentBlog
)

export default router;
