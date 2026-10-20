import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';

export class LogisticsController {
  // GET /api/v1/logistics/check-pincode?pincode=110001
  async checkPincode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pincode = String(req.query.pincode || '');

      if (!/^[1-9][0-9]{5}$/.test(pincode)) {
        throw AppError.badRequest('Invalid 6-digit Indian PIN code');
      }

      // Calculate estimated delivery date: 3 business days from now
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);

      res.status(200).json({
        status: 'success',
        data: {
          pincode,
          isServiceable: true,
          estimatedDeliveryDate: deliveryDate.toISOString().split('T')[0],
          courierPartners: ['Delhivery', 'BlueDart', 'DeeT-X Express'],
          codAvailable: true,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/v1/logistics/verify-delivery-otp
  async verifyDeliveryOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, otp } = req.body;

      if (!orderId || !otp) {
        throw AppError.badRequest('Both orderId and 6-digit OTP are required');
      }

      // Hardcoded test verification or OTP match for portfolio demo
      if (otp !== '482910') {
        throw AppError.badRequest('Invalid Doorstep Delivery OTP. Please ask the customer.');
      }

      res.status(200).json({
        status: 'success',
        message: 'Doorstep OTP verified successfully. Package marked DELIVERED.',
        data: {
          orderId,
          status: 'DELIVERED',
          deliveredAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const logisticsController = new LogisticsController();
