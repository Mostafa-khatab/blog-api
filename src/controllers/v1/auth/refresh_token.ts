/**
 * Node modules
 */

import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 *  Custom modules
 */
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';

import { logger } from '@/lib/winston';

/**
 * Models
 */

import Token from '@/models/token';

/**
 * Types
 */

import type { Request, Response } from 'express';
import { Types } from 'mongoose';

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken as string;

  try {
    const tokenExist = await Token.exists({ token: refreshToken });
    if (!tokenExist) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Invalid refresh token',
      });
      return;
    }

    // verify refresh token
    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    if (!jwtPayload) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Invalid refresh token',
      });
      return;
    }
    const accessToken = generateAccessToken(jwtPayload.userId);
    res.status(200).json({ accessToken });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Refresh token expired',
      });
      return;
    }

    if (err instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Invalid refresh token',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Could not refresh token',
      error: err,
    });
    logger.error(`Refresh Token Error: ${err}`);
  }
};

export default refreshToken;
