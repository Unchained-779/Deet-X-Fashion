import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        status: 'success',
        data: req.user,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
