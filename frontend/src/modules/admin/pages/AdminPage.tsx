import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Users, Calendar, Ticket, TrendingUp } from 'lucide-react';
import { adminApi } from '../api';
import { AdminStats, Booking, Event, User } from '../../shared/types';
import toast from 'react-hot-toast';

const populatedUser = (ref: string | User | undefined): User | null =>
  typeof ref === 'object' && ref !== null ? ref : null;

const populatedEvent = (ref: string | Event | undefined): Event | null =>
  typeof ref === 'object' && ref !== null ? ref : null;

export const AdminPage = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tab, setTab] = useState<'overview' | 'users' | 'bookings'>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([adminApi.getStats(), adminApi.getUsers()]);
        setStats(statsRes.data.data!);
        setUsers(usersRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (tab === 'bookings') {
      adminApi.getAllBookings().then(({ data }) => setBookings(data.data || []));
    }
  }, [tab]);

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await adminApi.updateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: role as any } : u)));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse space-y-6">
        <div className="h-8 bg-gray-800 rounded w-1/4" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card h-28 bg-gray-800" />
          ))}
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-white mb-8">Admin Dashboard</h1>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Users',
              value: stats.totalUsers,
              icon: Users,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
            },
            {
              label: 'Published Events',
              value: stats.totalEvents,
              icon: Calendar,
              color: 'text-purple-400',
              bg: 'bg-purple-500/10',
            },
            {
              label: 'Confirmed Bookings',
              value: stats.totalBookings,
              icon: Ticket,
              color: 'text-green-400',
              bg: 'bg-green-500/10',
            },
            {
              label: 'Total Revenue',
              value: `₹${stats.totalRevenue.toLocaleString()}`,
              icon: TrendingUp,
              color: 'text-brand-400',
              bg: 'bg-brand-500/10',
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-5">
              <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="font-display font-bold text-2xl text-white">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-900 p-1 rounded-xl w-fit">
        {(['overview', 'users', 'bookings'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && stats && (
        <div className="card divide-y divide-gray-800">
          <div className="p-4 font-semibold text-white">Recent Bookings</div>
          {stats.recentBookings.slice(0, 8).map((booking: Booking) => (
            <div key={booking._id} className="p-4 flex items-center justify-between text-sm">
              <div>
                <p className="text-white font-medium">
                  {populatedEvent(booking.eventId)?.title ?? 'Event'}
                </p>
                <p className="text-gray-400">
                  {populatedUser(booking.userId)?.username ?? '—'} · {booking.bookingReference}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white">₹{booking.totalAmount?.toLocaleString()}</p>
                <p className="text-gray-400">{format(new Date(booking.createdAt), 'MMM d')}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users tab */}
      {tab === 'users' && (
        <div className="card divide-y divide-gray-800">
          <div className="p-4 font-semibold text-white">All Users ({users.length})</div>
          {users.map((user) => (
            <div key={user._id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user.username}</p>
                  <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
              </div>
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="user">User</option>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Bookings tab */}
      {tab === 'bookings' && (
        <div className="card divide-y divide-gray-800">
          <div className="p-4 font-semibold text-white">All Bookings</div>
          {bookings.map((booking: Booking) => (
            <div key={booking._id} className="p-4 flex items-center justify-between text-sm">
              <div>
                <p className="text-white font-medium font-mono">{booking.bookingReference}</p>
                <p className="text-gray-400">
                  {populatedUser(booking.userId)?.username ?? '—'} ·{' '}
                  {populatedEvent(booking.eventId)?.title ?? '—'}
                </p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-white">₹{booking.totalAmount?.toLocaleString()}</p>
                <span
                  className={`badge text-xs ${
                    booking.bookingStatus === 'confirmed'
                      ? 'bg-green-500/10 text-green-400'
                      : booking.bookingStatus === 'cancelled'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                  }`}
                >
                  {booking.bookingStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
