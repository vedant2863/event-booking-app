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

// Enable trust proxy for Vercel / serverless reverse proxy
app.set('trust proxy', 1);

// Security
app.use(helmet({ crossOriginResourcePolicy: false }));
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://event-booking-app-seat.vercel.app',
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl) or any Vercel/localhost client
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

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

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Welcome to the Event Booking API!',
  });
});

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
