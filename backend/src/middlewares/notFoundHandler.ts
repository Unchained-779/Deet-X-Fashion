import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(new AppError(`Resource not found at: ${req.originalUrl}`, 404));
};
