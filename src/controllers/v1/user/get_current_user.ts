import { User } from '@/models/user';
import { logger } from '@/lib/winston';

import type { Request, Response } from 'express';

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-_v').lean().exec();
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error('Get current user error', { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getCurrentUser;
