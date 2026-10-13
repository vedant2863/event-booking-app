import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './shared/components/Layout';
import { ProtectedRoute } from './modules/auth/components/ProtectedRoute';
import { HomePage } from './modules/home/pages/HomePage';
import { LoginPage } from './modules/auth/pages/LoginPage';
import { RegisterPage } from './modules/auth/pages/RegisterPage';
import { EventsPage } from './modules/events/pages/EventsPage';
import { EventDetailPage } from './modules/events/pages/EventDetailPage';
import { BookingsPage } from './modules/bookings/pages/BookingsPage';
import { BookingDetailPage } from './modules/bookings/pages/BookingDetailPage';
import { CreateEventPage } from './modules/events/pages/CreateEventPage';
import { MyEventsPage } from './modules/events/pages/MyEventsPage';
import { AdminPage } from './modules/admin/pages/AdminPage';
import { ScrollToTop } from './shared/components/ScrollToTop';

export const App = () => (
  <BrowserRouter>
    <ScrollToTop />
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
          <Route path="my-events" element={<MyEventsPage />} />
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
