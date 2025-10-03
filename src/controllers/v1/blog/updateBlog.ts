/**
 * Node modules
 */
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Blog from '@/models/Blog';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IBlog } from '@/models/Blog';
import { User } from '@/models/user';

type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>>;

/**
 * Purify instance
 */
const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, banner, status }: BlogData = req.body;
    const userId = req.userId;
    const blogId = req.params.blogId;

    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId).select('-__v').exec();

    if (!blog) {
      return res.status(404).json({
        message: 'Blog not found',
      });
    }

    if (user?.role !== 'admin' && blog.author !== userId) {
      logger.warn(`User "${userId}" attempted to update blog "${blogId}"`);

      res.status(403).json({
        message: 'You are not authorized to update this blog',
      });
    }

    if (title) blog.title = title;
    if (content) blog.content = purify.sanitize(content);
    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    await blog.save();

    logger.info(`Blog "${blogId}" updated by user "${userId}"`);

    res.status(200).json({
      message: 'Blog updated successfully',
      blog,
    });
  } catch (err: any) {
    logger.error(`Error Updating blog: ${err.message}`);
    res.status(500).json({
      message: 'Error Updating blog',
      error: err.message,
    });
  }
};

export default updateBlog;
