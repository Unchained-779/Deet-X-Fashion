export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: 'fail' | 'error';
  public readonly isOperational: boolean;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    options?: { code?: string; details?: unknown; isOperational?: boolean }
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = options?.isOperational ?? true;
    this.code = options?.code;
    this.details = options?.details;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(message, 400, { code: 'BAD_REQUEST', details });
  }

  static unauthorized(message = 'Authentication required. Please log in.') {
    return new AppError(message, 401, { code: 'UNAUTHORIZED' });
  }

  static forbidden(message = 'You do not have permission to perform this action.') {
    return new AppError(message, 403, { code: 'FORBIDDEN' });
  }

  static notFound(resource = 'Resource') {
    return new AppError(`${resource} not found.`, 404, { code: 'NOT_FOUND' });
  }

  static conflict(message: string, details?: unknown) {
    return new AppError(message, 409, { code: 'CONFLICT', details });
  }

  static unprocessable(message: string, details?: unknown) {
    return new AppError(message, 422, { code: 'UNPROCESSABLE_ENTITY', details });
  }
}
