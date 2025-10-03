import { User } from '@/models/user';
import Blog from '@/models/Blog';
import { logger } from '@/lib/winston';
import { v2 as cloudinary } from 'cloudinary';

import type { Request, Response } from 'express';

const deleteCurrentUser = async (req: Request, res: Response) => {
  try {
    const blogs = Blog.find({ author: req.userId })
      .select('banner.publicId')
      .lean()
      .exec();

    const publicIds = (await blogs).map((blog) => blog.banner.publicId);

    await cloudinary.api.delete_resources(publicIds);

    logger.info(`Blogs with publicIds ${publicIds} deleted from cloudinary`);

    // Delete user's blogs
    await Blog.deleteMany({ author: req.userId });
    logger.info(`Blogs of user ${req.userId} deleted`);

    await User.deleteOne({ _id: req.userId });
    logger.info(`User ${req.userId} deleted their account`);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete current user error', { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default deleteCurrentUser;
