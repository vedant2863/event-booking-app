# 🎭 BookMyShow Clone — Frontend Web Application

High-performance, responsive web application for the **BookMyShow clone**, crafted with **React 18, Vite, TypeScript, Tailwind CSS, Zustand, and Socket.IO Client**.

---

## 🌟 Key UI/UX Highlights

### 1. 🎨 Dual-Tier BookMyShow Navigation
- **Top Header**: Stylized BookMyShow branding, live search bar, current city display (`Mumbai ▾`), and user profile avatar with dropdown.
- **Secondary Strip**: Category navigation (*Movies, Stream, Events, Plays, Sports, Activities*) & service links (*ListYourShow, Offers*).

### 2. 📍 Global Multi-City Switcher
- Quick pop-up modal supporting major Indian metro hubs: **Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Ahmedabad, Chennai, Pune, Kolkata, Kochi, Chandigarh**.
- Persists selected city in browser `localStorage` and dynamically filters movies and events.

### 3. 🎬 Homepage Experience
- **Hero Slider**: Wide banner carousel showcasing top trending releases with autoplay and manual controls.
- **Circular Category Strip**: Fast shortcuts to Movies, Concerts, Comedy, Plays, Sports, and Stream.
- **Recommended Movies Rail**: BookMyShow vertical poster layout with ratings (`⭐ 9.2/10 (124K Votes)`), formats, genres, and languages.
- **Stream Spotlight**: Dedicated showcase for video-on-demand releases.

### 4. 📅 Showtimes & Cinema Hall Picker
- **Date Strip**: Horizontal date navigator (`TODAY, TOM, WED, THU, FRI, SAT`).
- **Format Filter**: Instant filter for `2D`, `3D`, `IMAX 3D`, and `4DX`.
- **Multiplex Listings**: Cinema cards (*PVR Inorbit Mall, INOX Megaplex, Cinépolis Grand Central*) with distance, amenities (*M-Ticket, F&B*), and color-coded showtimes (🟢 Available, 🟡 Filling Fast).

### 5. 💺 Auditorium Seat Map with Curved Screen
- **Glowing Curved Screen**: Realistic cinema arc visual with **"All eyes this way please! 📽️ SCREEN"** glow.
- **Tiered Seating Pricing**:
  - 👑 **RECLINER LUXURY (₹650)**
  - ⭐ **PRIME PLUS (₹350)**
  - 🎟️ **CLASSIC EXECUTIVE (₹220)**
- **Iconic Seat Counter**: 1 to 8 seats selector with vehicle icons (*Bicycle, Scooter, Auto, Car, Bus*).
- **Live Socket.IO Updates**: Instant visual updates when other users lock or book seats in real-time.

### 6. 💳 Itemized Billing & Hybrid Payment Suite
- **BookMyShow Itemized Breakdown**: Base ticket subtotal + Convenience fee (₹35/seat) + 18% GST.
- **Payment Options**:
  - ⚡ **Instant Dynamic UPI QR Code**: Live generated QR code + VPA entry (Google Pay, PhonePe, Paytm, BHIM, CRED).
  - 💳 **Credit & Debit Cards**: Card details form with instant authorization.
  - 🏦 **NetBanking**: Direct bank gateway (HDFC, SBI, ICICI, Axis, Kotak).

### 7. 🎟️ Digital M-Ticket Confirmation
- Perforated cinema ticket card with:
  - Scannable QR Code & Barcode for cinema turnstiles.
  - Audi Number (`AUDI 04 - IMAX 3D`).
  - Allocated Seats (`RECLINER - E10, E11`).
  - Google Maps directions to the multiplex.
  - One-click Download & Print M-Ticket button.

---

## 📁 Module Structure

```
frontend/
├── src/
│   ├── modules/
│   │   ├── admin/             # Admin dashboard & management views
│   │   │   └── pages/         # AdminDashboardPage, AdminUsersPage, etc.
│   │   ├── auth/              # Authentication module
│   │   │   ├── pages/         # LoginPage, RegisterPage
│   │   │   └── store/         # authStore.ts (Zustand + JWT tokens)
│   │   ├── bookings/          # Checkout & Ticket module
│   │   │   ├── components/    # PaymentModal.tsx (Hybrid UPI QR / Card)
│   │   │   └── pages/         # BookingsPage.tsx, BookingDetailPage.tsx (M-Ticket)
│   │   ├── events/            # Movie & Event catalog module
│   │   │   ├── api/           # Event API client
│   │   │   ├── components/    # EventCard.tsx, ShowtimePicker.tsx
│   │   │   └── pages/         # EventsPage.tsx, EventDetailPage.tsx, CreateEventPage.tsx
│   │   ├── home/              # Homepage module
│   │   │   └── pages/         # HomePage.tsx (Carousel, rails, stream spotlight)
│   │   ├── seats/             # Seating map module
│   │   │   ├── components/    # SeatMap.tsx (Curved screen, tiers, seat counter)
│   │   │   └── hooks/         # useSocket.ts (Real-time Socket.IO room listener)
│   │   └── shared/            # Common layout and shared stores
│   │       ├── api/           # Axios instance with interceptors & auto-refresh
│   │       ├── components/    # Navbar.tsx, Layout.tsx, CityModal.tsx
│   │       ├── store/         # cityStore.ts (Zustand city switcher)
│   │       └── types/         # TypeScript shared types
│   ├── styles/
│   │   └── globals.css        # BookMyShow crimson tokens, animations, seat glows
│   ├── App.tsx                # App routes & layout wrapper
│   └── main.tsx               # Application bootstrap
├── index.html                 # BMS HTML template with Inter font
├── vite.config.ts             # Vite configuration with API proxy
└── package.json
```

---

## 🛠️ Tech Stack & Libraries

- **Build Tool**: Vite 7
- **UI Library**: React 18 & TypeScript 5.3
- **Styling**: Tailwind CSS & Lucide React icons
- **Routing**: React Router v6
- **State Management**: Zustand (with `persist` middleware)
- **HTTP Client**: Axios (configured with automated JWT token refresh interceptors)
- **Real-Time Client**: Socket.IO Client
- **Date Formatting**: `date-fns`
- **Toasts & Feedback**: `react-hot-toast`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `frontend/` directory (optional for local dev as Vite proxy is pre-configured):

```env
VITE_API_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🧪 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server at `http://localhost:5173` |
| `npm run build` | Type-check with `tsc` and create optimized production bundle in `dist/` |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Lint codebase with ESLint |
| `npm run format` | Format code with Prettier |

