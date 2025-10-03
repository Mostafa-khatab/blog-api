import like from '@/models/like';
import { Request, Response } from 'express';
import Blog from '@/models/Blog';
import { logger } from '@/lib/winston';

const unlikeBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const userId = req.userId;

    const isLiked = await like.findOne({ blogId, userId }).lean().exec();

    if (!isLiked) {
      return res.status(404).json({ message: 'Blog not liked' });
    }

    await like.deleteOne({ _id: isLiked._id });

    const blog = await Blog.findById(blogId).select('likesCount').exec();

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.likesCount--;
    await blog?.save();
    logger.info(`Blog ${blogId} unliked by user ${userId}`);
    res.status(200).json({ message: 'Blog unliked' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default unlikeBlog;
