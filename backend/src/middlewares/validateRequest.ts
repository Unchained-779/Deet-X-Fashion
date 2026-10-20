import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

type ValidationSchema = ZodTypeAny;

/**
 * Validates incoming Express requests against a Zod schema containing
 * { body, query, params } and strips unknown fields automatically.
 * Express 5 safe parameter/query mutation.
 */
export const validateRequest = (schema: ValidationSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as { body?: any; query?: any; params?: any };

      // Replace req.body with sanitized/coerced Zod output
      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }

      // Safely mutate query/params in Express 5 where req.query can be a getter
      if (parsed.query !== undefined) {
        Object.defineProperty(req, 'query', {
          value: parsed.query,
          writable: true,
          configurable: true,
        });
      }

      if (parsed.params !== undefined) {
        Object.defineProperty(req, 'params', {
          value: parsed.params,
          writable: true,
          configurable: true,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
