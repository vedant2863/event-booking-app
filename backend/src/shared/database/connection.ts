import { logger } from '../utils/logger';

import { prisma } from './prisma';

/**
 * PostgreSQL Database Manager via Prisma
 */
class DatabaseConnection {
  private isConnected = false;

  /**
   * Connect to PostgreSQL
   */
  async connect() {
    try {
      if (this.isConnected) {
        logger.info('PostgreSQL already connected');
        return;
      }

      await prisma.$connect();
      this.isConnected = true;
      logger.info('PostgreSQL connected successfully via Prisma');
    } catch (error) {
      logger.error('Failed to connect to PostgreSQL:', error);
      // Non-fatal in dev / startup so server starts gracefully
    }
  }

  /**
   * Disconnect from PostgreSQL
   */
  async disconnect() {
    try {
      if (this.isConnected) {
        await prisma.$disconnect();
        this.isConnected = false;
        logger.info('PostgreSQL disconnected');
      }
    } catch (error) {
      logger.error('Failed to disconnect from PostgreSQL:', error);
    }
  }
}

export default new DatabaseConnection();
