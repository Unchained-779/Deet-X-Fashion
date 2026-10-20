import { Request, Response, NextFunction } from 'express';
import { catalogService } from './catalog.service';

export class CatalogController {
  async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, search } = req.query;
      const products = await catalogService.getAllProducts({
        categorySlug: category ? String(category) : undefined,
        search: search ? String(search) : undefined,
      });

      res.status(200).json({
        status: 'success',
        count: products.length,
        data: products,
      });
    } catch (err) {
      next(err);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const identifier = String(req.params.identifier);
      const product = await catalogService.getProductById(identifier);

      res.status(200).json({
        status: 'success',
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await catalogService.createProduct(req.body);

      res.status(201).json({
        status: 'success',
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await catalogService.deleteProduct(id);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const catalogController = new CatalogController();
