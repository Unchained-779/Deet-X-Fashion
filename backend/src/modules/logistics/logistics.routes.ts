import { Router } from 'express';
import { logisticsController } from './logistics.controller';

const router = Router();

// GET /api/v1/logistics/check-pincode?pincode=110001
router.get('/check-pincode', (req, res, next) =>
  logisticsController.checkPincode(req, res, next)
);

// POST /api/v1/logistics/verify-delivery-otp
router.post('/verify-delivery-otp', (req, res, next) =>
  logisticsController.verifyDeliveryOtp(req, res, next)
);

export default router;
