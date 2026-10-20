import { Request, Response, NextFunction } from 'express';
import { orderService } from './orders.service';

export class OrderController {
  async checkout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.processCheckout(req.body);

      res.status(201).json({
        status: 'success',
        data: order,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await orderService.getAllOrders();

      res.status(200).json({
        status: 'success',
        count: orders.length,
        data: orders,
      });
    } catch (err) {
      next(err);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = String(req.params.id);
      const order = await orderService.getOrderById(orderId);

      res.status(200).json({
        status: 'success',
        data: order,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/orders/:id/invoice (Download PDFKit Tax Invoice)
   */
  async downloadInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = String(req.params.id);
      await orderService.streamInvoicePDF(orderId, res);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/orders/export/excel (Admin download orders spreadsheet)
   */
  async exportExcel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await orderService.streamOrdersExcel(res);
    } catch (err) {
      next(err);
    }
  }
}

export const orderController = new OrderController();
