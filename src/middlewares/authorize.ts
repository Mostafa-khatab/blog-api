import { logger } from '@/lib/winston';

import { User } from '@/models/user';

import type { Request, Response, NextFunction } from 'express';
export type AuthRole = 'user' | 'admin';
const authorize = (roles: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.userId).select('role').exec();
      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }
      if (!roles.includes(user.role)) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }
      next();
    } catch (error) {
      logger.error('Authorization error', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};
export default authorize;
