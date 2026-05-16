import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import { eventsApi } from '../api/services';
import { Event } from '../types';
import { EventCard } from '../components/events/EventCard';

const CATEGORIES = ['All', 'music', 'sports', 'tech', 'art', 'food', 'comedy', 'theatre'];

export const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = category !== 'All' ? { category } : {};
        const { data } = await eventsApi.getAll(params);
        setEvents(data.data || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetchEvents();
  }, [category]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 py-24 px-4">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-gray-950 to-gray-950 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm px-4 py-1.5 rounded-full">
            <Zap className="w-3 h-3" />
            Real-time seat selection
          </div>
          <h1 className="font-display font-extrabold text-5xl sm:text-7xl text-white leading-tight">
            Book Unforgettable<br />
            <span className="text-brand-400">Experiences</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            From live concerts to tech conferences — find your next event, pick your seats, and secure your spot instantly.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/events" className="btn-primary flex items-center gap-2">
              Browse Events <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register" className="btn-secondary">Get Started Free</Link>
          </div>

          <div className="flex items-center justify-center gap-8 pt-4 text-sm text-gray-500">
            {[
              { icon: Shield, text: 'Secure payments' },
              { icon: Clock, text: '5-min seat locks' },
              { icon: Zap, text: 'Instant confirmation' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="w-4 h-4 text-brand-400" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-bold text-3xl text-white">Upcoming Events</h2>
          <Link to="/events" className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {cat === 'All' ? cat : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-800" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-800 rounded w-1/2" />
                  <div className="h-4 bg-gray-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <p className="text-5xl mb-4">🎭</p>
            <p className="text-lg">No events found. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
