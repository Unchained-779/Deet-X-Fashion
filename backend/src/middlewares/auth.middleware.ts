import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Verifies JWT from Bearer Authorization header or HttpOnly cookie.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw AppError.unauthorized('Access denied. No authentication token provided.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    throw AppError.unauthorized('Invalid or expired authentication token.');
  }
};

/**
 * Role-Based Access Control guard.
 */
export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw AppError.forbidden(
        `Access denied. Role '${req.user.role}' is not authorized to access this resource.`
      );
    }

    next();
  };
};
