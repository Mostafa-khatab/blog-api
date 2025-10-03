/**
 * Node modules
 */

import { Router } from 'express';
import { param, body, query } from 'express-validator';
import multer from 'multer';

/**
 * cutom modules
 */
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';
import uploadBlogBanner from '@/middlewares/uploadBlogBanner';
import getAllBlogs from '@/controllers/v1/blog/getAllBlogs';
import getBlogBySlug from '@/controllers/v1/blog/getBlogBySlug';
import updateBlog from '@/controllers/v1/blog/updateBlog';
import deleteBlog from '@/controllers/v1/blog/deleteBlog';
/**
 * Controllers
 */
import createBlog from '@/controllers/v1/blog/CreateBlog';
const upload = multer();

const router = Router();

router.post(
  '/create',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Title must be between 3 and 50 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 10, max: 180 })
    .withMessage('Content must be between 10 and 180 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be draft or published'),
  validationError,
  uploadBlogBanner('post'),
  createBlog,
);

router.get(
  '',
  authenticate,
  authorize(['admin', 'user']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip must be a positive integer'),
  validationError,
  getAllBlogs,
);

router.get(
  '/:slug',
  authenticate,
  authorize(['admin', 'user']),
  param('slug').trim().notEmpty().withMessage('Slug is required'),
  validationError,
  getBlogBySlug,
);

router.put(
  '/:blogId',

  authenticate,
  authorize(['admin']),
  param('blogId').trim().notEmpty().withMessage('BlogId is required'),
  upload.single('banner_image'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Title must be between 3 and 50 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 10, max: 180 })
    .withMessage('Content must be between 10 and 180 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be draft or published'),

  uploadBlogBanner('put'),
  validationError,
  updateBlog,
);

router.delete(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  param('blogId').trim().notEmpty().withMessage('BlogId is required'),
  validationError,
  deleteBlog,
);
export default router;
