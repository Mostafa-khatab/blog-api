import { User } from '@/models/user';
import { logger } from '@/lib/winston';

import type { Request, Response } from 'express';

const updateCurrentUser = async (req: Request, res: Response) => {
  const {
    username,
    email,
    password,
    first_name,
    last_name,
    website,
    facebook,
    instagram,
    x,
    youtube,
  } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    if (first_name) user.firstName = first_name;
    if (last_name) user.lastName = last_name;

    if (!user.socialLinks) {
      user.socialLinks = {};
    }
    if (website) user.socialLinks.website = website;
    if (facebook) user.socialLinks.facebook = facebook;
    if (instagram) user.socialLinks.instagram = instagram;
    if (x) user.socialLinks.x = x;
    if (youtube) user.socialLinks.youtube = youtube;

    await user.save();
    logger.info(`User ${user._id} updated their profile`);
    res.status(200).json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    logger.error('Update current user error', { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default updateCurrentUser;
