import http from 'http';

import app from './app';
import { config } from './shared/config/env';
import db from './shared/database/connection';
import { getRedis } from './shared/database/redis';
import { logger } from './shared/utils/logger';
import { initSocketServer } from './shared/websocket/socket';

const start = async () => {
  // Connect to database
  await db.connect();

  // Warm up Redis connection
  getRedis();

  // Create HTTP server and attach Socket.IO
  const httpServer = http.createServer(app);
  initSocketServer(httpServer);

  httpServer.listen(config.port, () => {
    logger.info(
      `Server running on ${config.nodeEnv === 'production' ? `https://${config.domain}` : `http://localhost:${config.port}`}`
    );
    logger.info(`WebSocket ready`);
    logger.info(`Environment: ${config.nodeEnv}`);
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
