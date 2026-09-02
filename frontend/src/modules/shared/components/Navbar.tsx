import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  LogOut,
  Ticket,
  PlusCircle,
  LayoutDashboard,
  Film,
  Sparkles,
  Music,
  Trophy,
  Flame,
} from 'lucide-react';
import { useAuthStore } from '../../auth/store/authStore';
import { useCityStore } from '../store/cityStore';
import { authApi } from '../api/services';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { selectedCity, openModal } = useCityStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      setShowProfileMenu(false);
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActiveCategory = (cat: string) => {
    return location.search.includes(`category=${cat}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#333545] border-b border-[#2b2d3c] shadow-md">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-8">
          {/* Logo & Search Container */}
          <div className="flex items-center gap-6 flex-1">
            {/* EventBook Logo */}
            <Link
              to="/"
              className="flex items-center gap-1 shrink-0 font-bold text-xl tracking-tight text-white select-none"
            >
              <span className="font-extrabold text-2xl tracking-tighter">Event</span>
              <span className="bg-[#f84464] text-white px-1.5 py-0.5 rounded font-black text-sm tracking-wider uppercase">
                Book
              </span>
            </Link>

            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md pl-10 pr-4 py-2 text-xs sm:text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#f84464]"
              />
            </form>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* City Selector Button */}
            <button
              onClick={openModal}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-200 hover:text-white font-medium px-2 py-1 rounded hover:bg-white/10 transition-colors"
            >
              <span>{selectedCity.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 text-white hover:opacity-90 bg-[#222434] border border-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold"
                >
                  <div className="w-6 h-6 bg-[#f84464] rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user?.username?.[0] || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user?.username}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setShowProfileMenu(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-800">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-[#f84464]/20 text-[#f84464] px-1.5 py-0.5 rounded">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/bookings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      <Ticket className="w-4 h-4 text-[#f84464]" />
                      <span>Your Orders & Tickets</span>
                    </Link>

                    {user?.role === 'organizer' && (
                      <Link
                        to="/events/create"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        <PlusCircle className="w-4 h-4 text-emerald-400" />
                        <span>List Your Show</span>
                      </Link>
                    )}

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-400" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-800 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="bg-[#f84464] hover:bg-[#e03050] text-white text-xs font-semibold px-4 py-1.5 rounded transition-all"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Sub-Navigation Bar (BookMyShow Category Strip) */}
      <div className="bg-[#222434] border-t border-[#2b2d3c] hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-xs font-medium">
            {/* Primary Category Links */}
            <div className="flex items-center gap-6 text-gray-300">
              <Link
                to="/events?category=movie"
                className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                  isActiveCategory('movie') ? 'text-[#f84464] font-bold' : ''
                }`}
              >
                <Film className="w-3.5 h-3.5" /> Movies
              </Link>
              <Link
                to="/events?category=stream"
                className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                  isActiveCategory('stream') ? 'text-[#f84464] font-bold' : ''
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Stream
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-bold uppercase">
                  New
                </span>
              </Link>
              <Link
                to="/events?category=music"
                className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                  isActiveCategory('music') ? 'text-[#f84464] font-bold' : ''
                }`}
              >
                <Music className="w-3.5 h-3.5" /> Events
              </Link>
              <Link
                to="/events?category=theatre"
                className={`hover:text-white transition-colors ${
                  isActiveCategory('theatre') ? 'text-[#f84464] font-bold' : ''
                }`}
              >
                Plays
              </Link>
              <Link
                to="/events?category=sports"
                className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                  isActiveCategory('sports') ? 'text-[#f84464] font-bold' : ''
                }`}
              >
                <Trophy className="w-3.5 h-3.5" /> Sports
              </Link>
              <Link
                to="/events?category=comedy"
                className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                  isActiveCategory('comedy') ? 'text-[#f84464] font-bold' : ''
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-orange-400" /> Activities & Comedy
              </Link>
            </div>

            {/* Secondary Service Links */}
            <div className="flex items-center gap-5 text-gray-400">
              <Link to="/events/create" className="hover:text-white transition-colors">
                ListYourShow
              </Link>
              <Link to="/events" className="hover:text-white transition-colors">
                Corporates
              </Link>
              <Link to="/events" className="hover:text-white transition-colors">
                Offers
              </Link>
              <Link to="/events" className="hover:text-white transition-colors">
                Gift Cards
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="p-2 sm:hidden bg-[#222434] border-t border-gray-800">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies, events, plays..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-gray-900 placeholder-gray-500 rounded pl-8 pr-3 py-1.5 text-xs focus:outline-none"
          />
        </form>
      </div>
    </header>
  );
};
