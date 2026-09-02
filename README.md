# 🎭 BookMyShow Clone — Full-Stack Cinema & Event Booking Platform

A production-grade **BookMyShow** web application clone built with **React 18, Node.js + Express (TypeScript), PostgreSQL + Prisma ORM, Redis, and Socket.IO**.

Featuring authentic crimson (`#f84464`) branding, global multi-city switcher, multi-cinema showtime picker, tiered auditorium seat maps (Recliner, Prime Plus, Classic) with curved glowing cinema screens, itemized billing with GST, dynamic UPI QR / Card checkout, and digital M-Tickets with scannable QR codes.

---

## 📚 Documentation Links
- ⚙️ **[Backend API Documentation](file:///c:/data/project/eventbooking/backend/README.md)** — Express + TypeScript architecture, Prisma schema, Redis locks, endpoints catalog, and testing.
- 🎨 **[Frontend UI Documentation](file:///c:/data/project/eventbooking/frontend/README.md)** — React 18, Vite, Tailwind CSS, BMS components, Zustand stores, and Socket.IO real-time hooks.

---

## ✨ Features & Capabilities

### 🎨 1. Authentic BookMyShow UI & Experience
- **Dual-Tier Navigation**: Signature header with live autocomplete search, city selector dropdown, and sub-nav strip (*Movies, Stream, Events, Plays, Sports, Activities*).
- **Multi-City Switcher**: Pop-up modal supporting major Indian metros (*Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Ahmedabad, Chennai, Pune, Kolkata, Kochi, Chandigarh*).
- **Hero Carousel Banner**: Autoplaying high-impact slider showcasing blockbuster movies, concerts, and live sports.
- **Circular Category Strip**: Quick-access shortcuts for Movies, Music, Comedy, Plays, Sports, and Stream.
- **BMS Movie Cards**: Vertical poster layout with BookMyShow ratings (`⭐ 9.2/10`), formats (`2D, 3D, IMAX 3D, 4DX`), genres, and languages.

### 📅 2. Showtimes & Multi-Cinema Hall Picker
- **Horizontal Date Strip**: Quick date selector (`TODAY, TOM, WED, THU, FRI, SAT`).
- **Format Filter**: Instant filter for `2D`, `3D`, `IMAX 3D`, and `4DX`.
- **Cinema Hall Listings**: Detailed multiplex listings (*PVR Inorbit Mall, INOX Megaplex, Cinépolis Grand Central*) with distance, amenities (*M-Ticket, F&B, Accessible*), and color-coded showtimes (🟢 Available, 🟡 Filling Fast).

### 💺 3. Cinema Auditorium Seat Selection
- **Curved Cinema Screen**: Glowing curved arc with **"All eyes this way please! 📽️ SCREEN"** visual prompt.
- **Multi-Tier Seating Layout**:
  - 👑 **RECLINER LUXURY (₹650)**
  - ⭐ **PRIME PLUS (₹350)**
  - 🎟️ **CLASSIC EXECUTIVE (₹220)**
- **Iconic Seat Counter**: Quick selector for 1–8 seats with vehicle icons (*Bicycle, Scooter, Auto, Car, Bus*).
- **5-Minute Live Redis Lock**: In-memory atomic locking (`SET NX EX 300`) preventing double-booking, synchronized in real-time across users with Socket.IO.

### 💳 4. Itemized Checkout & Hybrid Payment Suite
- **BookMyShow Itemized Breakdown**:
  - Ticket Base Subtotal
  - Convenience Fees (₹35 / ticket)
  - 18% Integrated GST on Convenience Fees
  - Total Payable
- **Payment Methods**:
  - ⚡ **Instant Dynamic UPI QR Code**: Live scannable QR code + VPA input (Google Pay, PhonePe, Paytm, BHIM, CRED).
  - 💳 **Credit & Debit Cards**: Card details form with instant validation.
  - 🏦 **NetBanking**: Direct bank gateway (HDFC, SBI, ICICI, Axis, Kotak).

### 🎟️ 5. Digital M-Ticket Confirmation
- Perforated digital ticket card with:
  - Scannable QR Code & Barcode for cinema usher turnstiles.
  - Audi Number (`AUDI 04 - IMAX 3D`).
  - Allocated Seats (`RECLINER - E10, E11`).
  - Cinema name and Google Maps directions link.
  - One-click Download & Print M-Ticket button.

---

## 📁 Project Structure

```
eventbooking/
├── backend/                   # Express + TypeScript + Prisma API
│   ├── prisma/                # Prisma PostgreSQL schema & migrations
│   │   └── schema.prisma
│   ├── src/
│   │   ├── modules/           # DDD modular architecture
│   │   │   ├── admin/         # Admin dashboard & metrics
│   │   │   ├── auth/          # JWT authentication & user roles
│   │   │   ├── bookings/      # Bookings, payments & order checkout
│   │   │   ├── events/        # Movie & event catalog
│   │   │   ├── notifications/ # Email confirmation service
│   │   │   ├── payments/      # Payment gateway integration
│   │   │   └── seats/         # Seat inventory & Redis atomic lock
│   │   ├── shared/            # Prisma client, Redis, sockets, logger
│   │   └── scripts/           # BookMyShow PostgreSQL seed script
│   ├── README.md              # Backend detailed README
│   └── .env.example
├── frontend/                  # React 18 + Vite + Tailwind CSS UI
│   ├── src/
│   │   ├── modules/           # Modular React architecture
│   │   │   ├── admin/         # Admin management views
│   │   │   ├── auth/          # Login & Register views
│   │   │   ├── bookings/      # M-Ticket & payment modal
│   │   │   ├── events/        # Showtime picker & movie details
│   │   │   ├── home/          # BMS Home, banner carousel, category strip
│   │   │   ├── seats/         # Auditorium seat map & curved screen
│   │   │   └── shared/        # Navbar, city switcher modal, layout
│   │   └── styles/            # BMS Crimson palette & glowing cinema effects
│   ├── README.md              # Frontend detailed README
│   └── vite.config.ts         # Proxy configuration
└── docker-compose.yml         # PostgreSQL 16 + Redis 7 local stack
```

---

## 🛠️ Tech Stack

### Backend
| Layer | Technology |
|---|---|
| **Runtime & Language** | Node.js 20+ & TypeScript |
| **Framework** | Express.js |
| **Database** | PostgreSQL 16 (Relational DB) |
| **ORM** | Prisma ORM (v5.22.0) |
| **In-Memory Cache & Lock** | Redis (ioredis) |
| **Real-time Sync** | Socket.IO |
| **Background Jobs** | BullMQ |
| **Security & Auth** | JWT (Access + Refresh) & bcryptjs (12 rounds) |
| **Validation** | Zod |
| **Logging** | Pino & Pino-Pretty |

### Frontend
| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + BookMyShow Custom Design Tokens |
| **Routing** | React Router v6 |
| **State Management** | Zustand (with localStorage persistence) |
| **Real-time Client** | Socket.IO Client |
| **Icons** | Lucide React |
| **Notifications** | react-hot-toast |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v20+
- **Docker & Docker Compose**
- **Git**

### 2. Clone Repository & Install Dependencies

```bash
git clone https://github.com/vedant2863/event-booking-app.git
cd event-booking-app

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Environment Setup

```bash
# Backend Environment
cp backend/.env.example backend/.env
```

Ensure `backend/.env` has:
```env
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eventbooking?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
CLIENT_URL=http://localhost:5173
```

### 4. Start Infrastructure (PostgreSQL 16 + Redis 7)

```bash
docker-compose up postgres redis -d
```

### 5. Setup Database Schema & Seed Catalog

```bash
cd backend

# Push Prisma schema to PostgreSQL
npm run prisma:push

# Populate database with BookMyShow catalog & demo accounts
npm run seed
```

This seeds:
- 👥 **3 Demo Accounts** (Admin, Organizer, User)
- 🎬 **Blockbuster Movies** (*Kalki 2898 AD, Dune 2, Stree 2*)
- 🎸 **Mega Concerts** (*Coldplay World Tour, Diljit Dosanjh Dil-Luminati*)
- 🏏 **Sports & Comedy** (*IPL 2025 MI vs CSK, Zakir Khan Live, Mughal-E-Azam*)
- 💺 **Tiered Seating Plans** (Recliner Luxury, Prime Plus, Classic Executive)

### 6. Run Application

**Terminal 1 — Backend API:**
```bash
cd backend
npm run dev
# API running at http://localhost:8000
```

**Terminal 2 — Frontend UI:**
```bash
cd frontend
npm run dev
# Web app running at http://localhost:5173
```

Open **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@demo.com` | `password123` | Full admin dashboard, event & booking analytics |
| **Organizer** | `organizer@demo.com` | `password123` | Create & manage events and seat layouts |
| **User** | `user@demo.com` | `password123` | Browse, select seats, book & view M-Tickets |

---

## 🎫 End-to-End Booking Lifecycle

```
1. Browse Catalog
   └── User filters by City (Mumbai, Delhi-NCR, Bengaluru) or Category (Movies, Concerts, Plays)
2. Movie / Event Detail Page
   └── View trailer, backdrop, rating (⭐ 9.2/10), synopsis, and language formats
3. Showtime & Cinema Selection
   └── Select date (Today / Tomorrow), format (IMAX 3D / 2D), and cinema hall (PVR / INOX / Cinépolis)
4. Auditorium Seat Map
   ├── Select seat count (1-8 seats)
   ├── View tiered auditorium layout with curved glowing cinema screen
   └── Click available seats (Recliner ₹650 / Prime ₹350 / Classic ₹220)
5. Atomic Redis Lock (5-Minute TTL)
   ├── Redis executes pipeline `SET seat:lock:<eventId>:<seatId> <userId> EX 300 NX`
   ├── Socket.IO broadcasts `seat:locked` in real-time to other active users
   └── PostgreSQL marks seat status as 'locked'
6. Itemized Checkout & Payment
   ├── Itemized breakdown: Base subtotal + Convenience fee (₹35/ticket) + 18% GST
   └── Select Dynamic UPI QR Code, Credit/Debit Card, or NetBanking
7. Confirmation & M-Ticket Issuance
   ├── PostgreSQL updates booking to 'confirmed' and payment to 'completed'
   ├── Redis locks released & available seats decremented in PostgreSQL
   ├── Socket.IO broadcasts `seat:booked`
   └── Instant redirection to digital perforated M-Ticket with scannable QR Code
```

---

## 📡 WebSocket Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `join:event` | Client → Server | `{ eventId }` | Subscribe to live seat changes for an event |
| `leave:event` | Client → Server | `{ eventId }` | Unsubscribe from an event room |
| `seat:locked` | Server → Client | `{ seatId, eventId }` | Seat has been temporarily locked by a user |
| `seat:released` | Server → Client | `{ seatId, eventId }` | Seat lock was expired or cancelled |
| `seat:booked` | Server → Client | `{ seatId, eventId }` | Seat has been permanently booked |
| `booking:confirmed` | Server → Client | `{ bookingId, reference }` | User's booking is finalized |

---

## 🔌 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Sign in and receive JWT tokens
- `POST /api/auth/refresh` — Refresh expired access token
- `POST /api/auth/logout` — Revoke refresh token and clear cookie
- `GET  /api/auth/me` — Get current logged-in user profile

### 🎬 Events & Movies (`/api/events`)
- `GET    /api/events` — List events (filter by `category`, `city`, `search`, `page`, `limit`)
- `GET    /api/events/:id` — Get movie / event details
- `GET    /api/events/:id/seats` — Get auditorium seating layout & real-time seat availability
- `GET    /api/events/my` — Get organizer's created events
- `POST   /api/events` — Create new event with tiered seating layout *(Organizer/Admin)*
- `PUT    /api/events/:id` — Update event *(Organizer/Admin)*
- `PATCH  /api/events/:id/publish` — Publish event *(Organizer/Admin)*
- `PATCH  /api/events/:id/cancel` — Cancel event *(Organizer/Admin)*
- `DELETE /api/events/:id` — Delete event *(Organizer/Admin)*

### 🎟️ Bookings & Checkout (`/api/bookings`)
- `POST   /api/bookings` — Create booking & acquire 5-minute atomic Redis seat lock
- `GET    /api/bookings` — List user's booked M-Tickets
- `GET    /api/bookings/:id` — Get detailed M-Ticket with scannable QR code
- `POST   /api/bookings/:id/confirm-payment` — Confirm payment & finalize tickets
- `DELETE /api/bookings/:id` — Cancel booking and release seats

### 📊 Admin Operations (`/api/admin`)
- `GET   /api/admin/stats` — Platform metrics (*totalUsers, totalEvents, totalBookings, totalRevenue*)
- `GET   /api/admin/users` — Paginated user directory
- `PATCH /api/admin/users/:id/role` — Update user role *(Admin)*
- `GET   /api/admin/events` — List all events across organizers
- `GET   /api/admin/bookings` — List all platform bookings

---

## 🔒 Security & Concurrency Design

- **Foolproof Seat Concurrency**: Powered by **PostgreSQL unique constraints** (`UNIQUE(eventId, seatNumber)`) and **Redis atomic pipeline locking** (`SET NX EX 300`) with Lua script lock release.
- **ACID Financial Integrity**: Complete transaction safety across bookings, payments, and seat status transitions.
- **Authentication**: Dual-token architecture (15-minute access JWT + 7-day refresh token in HttpOnly cookies).
- **Defense in Depth**: Helmet.js HTTP headers, rate limiting (global + strict auth rate limiters), and Zod schema validation.

---

## 📄 License

MIT — Created for learning and production-ready implementations.
