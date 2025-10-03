import Blog from '@/models/Blog';
import { User } from '@/models/user';
import { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import config from '@/config';

interface QueryType {
  status?: 'draft' | 'published';
}
const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : config.defaultResLimit;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string)
      : config.defaultResOffset;

    const user = await User.findById(userId).select('role').lean().exec();

    const query: QueryType = {};
    if (user?.role == 'user') {
      query.status = 'published';
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .select('-__v -banner.publicId')
      .populate('author', '-createdAt -updatedAt -__v')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      limit,
      skip,
      total,
      data: blogs,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default getAllBlogs;
