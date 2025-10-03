/**
 * Custom modules
 */

import { logger } from '@/lib/winston';
import config from '@/config';
import { genUsername } from '@/utils';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

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

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

  if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    res.status(403).json({
      code: 'forbidden',
      message: 'You are not allowed to register as admin',
    });
    logger.warn('Unauthorized admin registration attempt:', { email });
  }

  try {
    const username = genUsername();
    const newUser = await User.create({ username, email, password, role });

    // Generate access token and refresh token
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store refresh token in database
    await Token.create({ token: refreshToken, userId: newUser._id });
    logger.info('Refresh token stored in database for user:', {
      useId: newUser._id,
      token: refreshToken,
    });
    res.cookie('resfreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });
    logger.info('New user registered:', {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    res.status(500).json({
      code: 'internal_server_error',
      message: 'An error occurred while processing your request',
      error: err,
    });
    logger.error(`Register Error: ${err}`);
  }
};

export default register;
