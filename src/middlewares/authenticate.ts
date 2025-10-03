/**
 * Node modules
 */

import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * custom modules
 */

import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

/**
 * Types
 */

import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res
      .status(401)
      .json({ message: 'Authorization header missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token) as { userId: Types.ObjectId };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ message: 'Access token expired' });
      return;
    }
    if (err instanceof JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid access token' });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
    logger.error(`Authentication Error: ${err}`);
  }
};

export default authenticate;
