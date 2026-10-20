import app from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

const server = app.listen(env.PORT, async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log(`=======================================================`);
    console.log(`🚀 DEET-X FASHION ENTERPRISE BACKEND ONLINE`);
    console.log(`📡 PORT: ${env.PORT}`);
    console.log(`🌐 ENVIRONMENT: ${env.NODE_ENV}`);
    console.log(`🗄️ DATABASE: PostgreSQL on Supabase Cloud (Connected)`);
    console.log(`🔗 HEALTH CHECK: http://localhost:${env.PORT}/api/v1/health`);
    console.log(`=======================================================`);
  } catch (error) {
    console.error('❌ Failed to establish database connection:', error);
    process.exit(1);
  }
});

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server and disconnecting DB');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
