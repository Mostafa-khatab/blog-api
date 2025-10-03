import { User } from '@/models/user';
import { logger } from '@/lib/winston';
import type { Request, Response } from 'express';
import config from '@/config';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;
    const total = await User.countDocuments();
    const users = await User.find()
      .select('-__v')
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    res.status(200).json({
      data: users,
      pagination: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getAllUsers;
