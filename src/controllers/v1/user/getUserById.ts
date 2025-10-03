import { User } from '@/models/user';
import { logger } from '@/lib/winston';
import type { Request, Response } from 'express';

const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-__v').lean().exec();
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    logger.error('Get user by id error', { error });
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getUserById;
