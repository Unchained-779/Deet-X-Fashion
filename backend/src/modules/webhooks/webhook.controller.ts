import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../../config/prisma';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';

export class WebhookController {
  async handleRazorpayWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      if (!signature) {
        throw AppError.badRequest('Missing Razorpay webhook signature header');
      }

      // req.body is a raw Buffer because express.raw({ type: 'application/json' }) is mounted
      const rawBody = req.body.toString('utf8');

      const expectedSignature = crypto
        .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.warn('⚠️ Webhook signature mismatch: potential spoofed request');
        throw AppError.unauthorized('Invalid cryptographic webhook signature');
      }

      const payload = JSON.parse(rawBody);

      if (payload.event === 'payment.captured') {
        const payment = payload.payload.payment.entity;
        const orderId = payment.notes?.orderId || payment.order_id;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'PAID',
              razorpayPaymentId: payment.id,
            },
          });
          console.log(`✅ Order ${orderId} transitioned to PAID via Razorpay Webhook`);
        }
      }

      res.status(200).json({ status: 'success', received: true });
    } catch (err) {
      next(err);
    }
  }
}

export const webhookController = new WebhookController();
