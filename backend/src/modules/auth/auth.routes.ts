import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { authenticate } from '../../middlewares/auth.middleware';
import { registerSchema, loginSchema } from './auth.schema';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validateRequest(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);

// POST /api/v1/auth/login
router.post('/login', validateRequest(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

// GET /api/v1/auth/me (Protected)
router.get('/me', authenticate, (req, res, next) =>
  authController.getCurrentUser(req, res, next)
);

export default router;
