/**
 * custom modules
 */

import { logger } from '@/lib/winston';
import config from '@/config';
/**
 * Models
 */

import Token from '@/models/token';

/**
 * Types
 */
import type { Request, Response } from 'express';

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken as string;
    if (!refreshToken) {
      res.status(400).json({
        code: 'bad_request',
        message: 'Refresh token is required',
      });
      return;
    }
    await Token.deleteOne({ token: refreshToken });
    logger.info('Refresh token deleted from database:', {
      token: refreshToken,
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
    logger.info('User logged out successfully');
  } catch (err) {
    res.status(500).json({
      code: 'internal_server_error',
      message: 'An error occurred while processing your request',
      error: err,
    });
    logger.error(`Logout Error: ${err}`);
  }
};

export default logout;
