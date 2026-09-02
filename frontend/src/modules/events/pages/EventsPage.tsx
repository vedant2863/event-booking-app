import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, X, Film, Sparkles } from 'lucide-react';
import { eventsApi } from '../api';
import { Event } from '../../shared/types';
import { EventCard } from '../components/EventCard';
import { useCityStore } from '../../shared/store/cityStore';

const CATEGORIES = [
  { id: '', label: 'All Experiences' },
  { id: 'movie', label: 'Movies' },
  { id: 'music', label: 'Concerts & Music' },
  { id: 'comedy', label: 'Standup Comedy' },
  { id: 'theatre', label: 'Plays & Theatre' },
  { id: 'sports', label: 'Sports & Matches' },
  { id: 'stream', label: 'Stream' },
  { id: 'art', label: 'Art & Exhibitions' },
  { id: 'food', label: 'Food & Dining' },
];

export const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCity, openModal } = useCityStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    let isCancelled = false;
    const loadEvents = async () => {
      setLoading(true);
      try {
        const { data } = await eventsApi.getAll({
          page,
          search: search || undefined,
          category: category || undefined,
          city: selectedCity?.name || undefined,
        });
        if (!isCancelled) {
          setEvents(data.data || []);
          setTotalPages(data.pagination?.pages || 1);
        }
      } catch {
        if (!isCancelled) {
          console.error('Failed to fetch events');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadEvents();
    return () => {
      isCancelled = true;
    };
  }, [page, search, category, selectedCity]);

  const handleCategorySelect = (catId: string) => {
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (catId) {
      newParams.set('category', catId);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (val: string) => {
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('search', val);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & City Display */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {category
              ? `${CATEGORIES.find((c) => c.id === category)?.label || 'Events'} in ${selectedCity?.name || 'Mumbai'}`
              : `Explore Entertainment in ${selectedCity?.name || 'Mumbai'}`}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Book movie tickets, live concerts, sports and activities near you
          </p>
        </div>

        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-gray-900 border border-gray-700 hover:border-[#f84464] px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-200 transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 text-[#f84464]" />
          <span>
            Location: <strong className="text-white">{selectedCity?.name || 'Mumbai'}</strong>
          </span>
          <span className="text-[10px] text-[#f84464] ml-1">Change</span>
        </button>
      </div>

      {/* Category Filter Pills (BookMyShow Style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              category === cat.id
                ? 'bg-[#f84464] text-white shadow-md shadow-rose-950/50'
                : 'bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 hover:border-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Filter Strip */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by title, artist, venue, or language..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#f84464] transition-colors"
          />
          {search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/40 rounded-2xl border border-gray-800 space-y-4 max-w-xl mx-auto px-6">
          <span className="text-5xl">🎟️</span>
          <h3 className="text-lg font-bold text-white">No shows found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            We couldn't find any{' '}
            {category ? CATEGORIES.find((c) => c.id === category)?.label : 'events'} matching your
            filters in{' '}
            <strong className="text-gray-200">{selectedCity?.name || 'this city'}</strong>.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/events?category=movie"
              className="inline-flex items-center gap-2 bg-[#f84464] hover:bg-[#e03050] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all"
            >
              <Film className="w-3.5 h-3.5" /> Browse Blockbuster Movies
            </Link>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-700 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Switch Location
            </button>
            <button
              onClick={clearFilters}
              className="text-xs text-gray-400 hover:text-white underline py-1"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                    p === page
                      ? 'bg-[#f84464] text-white'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
