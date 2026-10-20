import { Router } from 'express';
import { orderController } from './orders.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkoutSchema, orderParamSchema } from './orders.schema';

const router = Router();

// POST /api/v1/orders/checkout - Process order with atomic stock decrement
router.post('/checkout', validateRequest(checkoutSchema), (req, res, next) =>
  orderController.checkout(req, res, next)
);

// GET /api/v1/orders - Admin list all orders
router.get('/', (req, res, next) => orderController.getAllOrders(req, res, next));

// GET /api/v1/orders/export/excel - Admin download orders excel spreadsheet
router.get('/export/excel', (req, res, next) => orderController.exportExcel(req, res, next));

// GET /api/v1/orders/:id - Get single order by ID
router.get('/:id', validateRequest(orderParamSchema), (req, res, next) =>
  orderController.getOrderById(req, res, next)
);

// GET /api/v1/orders/:id/invoice - Download PDFKit Tax Invoice
router.get('/:id/invoice', validateRequest(orderParamSchema), (req, res, next) =>
  orderController.downloadInvoice(req, res, next)
);

export default router;
