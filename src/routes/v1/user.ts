/**
 * Node modules
 */

import { Router } from 'express';
import { param, query, body } from 'express-validator';

import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';

import { User } from '@/models/user';
import authorize from '@/middlewares/authorize';
import getCurrentUser from '@/controllers/v1/user/get_current_user';
import updateCurrentUser from '@/controllers/v1/user/UpdateCurrentUser';
import deleteCurrentUser from '@/controllers/v1/user/deleteCurrentUser';
import getAllUsers from '@/controllers/v1/user/GetAllUsers';
import getUserById from '@/controllers/v1/user/getUserById';
import deletetUserById from '@/controllers/v1/user/deletetUserById';
const router = Router();

router.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  getCurrentUser,
);
router.put(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .custom(async (value) => {
      const userExists = await User.exists({ username: value });
      if (userExists) {
        throw new Error('Username already exists');
      }
    }),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (userExists) {
        throw new Error('Email already in use');
      }
    })
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters'),
  body('password')
    .optional()
    .isLength({ min: 6, max: 30 })
    .withMessage('Password must be between 6 and 30 characters'),
  body('first_name')
    .optional()
    .isLength({ max: 30 })
    .withMessage('First name must be less than 30 characters'),
  body('last_name')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Last name must be less than 30 characters'),
  body(['website', 'facebook', 'instagram', 'x', 'youtube'])
    .optional()
    .isURL()
    .withMessage('URL must be a valid URL')
    .isLength({ max: 100 })
    .withMessage('URL must be less than 100 characters'),
  validationError,
  updateCurrentUser,
);

router.delete(
  'current',
  authenticate,
  authorize(['admin', 'user']),
  validationError,
  deleteCurrentUser,
);

router.get(
  '/',
  authenticate,
  authorize(['admin']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip must be a positive integer'),
  validationError,
  getAllUsers,
);

router.get(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').isMongoId().withMessage('Invalid user ID'),
  validationError,
  getUserById,
);

router.delete(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').isMongoId().withMessage('Invalid user ID'),
  validationError,
  deletetUserById,
);
export default router;
