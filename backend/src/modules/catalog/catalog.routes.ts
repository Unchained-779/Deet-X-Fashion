import { Router } from 'express';
import { catalogController } from './catalog.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  createProductSchema,
  getProductsQuerySchema,
  productParamSchema,
} from './catalog.schema';

const router = Router();

// GET /api/v1/products - List all products with filters
router.get('/', validateRequest(getProductsQuerySchema), (req, res, next) =>
  catalogController.getAllProducts(req, res, next)
);

// GET /api/v1/products/:identifier - Single product details
router.get('/:identifier', validateRequest(productParamSchema), (req, res, next) =>
  catalogController.getProductById(req, res, next)
);

// POST /api/v1/products - Create product (Admin)
router.post('/', validateRequest(createProductSchema), (req, res, next) =>
  catalogController.createProduct(req, res, next)
);

// DELETE /api/v1/products/:id - Delete product
router.delete('/:id', (req, res, next) => catalogController.deleteProduct(req, res, next));

export default router;
