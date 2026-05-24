import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { eventsApi } from '../api';
import { Event, EventCategory } from '../../shared/types';
import { EventCard } from '../components/EventCard';

const CATEGORIES: EventCategory[] = [
  'music',
  'sports',
  'tech',
  'art',
  'food',
  'comedy',
  'theatre',
  'other',
];

export const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await eventsApi.getAll({
        page,
        search: search || undefined,
        category: category || undefined,
        city: city || undefined,
      });
      setEvents(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [page, search, category, city]);

  useEffect(() => {
    (async () => {
      await fetchEvents();
    })();
  }, [fetchEvents]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display font-bold text-4xl text-white mb-8">Browse Events</h1>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search events..."
            className="input pl-10"
          />
        </div>
        <input
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setPage(1);
          }}
          placeholder="City"
          className="input sm:w-40"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="input sm:w-44"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-800" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">No events match your search.</p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('');
              setCity('');
            }}
            className="btn-ghost mt-4"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    p === page
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
