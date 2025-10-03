/**
 * Node modules
 */

import { Router } from 'express';

const router = Router();

/**
 * Routes
 */
import authRoutes from '@/routes/v1/auth';
import userRoutes from '@/routes/v1/user';
import blogRouter from '@/routes/v1/blog';
import likeRouter from '@/routes/v1/like';
import commentRouter from '@/routes/v1/comment';

/**
 * Root route
 */

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    docs: 'https://docs.blog-api.khattab.com',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRouter);
router.use('/likes', likeRouter);
router.use('/comments', commentRouter);
export default router;
