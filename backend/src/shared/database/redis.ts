import { Redis } from 'ioredis';

import { config } from '../config/env';
import { logger } from '../utils/logger';

let redisClient: Redis;

export const getRedis = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    redisClient.on('connect', () => logger.info('Redis connected'));
    redisClient.on('error', (err) => logger.error('Redis error:', err));
    redisClient.on('close', () => logger.warn('Redis connection closed'));
  }
  return redisClient;
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
  }
};
