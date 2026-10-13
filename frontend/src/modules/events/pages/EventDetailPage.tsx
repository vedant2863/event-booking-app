import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Calendar,
  MapPin,
  ArrowLeft,
  Ticket,
  Star,
  Sparkles,
  Share2,
  Film,
  Music,
  Flame,
  Trophy,
  Drama,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../auth/store/authStore';
import { bookingsApi } from '../../bookings/api';
import { Event } from '../types/event.types';
import { Booking } from '../../bookings/types/booking.types';
import { Seat, SeatLayout, SeatUpdate } from '../../seats/types/seat.types';
import { SeatMap } from '../../seats/components/SeatMap';
import { useEventRoom } from '../../seats/hooks/useSocket';
import { eventsApi } from '../api';
import { ShowtimePicker } from '../components/ShowtimePicker';
import { PaymentModal } from '../../bookings/components/PaymentModal';

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
  const [selectedCinema, setSelectedCinema] = useState<string>('');
  const [selectedShowtime, setSelectedShowtime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [showSeatMap, setShowSeatMap] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  const bookingSectionRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const resetScroll = () => {
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  // Listen to window scroll to display sticky header past hero
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 360);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll window to top whenever opening/navigating to event detail page
  useEffect(() => {
    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    const timer = setTimeout(resetScroll, 60);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [id]);

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
        const ev = data.data!.event;
        setEvent(ev);
        setLayout(data.data!.layout);

        const vName =
          typeof ev.venue === 'string'
            ? (() => {
                try {
                  return JSON.parse(ev.venue).name;
                } catch {
                  return ev.venue;
                }
              })()
            : ev.venue?.name;
        setSelectedCinema(vName || 'Featured Venue');

        if (ev.category !== 'movie' && ev.date) {
          try {
            setSelectedShowtime(`${format(new Date(ev.date), 'hh:mm a')} (Main Show)`);
          } catch {
            setSelectedShowtime('07:30 PM (Main Show)');
          }
        } else {
          setSelectedShowtime('08:30 PM (IMAX 3D)');
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to load event details');
        navigate('/events');
      } finally {
        setLoading(false);
        resetScroll();
        setTimeout(resetScroll, 50);
      }
    };
    fetch();
  }, [id, navigate]);

  useEffect(() => {
    if (event?.title) {
      document.title = `${event.title} - Book Tickets | BookMyShow`;
    }
  }, [event?.title]);

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
      // Step 1: Lock seats and create pending booking
      const { data } = await bookingsApi.create({
        eventId: id!,
        seatIds: selectedSeats.map((s) => s._id),
      });
      if (data.data) {
        setCurrentBooking(data.data);
      }
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
    if (!currentBooking?._id) {
      toast.error('Booking session expired or not found. Please select seats again.');
      return;
    }
    try {
      // Step 2: Confirm payment & generate M-Ticket
      await bookingsApi.confirmPayment(currentBooking._id);
      setIsPaymentModalOpen(false);
      toast.success('🎉 Booking Confirmed! Here is your M-Ticket.');
      navigate(`/bookings/${currentBooking._id}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Payment confirmation failed');
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

  const isMovie = event.category === 'movie';
  const isConcert = event.category === 'music';
  const isComedy = event.category === 'comedy';
  const isSports = event.category === 'sports';
  const isTheatre = event.category === 'theatre';

  const venueObj =
    typeof event.venue === 'string'
      ? (() => {
          try {
            return JSON.parse(event.venue);
          } catch {
            return { name: event.venue };
          }
        })()
      : event.venue || {};

  const venueName = venueObj.name || 'Grand Arena';
  const venueCity = venueObj.city || 'Mumbai';
  const venueAddress = venueObj.address || '';
  const venueState = venueObj.state || '';

  const CategoryIcon = isMovie
    ? Film
    : isConcert
    ? Music
    : isComedy
    ? Flame
    : isSports
    ? Trophy
    : isTheatre
    ? Drama
    : Sparkles;

  const experienceBadge = isMovie
    ? 'In Cinemas · Now Showing'
    : isConcert
    ? 'Live Concert · Mega Arena Tour'
    : isComedy
    ? 'Standup Comedy · Live Show'
    : isSports
    ? 'Stadium Match · Live In Action'
    : isTheatre
    ? 'Live Stage Play · Musical'
    : 'Live Experience';

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
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 flex-wrap">
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Movies & Events
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-400 capitalize">{event.category}</span>
            <span className="text-gray-600">/</span>
            <span className="text-white font-semibold truncate max-w-sm">{event.title}</span>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Event Poster */}
            <div className="relative aspect-[2/3] w-56 sm:w-64 rounded-2xl overflow-hidden bg-gray-900 shadow-2xl border border-gray-700 shrink-0">
              <img
                src={
                  event.banner ||
                  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80'
                }
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/85 backdrop-blur-sm p-2 text-center text-xs font-bold text-white flex items-center justify-center gap-1.5">
                <CategoryIcon className="w-3.5 h-3.5 text-[#f84464]" />
                <span>{experienceBadge}</span>
              </div>
            </div>

            {/* Event Information & Action */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="bg-[#f84464] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                    {event.category.toUpperCase()}
                  </span>
                  <span className="bg-gray-800 text-gray-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-gray-700">
                    {isMovie ? 'UA 16+' : isComedy ? 'AGE 16+' : 'ALL AGES'}
                  </span>
                  <span className="bg-gray-800 text-gray-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-gray-700">
                    {isMovie
                      ? '2D, 3D, IMAX 3D'
                      : isConcert
                      ? 'LIVE STAGE ARENA'
                      : isSports
                      ? 'STADIUM STANDS'
                      : 'RESERVED AUDITORIUM'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {event.title}
                </h1>

                <p className="text-xs sm:text-sm text-gray-300">
                  {event.tags?.join(' • ') ||
                    (isMovie ? 'Action • Sci-Fi • Drama' : 'Live Musical Performance')}{' '}
                  |{' '}
                  {isMovie
                    ? 'Hindi, English, Telugu, Tamil | 2h 45m'
                    : 'Live Performance | Gates open 2 hrs before show'}
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
                  className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-700 cursor-pointer"
                >
                  Rate Now
                </button>
              </div>

              {/* Venue & Time Summary */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#f84464]" />
                  <span>{format(new Date(event.date), 'EEE, d MMM yyyy • hh:mm a')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#f84464]" />
                  <span>
                    {venueName}, {venueCity}
                  </span>
                </div>
              </div>

              {/* CTA Book Tickets Button */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => {
                    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#f84464] hover:bg-[#e03050] text-white font-extrabold text-sm sm:text-base px-8 py-3 rounded-xl shadow-lg shadow-rose-950/50 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Ticket className="w-5 h-5" /> Book Tickets
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="p-3 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white rounded-xl border border-gray-800 cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky BookMyShow Sub-Header when scrolled past hero */}
      {isScrolled && (
        <aside
          aria-label="Quick event actions"
          className="sticky top-16 z-30 bg-gray-950/95 backdrop-blur-md border-b border-gray-800 shadow-xl py-3 px-4 transition-all"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={
                  event.banner ||
                  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80'
                }
                alt={event.title}
                className="w-9 h-12 object-cover rounded-md border border-gray-700 shrink-0 hidden sm:block"
              />
              <div className="min-w-0">
                <h3 className="font-extrabold text-white text-sm sm:text-base truncate">
                  {event.title}
                </h3>
                <p className="text-[11px] text-gray-400 truncate flex items-center gap-2">
                  <span className="text-[#f84464] font-semibold">{event.category.toUpperCase()}</span>
                  <span>•</span>
                  <span>
                    {venueName}, {venueCity}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {!showSeatMap ? (
                <button
                  onClick={() =>
                    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="bg-[#f84464] hover:bg-[#e03050] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg shadow cursor-pointer transition-all hover:scale-105"
                >
                  Book Tickets
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowSeatMap(false)}
                    className="text-xs text-gray-300 hover:text-white bg-gray-900 border border-gray-700 px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    Change Showtime
                  </button>
                  {selectedSeats.length > 0 && (
                    <button
                      onClick={handleProceedToPayment}
                      disabled={booking}
                      className="bg-[#f84464] hover:bg-[#e03050] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg shadow cursor-pointer transition-all hover:scale-105"
                    >
                      Pay ₹{ticketSubtotal}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* 2. Main Booking & Showtime Section */}
      <div ref={bookingSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-gray-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#f84464] uppercase tracking-wider">
              <CategoryIcon className="w-4 h-4" />
              <span>{event.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {showSeatMap ? `Select Seats (${selectedCinema})` : 'Select Date & Showtime'}
              </h2>
              {showSeatMap && (
                <button
                  onClick={() => setShowSeatMap(false)}
                  className="text-xs text-[#f84464] hover:underline font-semibold cursor-pointer"
                >
                  Change Showtime
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
              <strong className="text-white font-bold">{event.availableSeats}</strong> of{' '}
              {event.totalSeats} seats available
            </span>
          </div>
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
              eventName={event.title}
              category={event.category}
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
        booking={currentBooking}
        seats={selectedSeats}
        eventTitle={event.title}
        cinemaName={selectedCinema}
        showtime={`${selectedDate} • ${selectedShowtime}`}
      />
    </div>
  );
};
