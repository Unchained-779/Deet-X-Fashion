import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';

import authRoutes from './modules/auth/auth.routes';
import catalogRoutes from './modules/catalog/catalog.routes';
import orderRoutes from './modules/orders/orders.routes';
import webhookRoutes from './modules/webhooks/webhook.routes';
import logisticsRoutes from './modules/logistics/logistics.routes';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app: Application = express();

// 1. Security HTTP Headers with Swagger support
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", env.FRONTEND_URL],
      },
    },
  })
);

// 2. CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// 3. CRITICAL: Mount Raw Webhook Body Parser BEFORE global express.json()
app.use('/api/v1/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// 4. Global Body Parser for standard API routes
app.use(express.json());

// 5. HTTP Logger (development only)
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 6. Interactive Swagger Documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 7. Base Health & Root Endpoints
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    service: 'DeeT-X Fashion Production API & E-Commerce Core',
    documentation: '/api-docs',
    health: '/api/v1/health',
    version: '2.0.0',
  });
});

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'DeeT-X Fashion Backend API is live, healthy, and connected to PostgreSQL! 🚀',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// 7. Enterprise Domain Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', catalogRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/logistics', logisticsRoutes);

// 8. 404 Catch-All Middleware (Must be mounted AFTER all routes)
app.use(notFoundHandler);

// 9. Global Centralized Error Handler (Must be the VERY LAST middleware)
app.use(errorHandler);

export default app;
