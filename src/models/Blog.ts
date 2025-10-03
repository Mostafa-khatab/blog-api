import { Schema, model, Types } from 'mongoose';

import { genSlug } from '@/utils';

export interface IBlog {
  title: string;
  slug: string;
  content: string;
  banner: {
    publicId: string;
    url: string;
    width: number;
    height: number;
  };
  author: Types.ObjectId;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  status: 'draft' | 'published';
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxLength: [180, 'Blog title must be less than 180 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      trim: true,
      unique: [true, 'Blog slug must be unique'],
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
      trim: true,
    },
    banner: {
      publicId: {
        type: String,
        required: [true, 'Blog banner publicId is required'],
      },
      url: {
        type: String,
        required: [true, 'Blog banner url is required'],
      },
      width: {
        type: Number,
        required: [true, 'Blog banner width is required'],
      },
      height: {
        type: Number,
        required: [true, 'Blog banner height is required'],
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Blog author is required'],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: 'Blog status must be draft or published',
      },
      default: 'draft',
    },
  },
  {
    timestamps: {
      createdAt: 'publishedAt',
    },
  },
);

BlogSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = genSlug(this.title);
  }
  next();
});

export default model<IBlog>('Blog', BlogSchema);
