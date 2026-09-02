import { Redis } from 'ioredis';

import { config } from '../config/env';
import { logger } from '../utils/logger';

let redisClient: Redis | null = null;

export const getRedis = (): Redis => {
  if (!redisClient) {
    try {
      redisClient = new Redis(config.redisUrl, {
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        enableOfflineQueue: false,
        retryStrategy: (times) => (times > 3 ? null : Math.min(times * 100, 1000)),
      });

      redisClient.on('connect', () => logger.info('Redis connected'));
      redisClient.on('error', (err) => logger.warn('Redis notice:', err.message));
      redisClient.on('close', () => logger.warn('Redis connection closed'));
    } catch (err) {
      logger.warn('Redis connection deferred:', err);
    }
  }
  return redisClient as Redis;
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch {
      // Ignored during serverless teardown
    }
  }
};
