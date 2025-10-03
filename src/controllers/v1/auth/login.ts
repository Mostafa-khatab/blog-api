/**
 * Node modules
 */

/**
 * custom modules
 */
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import config from '@/config';

/**
 * Models
 */

import { User } from '@/models/user';
import Token from '@/models/token';

/**
 * Types
 */

import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type UserData = Pick<IUser, 'email' | 'password'>;
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as UserData;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email })
      .select('username email password role')
      .lean()
      .exec();

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await Token.create({ token: refreshToken, userId: user._id });
    logger.info('Refresh token stored in database for user:', {
      useId: user._id,
      token: refreshToken,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
    logger.info('New user registered:', user);
  } catch (err) {
    res.status(500).json({
      code: 'internal_server_error',
      message: 'An error occurred while processing your request',
      error: err,
    });
    logger.error(`Register Error: ${err}`);
  }
};

export default login;
