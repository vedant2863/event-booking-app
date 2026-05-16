import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, ArrowLeft, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import { eventsApi, bookingsApi } from '../api/services';
import { Event, Seat } from '../types';
import { SeatMap } from '../components/seats/SeatMap';
import { useAuthStore } from '../store/authStore';
import { useEventRoom } from '../hooks/useSocket';

export const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [event, setEvent] = useState<Event | null>(null);
  const [layout, setLayout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [booking, setBooking] = useState(false);
  const [realtimeUpdates, setRealtimeUpdates] = useState<any[]>([]);

  // Real-time seat updates
  useEventRoom(id, (data) => {
    setRealtimeUpdates((prev) => [...prev.slice(-20), data]);
  });

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await eventsApi.getWithSeats(id);
        setEvent(data.data!.event);
        setLayout(data.data!.layout);
      } catch {
        toast.error('Failed to load event');
        navigate('/events');
      } finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleBook = async () => {
    if (!isAuthenticated) { toast.error('Please login to book'); navigate('/login'); return; }
    if (!selectedSeats.length) { toast.error('Please select seats'); return; }

    setBooking(true);
    try {
      const { data } = await bookingsApi.create({ eventId: id!, seatIds: selectedSeats.map((s) => s._id) });
      toast.success('Seats locked! Confirming payment...');

      // Simulate payment (auto-confirm after 1.5s)
      setTimeout(async () => {
        try {
          await bookingsApi.confirmPayment(data.data!._id);
          toast.success('🎉 Booking confirmed!');
          navigate(`/bookings/${data.data!._id}`);
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Payment failed');
        } finally { setBooking(false); }
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Booking failed');
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6 animate-pulse">
        <div className="h-64 bg-gray-800 rounded-2xl" />
        <div className="h-8 bg-gray-800 rounded w-1/2" />
        <div className="h-4 bg-gray-800 rounded w-1/3" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Banner */}
          <div className="relative h-72 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-900 to-gray-800">
            {event.banner ? (
              <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">🎭</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="badge bg-brand-500/20 text-brand-300 text-sm px-3 py-1">
                {event.category}
              </span>
            </div>
          </div>

          {/* Event info */}
          <div className="space-y-4">
            <h1 className="font-display font-bold text-4xl text-white">{event.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-400" />
                {format(new Date(event.date), 'EEEE, MMMM d, yyyy · h:mm a')}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                {event.venue.name}, {event.venue.city}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-400" />
                {event.availableSeats} of {event.totalSeats} seats available
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed">{event.description}</p>

            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span key={tag} className="badge bg-gray-800 text-gray-400 px-3 py-1">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Seat Map */}
          <div>
            <h2 className="font-display font-semibold text-2xl text-white mb-6">Select Your Seats</h2>
            {layout && (
              <SeatMap
                layout={layout}
                onSelectionChange={setSelectedSeats}
                maxSelect={8}
                realtimeUpdates={realtimeUpdates}
              />
            )}
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 space-y-5 sticky top-24">
            <h3 className="font-display font-semibold text-xl text-white">Your Booking</h3>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price range</span>
                <span className="text-white">₹{event.minPrice} – ₹{event.maxPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Available</span>
                <span className="text-white">{event.availableSeats} seats</span>
              </div>
            </div>

            {selectedSeats.length > 0 ? (
              <div className="bg-gray-800 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-gray-300">Selected Seats</p>
                {selectedSeats.map((seat) => (
                  <div key={seat._id} className="flex justify-between text-sm">
                    <span className="text-gray-400">{seat.section} · Row {seat.row} · {seat.seatNumber}</span>
                    <span className="text-white">₹{seat.price.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-gray-700 pt-3 flex justify-between font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-brand-400">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-xl p-6 text-center text-gray-500 text-sm">
                <Ticket className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Select seats from the map
              </div>
            )}

            <button
              onClick={handleBook}
              disabled={!selectedSeats.length || booking || event.isCancelled}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {booking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Ticket className="w-4 h-4" />
                  {event.isCancelled ? 'Event Cancelled' : 'Book Now'}
                </>
              )}
            </button>

            {!isAuthenticated && (
              <p className="text-center text-xs text-gray-500">
                <Link to="/login" className="text-brand-400 hover:underline">Login</Link> to book tickets
              </p>
            )}

            <p className="text-xs text-gray-600 text-center">
              Seats locked for 5 minutes after selection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
