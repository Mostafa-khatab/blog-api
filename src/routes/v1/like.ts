import { Router } from 'express';
import { body, param } from 'express-validator';

import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';
import likeBlog from '@/controllers/v1/likes/likeBlog';
import unlikeBlog from '@/controllers/v1/likes/unlikeBlog';
const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['user', 'admin']),
  param('blogId').isMongoId().withMessage('Invalid blogId'),
  validationError,
  likeBlog,
);

router.delete(
  '/blog/:blogId',
  authenticate,
  authorize(['user', 'admin']),
  param('blogId').isMongoId().withMessage('Invalid blogId'),
  validationError,
  unlikeBlog,
);
export default router;
