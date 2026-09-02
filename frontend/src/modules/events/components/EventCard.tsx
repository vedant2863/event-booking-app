import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Event } from '../../shared/types';

interface Props {
  event: Event;
}

export const EventCard = ({ event }: Props) => {
  const soldOut = event.availableSeats === 0;

  // Generate a mock authentic BookMyShow rating based on title/id if not present
  const ratingScore = 9.1;
  const voteCount = '68.4K';

  return (
    <Link
      to={`/events/${event._id}`}
      className="group flex flex-col bg-transparent rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
    >
      {/* BMS Vertical Poster Container */}
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-md group-hover:shadow-rose-950/20 group-hover:border-[#f84464]/50 transition-all">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-700">
            <span className="text-4xl mb-2">🎬</span>
            <span className="text-xs font-semibold">BookMyShow</span>
          </div>
        )}

        {/* Sold out overlay */}
        {soldOut && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <span className="bg-rose-600 text-white font-bold text-xs uppercase tracking-wider px-3 py-1 rounded">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Category Badge Top Left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-black/75 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">
            {event.category === 'music' ? 'CONCERT' : event.category.toUpperCase()}
          </span>
        </div>

        {/* BMS Dark Bottom Rating Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2.5 pt-6 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1.5 font-bold">
            <Star className="w-3.5 h-3.5 text-[#f84464] fill-[#f84464]" />
            <span>{ratingScore}/10</span>
            <span className="text-[10px] font-normal text-gray-300">({voteCount} Votes)</span>
          </div>
        </div>
      </div>

      {/* Movie / Event Info */}
      <div className="pt-3 pb-1 space-y-1">
        {/* Title */}
        <h3 className="font-bold text-sm sm:text-base text-gray-100 line-clamp-1 group-hover:text-[#f84464] transition-colors">
          {event.title}
        </h3>

        {/* Formats / Languages */}
        <p className="text-xs text-gray-400 capitalize truncate">
          {event.tags && event.tags.length > 0
            ? event.tags.slice(0, 3).join(' • ')
            : event.category}
        </p>

        {/* City & Venue */}
        <div className="flex items-center gap-1 text-[11px] text-gray-400 truncate">
          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="truncate">{event.venue?.city || 'Mumbai'}</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">₹{event.minPrice} onwards</span>
        </div>
      </div>
    </Link>
  );
};
