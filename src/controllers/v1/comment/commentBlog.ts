import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { logger } from '@/lib/winston';

import Blog from '@/models/Blog';

import comment from '@/models/comment';

import { Request, Response } from 'express';
import { IComment } from '@/models/comment';

type CommentData = Pick<IComment, 'content'>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);
const commentBlog = async (req: Request, res: Response) => {
  const { content } = req.body as CommentData;
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const blog = await Blog.findById(blogId).select('_id commentsCount').exec();

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const sanitizedContent = purify.sanitize(content);

    const newComment = new comment({
      content: sanitizedContent,
      blog: blogId,
      user: userId,
    });

    await newComment.save();

    blog.commentsCount += 1;
    await blog.save();

    res.status(201).json({ message: 'Comment created successfully' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default commentBlog;
