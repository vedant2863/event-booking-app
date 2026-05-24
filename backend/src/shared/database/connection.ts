import mongoose, { Connection } from 'mongoose';

import { config } from '../config/env';
import { logger } from '../utils/logger';

/**
 * MongoDB database manager/connector
 */
class MongoConnection {
  private connection: Connection | null;
  constructor() {
    this.connection = null;
  }

  /**
   * Connect to MongoDB
   * @returns {Promise<mongoose.Connection>}
   */
  async connect() {
    try {
      if (this.connection) {
        logger.info('Mongodb already connected');
        return this.connection;
      }

      await mongoose.connect(config.mongoUri);

      this.connection = mongoose.connection;

      logger.info(`MongoDB connected: ${config.mongoUri}`);

      this.connection.on('error', (err) => {
        logger.error('MongoDB connection error', err);
      });

      this.connection.on('disconnected', () => {
        logger.error('MongoDB Disconnected');
      });

      return this.connection;
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * This helps to disconnet the active mongodb connection
   */
  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        this.connection = null;
        logger.info('Mongodb disconnected!');
      }
    } catch (error) {
      logger.error('Failed to disconnect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Get the active connection
   * @returns {mongoose.Connection}
   */
  getConnection() {
    return this.connection;
  }
}

export default new MongoConnection();
