import Blog from '@/models/Blog';
import { User } from '@/models/user';
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { logger } from '@/lib/winston';

const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(id)
      .select('author banner.publicId')
      .lean()
      .exec();

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (user?.role !== 'admin' && blog.author !== userId) {
      logger.warn(
        `User with id ${userId} tried to delete blog with id ${id} but is not authorized`,
      );
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this blog' });
    }

    await cloudinary.uploader.destroy(blog.banner.publicId);
    logger.info(`Banner with id ${blog.banner.publicId} deleted successfully`);

    await Blog.deleteOne({ _id: id });

    logger.info(`Blog with id ${id} deleted successfully`);
    return res.status(204).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting blog: ${error}`);
    return res.status(500).json({ message: 'Error deleting blog' });
  }
};

export default deleteBlog;
