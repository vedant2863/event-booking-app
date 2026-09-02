import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Ticket, Calendar, MapPin, CheckCircle, XCircle, Clock, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingsApi } from '../api';
import { Booking, Event } from '../../shared/types';
import clsx from 'clsx';

const STATUS_CONFIG = {
  confirmed: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
  },
  pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  cancelled: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
  expired: { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30' },
};

export const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingsApi.getAll();
      setBookings(data.data || []);
    } catch {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      try {
        const { data } = await bookingsApi.getAll();
        if (!isCancelled) {
          setBookings(data.data || []);
        }
      } catch {
        if (!isCancelled) {
          console.error('Failed to fetch bookings');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleCancel = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to cancel this booking? Refund will be processed back to original payment method.'
      )
    )
      return;
    try {
      await bookingsApi.cancel(id);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-6 animate-pulse space-y-3">
            <div className="h-5 bg-gray-800 rounded w-1/2" />
            <div className="h-4 bg-gray-800 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="border-b border-gray-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Your Orders & M-Tickets
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage your movie tickets and event passes</p>
        </div>
        <Link
          to="/events"
          className="bg-[#f84464] hover:bg-[#e03050] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
        >
          Book More Shows
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/40 rounded-3xl border border-gray-800 space-y-4">
          <Ticket className="w-12 h-12 mx-auto text-gray-600" />
          <h3 className="text-lg font-bold text-white">No active bookings found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You haven't booked any movies or live events yet. Discover trending shows in your city!
          </p>
          <Link to="/events" className="inline-block btn-primary text-xs mt-2">
            Explore Movies & Events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const event = booking.eventId as Event | undefined;
            const status = STATUS_CONFIG[booking.bookingStatus] || STATUS_CONFIG.confirmed;
            const Icon = status.icon;

            return (
              <div
                key={booking._id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all shadow-lg space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#f84464] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                        M-TICKET
                      </span>
                      <p className="text-xs text-gray-400 font-mono font-bold">
                        {booking.bookingReference}
                      </p>
                    </div>
                    <Link
                      to={`/bookings/${booking._id}`}
                      className="font-bold text-lg text-white hover:text-[#f84464] transition-colors line-clamp-1 block"
                    >
                      {event?.title || 'Event Booking'}
                    </Link>
                  </div>

                  <div
                    className={clsx(
                      'flex items-center gap-1.5 badge px-2.5 py-1 rounded-full border text-xs font-bold',
                      status.bg,
                      status.color
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="capitalize">{booking.bookingStatus}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 bg-gray-950/60 p-3 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#f84464]" />
                    <span>
                      {event?.date ? format(new Date(event.date), 'EEE, d MMM yyyy') : 'Show Date'}{' '}
                      · 08:30 PM
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#f84464]" />
                    <span className="truncate">
                      {event?.venue?.name || 'PVR Cinemas'}, {event?.venue?.city || 'Mumbai'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      {booking.seatDetails?.length || 0} Seat(s):{' '}
                      <strong className="text-white font-mono">
                        {booking.seatDetails?.map((s) => s.seatNumber).join(', ')}
                      </strong>
                    </p>
                    <p className="font-bold text-sm text-emerald-400">
                      ₹{booking.totalAmount.toLocaleString()} Paid
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/bookings/${booking._id}`}
                      className="bg-[#f84464] hover:bg-[#e03050] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" /> View M-Ticket
                    </Link>
                    {booking.bookingStatus === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="text-rose-400 hover:text-rose-300 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
