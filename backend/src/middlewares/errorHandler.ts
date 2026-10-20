import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

interface ErrorResponsePayload {
  success: false;
  status: 'fail' | 'error';
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
}

// Translates Prisma database errors into clean operational AppErrors
const handlePrismaError = (err: PrismaClientKnownRequestError): AppError => {
  switch (err.code) {
    case 'P2002': {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      return new AppError(`A record with this ${target} already exists.`, 409, {
        code: 'DUPLICATE_VALUE',
        details: { field: target },
      });
    }
    case 'P2025': {
      return new AppError(
        (err.meta?.cause as string) || 'The requested record does not exist.',
        404,
        { code: 'RECORD_NOT_FOUND' }
      );
    }
    case 'P2003': {
      const field = (err.meta?.field_name as string) || 'reference';
      return new AppError(`Invalid reference provided for ${field}.`, 400, {
        code: 'FOREIGN_KEY_VIOLATION',
      });
    }
    default:
      return new AppError('Database operation failed.', 400, {
        code: `PRISMA_${err.code}`,
      });
  }
};

// Translates Zod validation issues into a structured field-error list
const handleZodError = (err: ZodError): AppError => {
  const formattedErrors = err.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));

  return new AppError('Validation failed. Please check your input.', 400, {
    code: 'VALIDATION_ERROR',
    details: formattedErrors,
  });
};

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isProd = env.NODE_ENV === 'production';
  let operationalError: AppError;

  if (err instanceof AppError) {
    operationalError = err;
  } else if (err instanceof ZodError) {
    operationalError = handleZodError(err);
  } else if (err instanceof PrismaClientKnownRequestError) {
    operationalError = handlePrismaError(err);
  } else if (err instanceof PrismaClientValidationError) {
    operationalError = new AppError('Invalid data format passed to database query.', 400, {
      code: 'DB_VALIDATION_ERROR',
    });
  } else if (err instanceof Error && err.name === 'TokenExpiredError') {
    operationalError = new AppError('Your session has expired. Please log in again.', 401, {
      code: 'TOKEN_EXPIRED',
    });
  } else if (err instanceof Error && err.name === 'JsonWebTokenError') {
    operationalError = new AppError('Invalid authentication token.', 401, {
      code: 'INVALID_TOKEN',
    });
  } else if (err instanceof SyntaxError && 'body' in err) {
    operationalError = new AppError('Malformed JSON payload in request body.', 400, {
      code: 'INVALID_JSON',
    });
  } else {
    // Unhandled system or programming crash
    console.error('🔥 [UNHANDLED SYSTEM ERROR]:', {
      method: req.method,
      path: req.originalUrl,
      error: err,
    });

    const fallbackMessage =
      !isProd && err instanceof Error
        ? err.message
        : 'Something went wrong on our end. Please try again later.';

    operationalError = new AppError(fallbackMessage, 500, {
      code: 'INTERNAL_SERVER_ERROR',
      isOperational: false,
    });
  }

  const responsePayload: ErrorResponsePayload = {
    success: false,
    status: operationalError.status,
    code: operationalError.code || 'ERROR',
    message: operationalError.message,
    ...(operationalError.details ? { details: operationalError.details } : {}),
    ...(!isProd && err instanceof Error ? { stack: err.stack } : {}),
  };

  res.status(operationalError.statusCode).json(responsePayload);
};
