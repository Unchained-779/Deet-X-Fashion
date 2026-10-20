import swaggerJsDoc from 'swagger-jsdoc';
import { env } from './env';

const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DeeT-X Fashion Production API & E-Commerce Core',
      version: '2.0.0',
      description:
        'Enterprise E-Commerce API engine built with Express 5, TypeScript, PostgreSQL (Supabase Cloud), and Prisma ORM.',
      contact: {
        name: 'DeeT-X Engineering Team',
        email: 'dev@deetxfashion.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJsDoc(swaggerOptions);
