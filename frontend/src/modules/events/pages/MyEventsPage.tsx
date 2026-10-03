import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Calendar,
  MapPin,
  PlusCircle,
  Eye,
  CheckCircle,
  AlertCircle,
  Tag,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { eventsApi } from '../api';
import { Event } from '../../shared/types';
import { useCityStore, POPULAR_CITIES } from '../../shared/store/cityStore';

export const MyEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedCity } = useCityStore();
  const navigate = useNavigate();

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data } = await eventsApi.getMyEvents();
      setEvents(data.data || []);
    } catch {
      toast.error('Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handlePublish = async (id: string) => {
    try {
      await eventsApi.publish(id);
      toast.success('Event published successfully!');
      loadEvents();
    } catch {
      toast.error('Failed to publish event');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this event?')) return;
    try {
      await eventsApi.cancel(id);
      toast.success('Event cancelled');
      loadEvents();
    } catch {
      toast.error('Failed to cancel event');
    }
  };

  const handleViewInCity = (event: Event) => {
    const cityName = event.venue?.city || 'Mumbai';
    const matchedCity = POPULAR_CITIES.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase()
    ) || {
      id: cityName.toLowerCase(),
      name: cityName,
      state: event.venue?.state || '',
      icon: '📍',
    };
    setSelectedCity(matchedCity);
    navigate(`/events/${event._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>🎭</span> My Created Events
            {!loading && (
              <span className="text-xs bg-[#f84464]/20 text-[#f84464] border border-[#f84464]/30 px-2.5 py-1 rounded-full font-bold">
                {events.length} {events.length === 1 ? 'Show' : 'Shows'}
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage your live listings, seat capacities, and view your shows as attendees see them.
          </p>
        </div>

        <Link
          to="/events/create"
          className="inline-flex items-center gap-2 bg-[#f84464] hover:bg-[#e03050] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-rose-950/40 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> List New Event
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-900 rounded-2xl border border-gray-800" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/40 rounded-2xl border border-gray-800 space-y-4 max-w-lg mx-auto px-6">
          <span className="text-5xl">🎪</span>
          <h3 className="text-lg font-bold text-white">No events created yet</h3>
          <p className="text-xs text-gray-400">
            You haven't listed any shows yet. Create your first event to start accepting ticket
            bookings.
          </p>
          <div className="pt-2">
            <Link
              to="/events/create"
              className="inline-flex items-center gap-2 bg-[#f84464] hover:bg-[#e03050] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Create Your First Event
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isLive = event.isPublished && !event.isCancelled;
            return (
              <div
                key={event._id}
                className="bg-gray-900/80 border border-gray-800 hover:border-gray-700 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all"
              >
                <div>
                  {/* Banner / Poster Thumbnail */}
                  <div className="relative aspect-[16/9] w-full bg-gray-950 overflow-hidden">
                    <img
                      src={
                        event.banner ||
                        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80'
                      }
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-[#f84464] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                        {event.category}
                      </span>
                      {isLive ? (
                        <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Live
                        </span>
                      ) : event.isCancelled ? (
                        <span className="bg-rose-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Cancelled
                        </span>
                      ) : (
                        <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-white line-clamp-1">{event.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2">{event.description}</p>

                    <div className="space-y-1.5 text-xs text-gray-300 pt-1">
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-[#f84464] shrink-0" />
                        <span className="truncate">
                          {event.venue?.name},{' '}
                          <strong className="text-white">{event.venue?.city}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-3.5 h-3.5 text-[#f84464] shrink-0" />
                        <span>{format(new Date(event.date), 'EEE, d MMM yyyy, h:mm a')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>
                          {event.availableSeats} of {event.totalSeats} seats remaining
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-950/60 border-t border-gray-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleViewInCity(event)}
                    className="inline-flex items-center gap-1.5 bg-[#f84464] hover:bg-[#e03050] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Live Show
                  </button>

                  <div className="flex items-center gap-2">
                    {!event.isPublished && !event.isCancelled && (
                      <button
                        onClick={() => handlePublish(event._id)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold px-2 py-1"
                      >
                        Publish
                      </button>
                    )}
                    {isLive && (
                      <button
                        onClick={() => handleCancel(event._id)}
                        className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2 py-1"
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
