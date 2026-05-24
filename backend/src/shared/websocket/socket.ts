import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';

import { config } from '../config/env';
import { AuthPayload } from '../types';
import { logger } from '../utils/logger';

interface SocketWithUser extends Socket {
  user?: AuthPayload;
}

let io: Server | null = null;

export const initSocketServer = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: config.clientUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Auth middleware for socket
  io.use((socket: Socket, next) => {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) return next(new Error('Authentication required'));

    try {
      const payload = jwt.verify(token, config.jwt.secret) as AuthPayload;
      (socket as SocketWithUser).user = payload;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as SocketWithUser).user as AuthPayload;
    logger.info(`Socket connected: ${user.userId}`);

    // Join personal room
    socket.join(`user:${user.userId}`);

    // Join event room to receive seat updates
    socket.on('join:event', (eventId: string) => {
      socket.join(`event:${eventId}`);
      logger.debug(`User ${user.userId} joined event room: ${eventId}`);
    });

    socket.on('leave:event', (eventId: string) => {
      socket.leave(`event:${eventId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${user.userId}`);
    });
  });

  return io;
};

export const getSocketServer = (): Server | null => io;
