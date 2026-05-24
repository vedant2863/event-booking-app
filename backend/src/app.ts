import express from 'express';
import rateLimit from 'express-rate-limit';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import adminRoutes from './modules/admin/routes/admin.routes';
import authRoutes from './modules/auth/routes/auth.routes';
import bookingRoutes from './modules/bookings/routes/booking.routes';
import eventRoutes from './modules/events/routes/event.routes';
import { config } from './shared/config/env';
import { errorHandler, notFound } from './shared/middleware/error.middleware';

const app = express();

// Security
app.use(helmet());
const corsOptions = {
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts.' },
});

app.use('/api/auth', authLimiter);
app.use(limiter);

// Body & cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (config.nodeEnv !== 'test') app.use(morgan('dev'));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    routes: {
      api: {
        auth: '/api/auth',
        events: '/api/events',
        bookings: '/api/bookings',
        admin: '/api/admin',
      },
    },
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// 404 & Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
