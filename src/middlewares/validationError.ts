/**
 * Node modules
 */

import { validationResult } from 'express-validator';

/**
 * Types
 */
import type { Request, Response, NextFunction } from 'express';

const validationError = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      code: 'ValidationError',
      errors: errors.mapped(),
    });
  }
  next();
};

export default validationError;
