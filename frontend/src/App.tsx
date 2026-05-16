import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { BookingsPage } from './pages/BookingsPage';
import { BookingDetailPage } from './pages/BookingDetailPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { AdminPage } from './pages/AdminPage';

export const App = () => (
  <BrowserRouter>
    <Toaster
      position="top-right"
      toastOptions={{
        style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' },
        success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
      }}
    />
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />

        {/* Authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="bookings/:id" element={<BookingDetailPage />} />
        </Route>

        {/* Organizer / Admin */}
        <Route element={<ProtectedRoute allowedRoles={['organizer', 'admin']} />}>
          <Route path="events/create" element={<CreateEventPage />} />
        </Route>

        {/* Admin only */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
