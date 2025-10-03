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

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

/**
 * Purify instance
 */
const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, banner, status }: BlogData = req.body;
    const userId = req.userId;

    // Sanitize HTML content
    const sanitizedContent = purify.sanitize(content);

    const newBlog = await Blog.create({
      title,
      content: sanitizedContent,
      banner,
      status,
      author: userId,
    });

    logger.info(
      `Blog created with title: "${title}" (content length: ${sanitizedContent.length})`,
    );

    res.status(201).json({
      message: 'Blog created successfully',
      data: newBlog,
    });
  } catch (err: any) {
    logger.error(`Error creating blog: ${err.message}`);
    res.status(500).json({
      message: 'Error creating blog',
      error: err.message,
    });
  }
};

export default createBlog;
