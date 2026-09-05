import { Redis } from 'ioredis';

import { config } from '../config/env';
import { logger } from '../utils/logger';

let redisClient: Redis | null = null;
let isConnecting = false;

export const isRedisAvailable = (): boolean => {
  return redisClient !== null && redisClient.status === 'ready';
};

export const getRedis = (): Redis | null => {
  if (!redisClient && !isConnecting) {
    try {
      isConnecting = true;
      redisClient = new Redis(config.redisUrl, {
        maxRetriesPerRequest: 1,
        connectTimeout: 1500,
        enableOfflineQueue: false,
        reconnectOnError: () => false,
        retryStrategy: (times) => {
          if (times > 2) return null;
          return 500;
        },
      });

      redisClient.on('connect', () => logger.info('Redis connected'));
      redisClient.on('ready', () => logger.info('Redis ready'));
      redisClient.on('error', (err) => logger.warn(`Redis notice: ${err.message}`));
      redisClient.on('close', () => logger.warn('Redis connection closed'));
    } catch (err) {
      logger.warn('Redis initialization skipped:', err);
      redisClient = null;
    } finally {
      isConnecting = false;
    }
  }
  return redisClient;
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    try {
      if (redisClient.status === 'ready') {
        await redisClient.quit();
      } else {
        redisClient.disconnect();
      }
    } catch {
      // Ignored during serverless teardown
    } finally {
      redisClient = null;
    }
  }
};
