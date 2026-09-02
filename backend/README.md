# ⚙️ BookMyShow Clone — Backend API

Production-ready, event-driven REST & WebSocket API for the BookMyShow clone, built with **Express, TypeScript, PostgreSQL (Prisma ORM), Redis, and Socket.IO**.

---

## 🏛️ Architecture & Module Structure

The backend follows a **Modular Domain-Driven Design (DDD)** structure:

```
backend/
├── prisma/
│   └── schema.prisma              # PostgreSQL schema & model relations
├── src/
│   ├── modules/
│   │   ├── admin/                 # Dashboard metrics, user & event moderation
│   │   ├── auth/                  # Registration, JWT login, token refresh, RBAC
│   │   ├── bookings/              # Booking creation, itemized checkout, payment
│   │   ├── events/                # Movie & event catalog, showtimes, venues
│   │   ├── notifications/         # Email notifications & booking confirmations
│   │   ├── payments/              # Payment processing & status tracking
│   │   └── seats/                 # Real-time seat inventory & Redis locking
│   ├── shared/
│   │   ├── config/                # Environment variables validation
│   │   ├── database/              # Prisma client & Redis connection
│   │   ├── email/                 # SMTP / Mailtrap email provider
│   │   ├── errors/                # Centralized AppError hierarchy
│   │   ├── middleware/            # Auth, rate limiting, error handlers
│   │   ├── types/                 # Shared TypeScript interfaces & enums
│   │   ├── utils/                 # Token generator, password hasher, logger
│   │   └── websocket/             # Socket.IO server & event rooms
│   ├── scripts/
│   │   └── seed.ts                # Database catalog seeder
│   ├── app.ts                     # Express app setup & middleware pipeline
│   └── server.ts                  # HTTP & WebSocket server entry point
├── package.json
└── tsconfig.json
```

---

## 🛠️ Tech Stack & Dependencies

- **Runtime & Language**: Node.js 20+ & TypeScript 5.3
- **Web Framework**: Express.js with Helmet security headers and CORS
- **Database & ORM**: PostgreSQL 16 with Prisma ORM (v5.22.0)
- **Caching & Locks**: Redis 7 (ioredis)
- **Real-Time Communication**: Socket.IO
- **Background Tasks**: BullMQ
- **Authentication**: JWT (Access Token in memory/header + Refresh Token in HttpOnly cookie) & bcryptjs (12 salt rounds)
- **Input Validation**: Zod
- **Structured Logging**: Pino with Pino-Pretty in development

---

## 🔒 Seat Concurrency & Redis Locking Mechanism

To prevent race conditions when thousands of users attempt to book the same seat simultaneously:

1. **Atomic In-Memory Lock**:
   When a user selects seats and proceeds to checkout, the server executes an atomic Redis pipeline:
   ```typescript
   // Atomic lock with 5-minute TTL
   pipeline.set(`seat:lock:${eventId}:${seatId}`, userId, 'EX', 300, 'NX');
   ```
2. **Real-time Broadcast**:
   Socket.IO immediately emits `seat:locked` to all clients viewing that event auditorium.
3. **PostgreSQL Relational Safety**:
   Seats in PostgreSQL are guarded with a database-level unique constraint:
   ```prisma
   model Seat {
     ...
     @@unique([eventId, seatNumber])
   }
   ```
4. **Safe Lock Release via Lua Script**:
   Locks can only be released by the user who acquired them:
   ```lua
   if redis.call("get", KEYS[1]) == ARGV[1] then
     return redis.call("del", KEYS[1])
   else
     return 0
   end
   ```

---

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:

```env
PORT=8000
NODE_ENV=development

# PostgreSQL Database Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eventbooking?schema=public

# Redis Connection
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Email (SMTP / Mailtrap)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
SMTP_FROM=noreply@eventbooking.com
```

### 3. Start Database & Redis (via Docker)
From the project root:
```bash
docker-compose up postgres redis -d
```

### 4. Push Prisma Schema & Generate Client
```bash
npm run prisma:push
npm run prisma:generate
```

### 5. Seed the Database
Populate with BookMyShow movies, concerts, stadium matches, and tiered cinema seats:
```bash
npm run seed
```

### 6. Start the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:8000`.

---

## 🔑 Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@demo.com` | `password123` |
| **Organizer** | `organizer@demo.com` | `password123` |
| **User** | `user@demo.com` | `password123` |

---

## 🔌 API Endpoints Summary

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login and receive JWT tokens | No |
| `POST` | `/api/auth/refresh` | Refresh access token | No (Cookie) |
| `POST` | `/api/auth/logout` | Revoke refresh token | Yes |
| `GET` | `/api/auth/me` | Get current logged-in profile | Yes |

### Events & Movies (`/api/events`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/events` | List events with filters (`category`, `search`, `city`) | No |
| `GET` | `/api/events/:id` | Get event / movie details | No |
| `GET` | `/api/events/:id/seats` | Get seating layout & availability | No |
| `GET` | `/api/events/my` | Get organizer's created events | Yes (Organizer) |
| `POST` | `/api/events` | Create new event with seating tiers | Yes (Organizer/Admin) |
| `PUT` | `/api/events/:id` | Update event details | Yes (Organizer/Admin) |
| `PATCH`| `/api/events/:id/publish`| Publish event | Yes (Organizer/Admin) |
| `PATCH`| `/api/events/:id/cancel` | Cancel event | Yes (Organizer/Admin) |
| `DELETE`| `/api/events/:id` | Delete event | Yes (Organizer/Admin) |

### Bookings & Payments (`/api/bookings`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/bookings` | Create booking and lock seats (5 min) | Yes |
| `GET` | `/api/bookings` | Get user's booked M-Tickets | Yes |
| `GET` | `/api/bookings/:id` | Get single M-Ticket details | Yes |
| `POST` | `/api/bookings/:id/confirm-payment` | Confirm payment & issue tickets | Yes |
| `DELETE`| `/api/bookings/:id` | Cancel booking & release seats | Yes |

### Admin Dashboard (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Platform metrics & revenue summary | Yes (Admin) |
| `GET` | `/api/admin/users` | List all users | Yes (Admin) |
| `PATCH`| `/api/admin/users/:id/role` | Update user role | Yes (Admin) |
| `GET` | `/api/admin/events` | List all events across platform | Yes (Admin) |
| `GET` | `/api/admin/bookings` | List all platform bookings | Yes (Admin) |

---

## 🧪 Available Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `ts-node-dev --respawn src/server.ts` | Start hot-reloading dev server |
| `npm run build` | `tsc` | Compile TypeScript into `dist/` |
| `npm start` | `node dist/server.js` | Run compiled production build |
| `npm run prisma:generate` | `prisma generate` | Generate Prisma Client |
| `npm run prisma:push` | `prisma db push` | Push Prisma schema directly to PostgreSQL |
| `npm run seed` | `ts-node src/scripts/seed.ts` | Populate database with sample catalog |
| `npm test` | `jest --coverage` | Run automated test suite |

