import { logger } from '@/lib/winston';

import Blog from '@/models/Blog';
import like from '@/models/like';

import { Request, Response } from 'express';

const likeBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const userId = req.userId;

    // Check if the blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if the user has already liked the blog
    const existingLike = await like.findOne({ blog: blogId, user: userId });
    if (existingLike) {
      return res
        .status(400)
        .json({ message: 'You have already liked this blog' });
    }

    await like.create({ blogId, userId });
    blog.likesCount = blog.likesCount + 1;
    await blog.save();

    logger.info('Blog liked successfully');
    return res.status(200).json({ message: 'Blog liked successfully' });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default likeBlog;
