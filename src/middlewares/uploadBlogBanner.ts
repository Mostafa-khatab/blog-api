import { logger } from '@/lib/winston';
import uploadToCloudinary from '@/lib/cloudinary';
import Blog from '@/models/Blog';

import type { Request, Response, NextFunction } from 'express';
import type { UploadApiErrorResponse } from 'cloudinary';

const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2MB

const uploadBlogBanner = (method: 'post' | 'put') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (method === 'put' && !req.file) {
      next();
      return;
    }

    if (!req.file) {
      res.status(400).json({
        message: 'Blog banner is required',
      });
      return;
    }

    if (req.file.size > MAX_FILE_SIZE) {
      res.status(413).json({
        message: 'Blog banner size is too large',
      });
      return;
    }

    try {
      const { blogId } = req.params;
      const blog = await Blog.findById(blogId).select('banner.publicId').exec();

      const data = await uploadToCloudinary(
        req.file.buffer,
        blog?.banner.publicId.replace('blog-api/', ''),
      );

      if (!data) {
        res.status(500).json({
          message: 'Error uploading blog banner',
        });

        logger.error('Error uploading blog banner', {
          blogId,
          publicId: blog?.banner.publicId,
        });
        return;
      }

      const newBanner = {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
      };

      logger.info('Blog banner uploaded successfully', {
        blogId,
        banner: newBanner,
      });
      req.body.banner = newBanner;
      next();
    } catch (err: UploadApiErrorResponse | any) {
      logger.error('Error uploading blog banner', err);
      res.status(500).json({
        message: 'Error uploading blog banner',
      });
    }
  };
};

export default uploadBlogBanner;
