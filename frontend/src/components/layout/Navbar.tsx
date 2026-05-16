import { Link, useNavigate } from 'react-router-dom';
import { Ticket, LogOut, User, LayoutDashboard, PlusCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/services';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      navigate('/login');
      toast.success('Logged out');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-white">EventBook</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/events" className="btn-ghost text-sm">Browse Events</Link>
            {isAuthenticated && user?.role === 'organizer' && (
              <Link to="/events/create" className="btn-ghost text-sm flex items-center gap-1">
                <PlusCircle className="w-4 h-4" /> Create Event
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" className="btn-ghost text-sm flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/bookings" className="btn-ghost text-sm hidden sm:block">My Bookings</Link>
                <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <button onClick={handleLogout} className="btn-ghost p-2">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
