import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, MapPin, Ticket, CheckCircle, ArrowLeft } from 'lucide-react';
import { bookingsApi } from '../api/services';
import { Booking } from '../types';

export const BookingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    bookingsApi.getById(id)
      .then(({ data }) => setBooking(data.data!))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-10 animate-pulse space-y-4">
      <div className="h-8 bg-gray-800 rounded w-1/3" />
      <div className="card p-8 space-y-4">
        {Array.from({length:5}).map((_,i) => <div key={i} className="h-4 bg-gray-800 rounded" />)}
      </div>
    </div>;
  }

  if (!booking) return <div className="text-center py-24 text-gray-500">Booking not found</div>;

  const event = booking.eventId as any;
  const isConfirmed = booking.bookingStatus === 'confirmed';

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link to="/bookings" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> My Bookings
      </Link>

      <div className="card overflow-hidden">
        {/* Ticket header */}
        <div className={`p-6 ${isConfirmed ? 'bg-gradient-to-r from-brand-900 to-brand-800' : 'bg-gray-800'}`}>
          <div className="flex items-center gap-3 mb-4">
            {isConfirmed ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <Ticket className="w-6 h-6 text-gray-400" />
            )}
            <h1 className="font-display font-bold text-2xl text-white">
              {isConfirmed ? 'Booking Confirmed' : `Booking ${booking.bookingStatus}`}
            </h1>
          </div>
          <p className="font-mono text-brand-300 text-lg">{booking.bookingReference}</p>
        </div>

        {/* Dashed separator */}
        <div className="relative h-0 border-t-2 border-dashed border-gray-700 mx-6">
          <div className="absolute -left-6 -top-3 w-6 h-6 bg-gray-950 rounded-full" />
          <div className="absolute -right-6 -top-3 w-6 h-6 bg-gray-950 rounded-full" />
        </div>

        {/* Event info */}
        <div className="p-6 space-y-5">
          <div>
            <h2 className="font-display font-bold text-xl text-white mb-3">{event?.title}</h2>
            <div className="space-y-2 text-sm text-gray-400">
              {event?.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-400" />
                  {format(new Date(event.date), 'EEEE, MMMM d, yyyy · h:mm a')}
                </div>
              )}
              {event?.venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-400" />
                  {event.venue.name}, {event.venue.address}, {event.venue.city}
                </div>
              )}
            </div>
          </div>

          {/* Seats */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-3">Seats</p>
            <div className="space-y-2">
              {booking.seatDetails.map((seat, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-800 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Ticket className="w-4 h-4 text-brand-400" />
                    <span className="text-white text-sm">{seat.section} · Row {seat.row} · Seat {seat.seatNumber}</span>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">₹{seat.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-800 rounded-xl p-4 flex justify-between items-center">
            <span className="text-gray-300 font-medium">Total Paid</span>
            <span className="text-brand-400 font-display font-bold text-xl">₹{booking.totalAmount.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Payment Status</p>
              <p className="text-white capitalize mt-0.5">{booking.paymentStatus}</p>
            </div>
            <div>
              <p className="text-gray-500">Booked On</p>
              <p className="text-white mt-0.5">{format(new Date(booking.createdAt), 'MMM d, yyyy')}</p>
            </div>
          </div>
        </div>

        {isConfirmed && (
          <div className="px-6 pb-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <p className="text-green-400 text-sm font-medium">✓ Show this ticket at the venue entrance</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
