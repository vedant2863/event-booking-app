import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, MapPin, ArrowLeft, Ticket, Star, Sparkles, Share2, Film } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../auth/store/authStore';
import { bookingsApi } from '../../shared/api/services';
import { Event, Seat, SeatLayout } from '../../shared/types';
import { SeatMap } from '../../seats/components/SeatMap';
import { useEventRoom } from '../../seats/hooks/useSocket';
import { eventsApi } from '../api';
import { ShowtimePicker } from '../components/ShowtimePicker';
import { PaymentModal } from '../../bookings/components/PaymentModal';

type SeatUpdate = { seatId: string; status: 'seat:locked' | 'seat:released' | 'seat:booked' };

export const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [event, setEvent] = useState<Event | null>(null);
  const [layout, setLayout] = useState<SeatLayout | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [booking, setBooking] = useState(false);
  const [realtimeUpdates, setRealtimeUpdates] = useState<SeatUpdate[]>([]);

  // Showtime & Cinema Selection State
  const [selectedCinema, setSelectedCinema] = useState<string>('PVR: INORBIT Mall, Malad (W)');
  const [selectedShowtime, setSelectedShowtime] = useState<string>('08:30 PM (IMAX 3D)');
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [showSeatMap, setShowSeatMap] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

  const bookingSectionRef = useRef<HTMLDivElement>(null);

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
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to load event details');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleShowtimeSelect = (
    cinema: string,
    showtime: string,
    dateStr?: string,
    _price?: number
  ) => {
    setSelectedCinema(cinema);
    setSelectedShowtime(showtime);
    if (dateStr) setSelectedDate(dateStr);
    setShowSeatMap(true);
    setSelectedSeats([]);
    // Smooth scroll to seat map
    setTimeout(() => {
      bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleProceedToPayment = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book your tickets');
      navigate('/login');
      return;
    }
    if (!selectedSeats.length) {
      toast.error('Please select at least one seat to continue');
      return;
    }

    setBooking(true);
    try {
      // Step 1: Lock seats in Redis & MongoDB
      await bookingsApi.create({
        eventId: id!,
        seatIds: selectedSeats.map((s) => s._id),
      });
      toast.success('Seats locked for 5 minutes! Proceeding to payment...');
      setIsPaymentModalOpen(true);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message || 'Could not lock seats. They may already be taken.'
      );
    } finally {
      setBooking(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Confirm payment & generate M-Ticket
      const { data } = await bookingsApi.create({
        eventId: id!,
        seatIds: selectedSeats.map((s) => s._id),
      });
      await bookingsApi.confirmPayment(data.data!._id);
      setIsPaymentModalOpen(false);
      toast.success('🎉 Booking Confirmed! Here is your M-Ticket.');
      navigate(`/bookings/${data.data!._id}`);
    } catch {
      // Direct navigation if booking exists
      navigate('/bookings');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-80 bg-gray-900 rounded-3xl" />
        <div className="h-8 bg-gray-900 rounded w-1/3" />
        <div className="h-4 bg-gray-900 rounded w-1/2" />
      </div>
    );
  }

  if (!event) return null;

  const ticketSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="pb-20 space-y-10">
      {/* 1. BookMyShow Cinematic Hero Backdrop */}
      <section className="relative bg-gradient-to-b from-[#1f2533] via-gray-950 to-gray-950 border-b border-gray-800">
        {/* Background Blurred Banner */}
        {event.banner && (
          <div className="absolute inset-0 opacity-15 overflow-hidden pointer-events-none">
            <img
              src={event.banner}
              alt={event.title}
              className="w-full h-full object-cover blur-2xl"
            />
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb / Back Link */}
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Movies & Events
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Movie Poster */}
            <div className="relative aspect-[2/3] w-56 sm:w-64 rounded-2xl overflow-hidden bg-gray-900 shadow-2xl border border-gray-700 shrink-0">
              <img
                src={
                  event.banner ||
                  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80'
                }
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/80 p-2 text-center text-xs font-bold text-white flex items-center justify-center gap-1">
                <Film className="w-3.5 h-3.5 text-[#f84464]" />
                <span>In Cinemas · Now Showing</span>
              </div>
            </div>

            {/* Movie Information & Action */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="bg-[#f84464] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    {event.category.toUpperCase()}
                  </span>
                  <span className="bg-gray-800 text-gray-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-gray-700">
                    UA 16+
                  </span>
                  <span className="bg-gray-800 text-gray-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-gray-700">
                    2D, 3D, IMAX 3D
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {event.title}
                </h1>

                <p className="text-xs sm:text-sm text-gray-300">
                  {event.tags?.join(' • ') || 'Action • Sci-Fi • Drama'} | Hindi, English, Telugu,
                  Tamil | 2h 45m
                </p>
              </div>

              {/* Rating Card Widget */}
              <div className="inline-flex items-center gap-4 bg-gray-900/90 border border-gray-800 px-4 py-2.5 rounded-xl shadow-md">
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-[#f84464] fill-[#f84464]" />
                  <div>
                    <p className="text-sm font-black text-white">9.2/10</p>
                    <p className="text-[10px] text-gray-400">124.5K Ratings</p>
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-gray-800" />
                <button
                  onClick={() => toast.success('Thanks for rating this show!')}
                  className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-700"
                >
                  Rate Now
                </button>
              </div>

              {/* Venue & Time Summary */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#f84464]" />
                  <span>{format(new Date(event.date), 'EEE, d MMM yyyy')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#f84464]" />
                  <span>
                    {event.venue.name}, {event.venue.city}
                  </span>
                </div>
              </div>

              {/* CTA Book Tickets Button */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => {
                    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#f84464] hover:bg-[#e03050] text-white font-extrabold text-sm sm:text-base px-8 py-3 rounded-xl shadow-lg shadow-rose-950/50 transition-all flex items-center gap-2"
                >
                  <Ticket className="w-5 h-5" /> Book Tickets
                </button>
                <button
                  onClick={() => toast.success('Link copied to clipboard!')}
                  className="p-3 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white rounded-xl border border-gray-800"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Booking & Showtime Section */}
      <div ref={bookingSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-gray-800 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {showSeatMap ? 'Select Seats' : 'Select Date & Showtime'}
            </h2>
            {showSeatMap && (
              <button
                onClick={() => setShowSeatMap(false)}
                className="text-xs text-[#f84464] hover:underline font-semibold"
              >
                Change Showtime
              </button>
            )}
          </div>
          <span className="text-xs text-gray-400">
            {event.availableSeats} of {event.totalSeats} seats available
          </span>
        </div>

        {/* Step A: Showtime Picker */}
        {!showSeatMap && <ShowtimePicker event={event} onSelectShowtime={handleShowtimeSelect} />}

        {/* Step B: Auditorium Seat Selection & Sticky Checkout Bar */}
        {showSeatMap && layout && (
          <div className="space-y-6">
            <SeatMap
              layout={layout}
              onSelectionChange={setSelectedSeats}
              maxSelect={8}
              realtimeUpdates={realtimeUpdates}
              cinemaName={selectedCinema}
              showtime={`${selectedDate} • ${selectedShowtime}`}
            />

            {/* Bottom Checkout Sticky Bar */}
            <div className="sticky bottom-4 z-30 bg-gray-900/95 backdrop-blur-xl border border-gray-800 p-4 sm:p-5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                {selectedSeats.length > 0 ? (
                  <>
                    <p className="text-xs text-gray-400">
                      {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected:
                      <strong className="text-white ml-1 font-mono">
                        {selectedSeats.map((s) => s.seatNumber).join(', ')}
                      </strong>
                    </p>
                    <p className="text-lg font-black text-white">
                      ₹{ticketSubtotal.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-gray-400">+ convenience fees</span>
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-gray-400">
                    Click seats on the auditorium layout to proceed to payment
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowSeatMap(false)}
                  className="btn-secondary text-xs px-4 py-3 sm:w-auto"
                >
                  Change Showtime
                </button>
                <button
                  onClick={handleProceedToPayment}
                  disabled={!selectedSeats.length || booking}
                  className="bg-[#f84464] hover:bg-[#e03050] text-white font-bold text-sm px-8 py-3 rounded-xl shadow-lg transition-all flex-1 sm:flex-none flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {booking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Locking Seats...
                    </>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      Proceed to Pay
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. About the Movie & Details */}
        <div className="pt-8 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-white">About the Movie / Event</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{event.description}</p>

            <div className="pt-4 space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Tags & Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.tags?.map((t) => (
                  <span
                    key={t}
                    className="badge bg-gray-900 text-gray-300 border border-gray-800 px-3 py-1"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="text-base font-bold text-white">Cinema & Venue</h3>
            <div className="space-y-2 text-xs text-gray-300">
              <p className="font-semibold text-white">{event.venue.name}</p>
              <p className="text-gray-400">{event.venue.address}</p>
              <p className="text-gray-400">
                {event.venue.city}, {event.venue.state}, India
              </p>
            </div>
            <div className="pt-2 border-t border-gray-800 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Direct Entry via M-Ticket
            </div>
          </div>
        </div>
      </div>

      {/* 4. BookMyShow Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        seats={selectedSeats}
        eventTitle={event.title}
        cinemaName={selectedCinema}
        showtime={`${selectedDate} • ${selectedShowtime}`}
      />
    </div>
  );
};
