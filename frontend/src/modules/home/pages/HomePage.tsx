import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Film,
  Music,
  Mic,
  Drama,
  Trophy,
  ArrowRight,
  Flame,
  ShieldCheck,
  Zap,
  MapPin,
} from 'lucide-react';
import { eventsApi } from '../../events/api';
import { Event } from '../../shared/types';
import { EventCard } from '../../events/components/EventCard';
import { useCityStore } from '../../shared/store/cityStore';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Coldplay: Music of the Spheres World Tour',
    category: 'CONCERT',
    subtitle: 'DY Patil Stadium, Mumbai · Live in India 2025',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80',
    link: '/events',
    tag: 'SELLING FAST',
    languages: 'English · Live Band',
  },
  {
    id: 2,
    title: 'Kalki 2898 AD (IMAX 3D)',
    category: 'MOVIE',
    subtitle: 'Prabhas, Amitabh Bachchan, Kamal Haasan, Deepika Padukone',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&q=80',
    link: '/events',
    tag: 'TRENDING #1',
    languages: 'Hindi, Telugu, Tamil, Malayalam (2D / 3D / IMAX 3D)',
  },
  {
    id: 3,
    title: 'IPL 2025: Mumbai Indians vs Chennai Super Kings',
    category: 'SPORTS',
    subtitle: 'Wankhede Stadium, Mumbai · High Voltage Clash',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1600&q=80',
    link: '/events',
    tag: 'EXCLUSIVE',
    languages: 'Live Stadium Experience',
  },
  {
    id: 4,
    title: 'Diljit Dosanjh: Dil-Luminati Tour India',
    category: 'MUSIC',
    subtitle: 'The Biggest Punjabi Musical Extravaganza of the Year',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80',
    link: '/events',
    tag: 'MEGA HIT',
    languages: 'Punjabi · Live Concert',
  },
];

const CATEGORY_STRIP = [
  { id: 'movie', name: 'Movies', icon: Film, color: 'bg-rose-500/20 text-[#f84464]' },
  { id: 'music', name: 'Concerts', icon: Music, color: 'bg-purple-500/20 text-purple-400' },
  { id: 'comedy', name: 'Comedy', icon: Mic, color: 'bg-amber-500/20 text-amber-400' },
  { id: 'theatre', name: 'Plays', icon: Drama, color: 'bg-blue-500/20 text-blue-400' },
  { id: 'sports', name: 'Sports', icon: Trophy, color: 'bg-emerald-500/20 text-emerald-400' },
  { id: 'stream', name: 'Stream', icon: Sparkles, color: 'bg-indigo-500/20 text-indigo-400' },
];

export const HomePage = () => {
  const { selectedCity } = useCityStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto carousel slide transition
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data } = await eventsApi.getAll({ city: selectedCity.name });
        if (!isCancelled) {
          setEvents(data.data || []);
        }
      } catch {
        console.error('Failed to fetch events');
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };
    fetchEvents();
    return () => {
      isCancelled = true;
    };
  }, [selectedCity]);

  const movies = events.filter((e) => e.category === 'movie' || e.tags?.includes('movie'));
  const cityLiveEvents = events.filter(
    (e) =>
      e.category !== 'movie' &&
      (e.venue?.city?.toLowerCase() === selectedCity.name.toLowerCase() ||
        e.venue?.city?.toLowerCase() === selectedCity.id.toLowerCase())
  );
  const liveEvents =
    cityLiveEvents.length > 0 ? cityLiveEvents : events.filter((e) => e.category !== 'movie');
  const isShowingNationwide = cityLiveEvents.length === 0 && liveEvents.length > 0;

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Promotional Banner Carousel */}
      <section className="relative w-full bg-gray-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="relative aspect-[21/9] sm:aspect-[24/8] md:aspect-[3/1] rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent flex items-center p-6 sm:p-12">
                  <div className="max-w-xl space-y-2 sm:space-y-3">
                    <span className="inline-block bg-[#f84464] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded">
                      {slide.tag}
                    </span>
                    <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-300 line-clamp-1">
                      {slide.subtitle}
                    </p>
                    <p className="text-[11px] sm:text-xs text-rose-300 font-medium">
                      {slide.languages}
                    </p>
                    <div className="pt-2">
                      <Link
                        to={slide.link}
                        className="inline-flex items-center gap-2 bg-[#f84464] hover:bg-[#e03050] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all"
                      >
                        Book Now <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Carousel Navigation Arrows */}
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2 sm:p-2.5 rounded-full backdrop-blur-sm border border-white/10 transition"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2 sm:p-2.5 rounded-full backdrop-blur-sm border border-white/10 transition"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-6 bg-[#f84464]' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Circular Category Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_STRIP.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/events?category=${cat.id}`}
                className="flex flex-col items-center gap-2 group min-w-[64px] shrink-0"
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${cat.color} flex items-center justify-center group-hover:scale-105 transition-all shadow-md group-hover:shadow-lg`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Recommended Movies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Recommended Movies in {selectedCity.name}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Explore movies currently screening near you
            </p>
          </div>
          <Link
            to="/events?category=movie"
            className="text-[#f84464] hover:text-rose-400 text-xs sm:text-sm font-semibold flex items-center gap-1"
          >
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {(movies.length > 0 ? movies : events).slice(0, 5).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Promotional Banner Strip (BookMyShow Stream) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2b3148] via-[#1a1f33] to-[#111422] p-6 sm:p-8 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
              <Sparkles className="w-3.5 h-3.5" /> BookMyShow Stream
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Endless Entertainment, Anywhere, Anytime
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Rent or buy handpicked movies from around the globe — from Academy Award winners to
              festival favorites.
            </p>
          </div>
          <Link
            to="/events?category=stream"
            className="shrink-0 bg-[#f84464] hover:bg-[#e03050] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all"
          >
            Explore Stream Catalog
          </Link>
        </div>
      </section>

      {/* 5. The Best of Live Events & Concerts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              The Best of Live Events {isShowingNationwide ? '' : `in ${selectedCity.name}`}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
              {isShowingNationwide ? (
                <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                  <MapPin className="w-3.5 h-3.5" /> Trending Across India
                </span>
              ) : (
                'Music concerts, standup comedy & stadium sports'
              )}
            </p>
          </div>
          <Link
            to="/events"
            className="text-[#f84464] hover:text-rose-400 text-xs sm:text-sm font-semibold flex items-center gap-1"
          >
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {liveEvents.slice(0, 5).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Why Book On BookMyShow Assurance Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center space-y-1">
            <div className="p-3 bg-[#f84464]/10 text-[#f84464] rounded-full mb-1">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Live Real-time Seats</h4>
            <p className="text-xs text-gray-400">
              Lock your exact seats with zero double booking risks
            </p>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="p-3 bg-[#f84464]/10 text-[#f84464] rounded-full mb-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">100% Instant Confirmation</h4>
            <p className="text-xs text-gray-400">
              Digital M-Tickets delivered directly to your device
            </p>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="p-3 bg-[#f84464]/10 text-[#f84464] rounded-full mb-1">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Exclusive Offers & Perks</h4>
            <p className="text-xs text-gray-400">
              Great discounts on top movies and live experiences
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
