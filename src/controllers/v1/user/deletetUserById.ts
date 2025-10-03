import { User } from '@/models/user';
import { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import Blog from '@/models/Blog';
import { v2 as cloudinary } from 'cloudinary';
const deletetUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;
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

    await User.deleteOne({ _id: userId });
    logger.info('User deleted successfully', { userId });
    res.status(204).json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user by id error', { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default deletetUserById;
