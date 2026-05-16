# 🎭 EventBook — Full-Stack Event Booking System

A production-ready event booking platform built with Node.js, React, MongoDB, Redis, and Socket.IO.

---

## 📁 Project Structure

```
eventbooking/
├── backend/           # Express + TypeScript API
├── frontend/          # React + Vite + Tailwind UI
├── docker-compose.yml # Local dev stack
└── .github/workflows/ # CI/CD pipeline
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### 1. Clone & Install

```bash
git clone https://github.com/your-username/eventbooking.git
cd eventbooking

# Install backend deps
cd backend && npm install && cd ..

# Install frontend deps
cd frontend && npm install && cd ..
```

### 2. Environment Setup

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env — at minimum set MONGO_URI, REDIS_URL, JWT_SECRET, JWT_REFRESH_SECRET
```

### 3. Start Infrastructure (MongoDB + Redis)

```bash
docker-compose up mongo redis -d
```

### 4. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- 3 demo users (admin / organizer / user)
- 6 published events with full seating layouts

### 5. Run Dev Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# API running at http://localhost:8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# UI running at http://localhost:5173
```

### 6. (Optional) Full Docker Stack

```bash
docker-compose up
# API:           http://localhost:8000
# Frontend:      http://localhost:5173
# Mongo Express: http://localhost:8081
```

---

## 🔑 Demo Credentials

| Role       | Email                  | Password     |
|------------|------------------------|--------------|
| Admin      | admin@demo.com         | password123  |
| Organizer  | organizer@demo.com     | password123  |
| User       | user@demo.com          | password123  |

---

## 🏗️ Architecture Overview

```
React Frontend (Vercel)
        │
        ▼
Nginx Gateway (SSL, Rate Limit, CORS)
        │
        ▼
Express API (Render)
   ┌────┴────┬──────────┬──────────┐
   ▼         ▼          ▼          ▼
MongoDB    Redis     Socket.IO   BullMQ
(Atlas)  (Seat lock) (Realtime) (Notifications)
```

---

## 🛠️ Tech Stack

### Backend
| Layer          | Technology                |
|----------------|---------------------------|
| Runtime        | Node.js 20 + TypeScript   |
| Framework      | Express.js                |
| Database       | MongoDB + Mongoose        |
| Cache / Locks  | Redis (ioredis)           |
| Real-time      | Socket.IO                 |
| Queue          | BullMQ                    |
| Auth           | JWT (access + refresh)    |
| Validation     | Zod                       |
| Logging        | Pino                      |
| Testing        | Jest + Supertest          |

### Frontend
| Layer          | Technology                |
|----------------|---------------------------|
| Framework      | React 18 + Vite           |
| Language       | TypeScript                |
| Styling        | Tailwind CSS              |
| Routing        | React Router v6           |
| State          | Zustand                   |
| Forms          | React Hook Form           |
| HTTP client    | Axios (with auto-refresh) |
| Real-time      | Socket.IO Client          |
| Toasts         | react-hot-toast           |

---

## 🎫 Booking Flow

```
1. User browses events
2. Clicks event → sees real-time seat map
3. Selects seats (up to 8)
4. "Book Now" → POST /api/bookings
   ├── Redis locks seats for 5 minutes
   ├── Booking created (status: pending)
   └── Socket.IO broadcasts seat:locked to all viewers
5. Payment simulated → POST /api/bookings/:id/confirm-payment
   ├── Seats marked BOOKED in MongoDB
   ├── Redis locks released
   ├── Event available seats decremented
   ├── Socket.IO broadcasts seat:booked
   └── Confirmation email sent
6. User redirected to ticket page
```

---

## 🔌 API Reference

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
```

### Events
```
GET    /api/events              # List (filter: category, city, search, dateFrom, dateTo)
GET    /api/events/:id          # Get single event
GET    /api/events/:id/seats    # Get event with seat layout
GET    /api/events/my           # Organizer's events [auth]
POST   /api/events              # Create event [organizer/admin]
PUT    /api/events/:id          # Update event [organizer/admin]
PATCH  /api/events/:id/publish  # Publish event [organizer/admin]
PATCH  /api/events/:id/cancel   # Cancel event [organizer/admin]
DELETE /api/events/:id          # Delete event [organizer/admin]
```

### Bookings
```
POST   /api/bookings            # Create booking (locks seats)
GET    /api/bookings            # My bookings [auth]
GET    /api/bookings/:id        # Booking detail [auth]
POST   /api/bookings/:id/confirm-payment  # Confirm & pay [auth]
DELETE /api/bookings/:id        # Cancel booking [auth]
```

### Admin
```
GET    /api/admin/stats         # Dashboard stats [admin]
GET    /api/admin/users         # All users [admin]
PATCH  /api/admin/users/:id/role # Change user role [admin]
GET    /api/admin/events        # All events [admin]
GET    /api/admin/bookings      # All bookings [admin]
```

---

## 📡 WebSocket Events

### Client → Server
```
join:event   { eventId }   # Subscribe to seat updates for an event
leave:event  { eventId }   # Unsubscribe
```

### Server → Client
```
seat:locked    { seatId, eventId }  # Seat was locked by a user
seat:released  { seatId, eventId }  # Seat lock expired or was cancelled
seat:booked    { seatId, eventId }  # Seat permanently booked
booking:confirmed { bookingId, reference }  # User's booking confirmed
```

---

## 🔒 Security Features

- JWT access tokens (15 min) + refresh tokens (7 days) in HttpOnly cookies
- bcrypt password hashing (12 rounds)
- Helmet.js security headers
- Rate limiting (100 req/15 min global, 10 req/15 min for auth)
- CORS restricted to CLIENT_URL
- Redis distributed locking prevents double-booking
- Zod schema validation on all inputs
- Role-based access control (user / organizer / admin)

---

## 🚢 Deployment

### Free Tier Stack

| Service  | Provider           | Free limit             |
|----------|--------------------|------------------------|
| Backend  | Render             | 512 MB RAM, auto-sleep |
| Frontend | Vercel             | Unlimited              |
| Database | MongoDB Atlas      | 512 MB storage         |
| Cache    | Redis Cloud        | 30 MB                  |
| Images   | Cloudinary         | 25 GB storage          |

### Deploy Backend to Render
1. Push code to GitHub
2. New Web Service → connect repo
3. Root Directory: `backend`
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Add all environment variables from `.env.example`
7. Set `MONGO_URI` to your Atlas connection string
8. Set `REDIS_URL` to your Redis Cloud URL

### Deploy Frontend to Vercel
1. New Project → import repo
2. Root Directory: `frontend`
3. Framework: Vite
4. Add `VITE_API_URL=https://your-api.onrender.com`
5. Deploy

### GitHub Actions Secrets Required
```
RENDER_DEPLOY_HOOK_URL
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

---

## 🧪 Testing

```bash
cd backend
npm test              # Run all tests
npm test -- --coverage # With coverage report
```

---

## 📈 Development Phases

| Phase | Features                                    | Status |
|-------|---------------------------------------------|--------|
| 1     | Auth, User management, Event CRUD           | ✅     |
| 2     | Seat map, Redis locking, Booking flow       | ✅     |
| 3     | Simulated payments, Notifications, Webhooks | ✅     |
| 4     | Real-time Socket.IO, Admin dashboard        | ✅     |
| 5     | CI/CD, Docker, Deployment config            | ✅     |

---

## 📝 Environment Variables

### Backend (`backend/.env`)
```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/eventbooking
REDIS_URL=redis://localhost:6379
JWT_SECRET=change-this-to-a-long-random-string
JWT_REFRESH_SECRET=change-this-too
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
SMTP_FROM=noreply@eventbooking.com
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT — feel free to use this for learning or production projects.
