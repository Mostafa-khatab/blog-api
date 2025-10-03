import Blog from '@/models/Blog';
import { User } from '@/models/user';
import { Request, Response } from 'express';
import { logger } from '@/lib/winston';

interface QueryType {
  status?: 'draft' | 'published';
}
const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const query: QueryType = {};
    const user = await User.findById(userId).select('role').lean().exec();
    if (user?.role === 'user') {
      query.status = 'published';
    }

    const blog = await Blog.findOne({ slug: req.params.slug })
      .select('-__v -banner.publicId')
      .populate('author', '-__v -createdAt -updatedAt')
      .lean()
      .exec();

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (user?.role === 'user' && blog.status === 'draft') {
      logger.warn(`User ${userId} tried to access draft blog ${blog._id}`);

      return res
        .status(403)
        .json({ message: 'You are not authorized to view this blog' });
    }

    res.status(200).json(blog);
    logger.info(`Blog with slug ${req.params.slug} retrieved successfully`);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default getBlogBySlug;
