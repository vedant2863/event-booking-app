import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Ticket, Calendar, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingsApi } from '../api/services';
import { Booking } from '../types';
import clsx from 'clsx';

const STATUS_CONFIG = {
  confirmed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  expired: { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-500/10' },
};

export const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingsApi.getAll();
      setBookings(data.data || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingsApi.cancel(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-white mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <Ticket className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No bookings yet.</p>
          <Link to="/events" className="btn-primary inline-flex mt-4">Browse Events</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const event = booking.eventId as any;
            const status = STATUS_CONFIG[booking.bookingStatus];
            const Icon = status.icon;

            return (
              <div key={booking._id} className="card p-6 space-y-4 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <Link to={`/bookings/${booking._id}`} className="font-display font-semibold text-lg text-white hover:text-brand-400 transition-colors line-clamp-1">
                      {event?.title || 'Event'}
                    </Link>
                    <p className="text-xs text-gray-500 font-mono">{booking.bookingReference}</p>
                  </div>
                  <div className={clsx('flex items-center gap-1.5 badge px-3 py-1.5', status.bg, status.color)}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="capitalize">{booking.bookingStatus}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  {event?.date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-brand-400" />
                      {format(new Date(event.date), 'MMM d, yyyy · h:mm a')}
                    </div>
                  )}
                  {event?.venue && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-400" />
                      {event.venue.name}, {event.venue.city}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                  <div>
                    <p className="text-xs text-gray-500">{booking.seatDetails.length} seat{booking.seatDetails.length !== 1 ? 's' : ''}</p>
                    <p className="font-semibold text-white">₹{booking.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/bookings/${booking._id}`} className="btn-ghost text-sm py-1.5">
                      View
                    </Link>
                    {booking.bookingStatus === 'confirmed' && (
                      <button onClick={() => handleCancel(booking._id)} className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
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
