import { Router } from 'express';
import { webhookController } from './webhook.controller';

const router = Router();

// POST /api/v1/webhooks/payment - Webhook for Razorpay payment captured events
router.post('/payment', (req, res, next) =>
  webhookController.handleRazorpayWebhook(req, res, next)
);

export default router;
