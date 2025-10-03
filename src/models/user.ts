/**
 * Node modules
 */

import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    x?: string;
    youtube?: string;
  };
}

/**
 * User schema
 */

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      maxLength: [20, 'Username cannot exceed 20 characters'],
      unique: [true, 'Username already exists'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
      maxLength: [50, 'Email cannot exceed 50 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Do not return password in queries
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['admin', 'user'],
        message: 'Role must be either admin or user',
      },
      default: 'user',
    },
    firstName: {
      type: String,
      maxLength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      maxLength: [50, 'Last name cannot exceed 50 characters'],
    },
    socialLinks: {
      website: {
        type: String,
        maxLength: [100, 'Social links cannot exceed 100 characters'],
      },
      facebook: {
        type: String,
        maxLength: [100, 'Social links cannot exceed 100 characters'],
      },
      instagram: {
        type: String,
        maxLength: [100, 'Social links cannot exceed 100 characters'],
      },
      x: {
        type: String,
        maxLength: [100, 'Social links cannot exceed 100 characters'],
      },
      youtube: {
        type: String,
        maxLength: [100, 'Social links cannot exceed 100 characters'],
      },
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = model<IUser>('User', userSchema);
