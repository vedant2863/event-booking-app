import http from 'http';
import app from './app';
import { config } from './config/env';
import { connectDB } from './shared/database/connection';
import { getRedis } from './shared/database/redis';
import { initSocketServer } from './websocket/socket';
import { logger } from './shared/utils/logger';

const start = async () => {
  // Connect to database
  await connectDB();

  // Warm up Redis connection
  getRedis();

  // Create HTTP server and attach Socket.IO
  const httpServer = http.createServer(app);
  initSocketServer(httpServer);

  httpServer.listen(config.port, () => {
    logger.info(`🚀 Server running on http://localhost:${config.port}`);
    logger.info(`📡 WebSocket ready`);
    logger.info(`🌍 Environment: ${config.nodeEnv}`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    logger.info('Shutting down gracefully...');
    httpServer.close();
    process.exit(0);
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

start().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
