import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '../../shared/types';
import clsx from 'clsx';

const CATEGORY_COLORS: Record<string, string> = {
  music: 'bg-purple-500/20 text-purple-300',
  sports: 'bg-green-500/20 text-green-300',
  tech: 'bg-blue-500/20 text-blue-300',
  art: 'bg-pink-500/20 text-pink-300',
  food: 'bg-orange-500/20 text-orange-300',
  comedy: 'bg-yellow-500/20 text-yellow-300',
  theatre: 'bg-red-500/20 text-red-300',
  other: 'bg-gray-500/20 text-gray-300',
};

interface Props {
  event: Event;
}

export const EventCard = ({ event }: Props) => {
  const soldOut = event.availableSeats === 0;

  return (
    <Link
      to={`/events/${event._id}`}
      className="card group hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-br from-brand-900 to-gray-800 overflow-hidden">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-30">🎭</span>
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-gray-950/70 flex items-center justify-center">
            <span className="text-red-400 font-display font-bold text-lg">SOLD OUT</span>
          </div>
        )}
        <span
          className={clsx(
            'badge absolute top-3 left-3',
            CATEGORY_COLORS[event.category] || CATEGORY_COLORS.other
          )}
        >
          {event.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-display font-semibold text-lg text-white line-clamp-2 group-hover:text-brand-400 transition-colors">
          {event.title}
        </h3>

        <div className="space-y-1.5 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-400 flex-shrink-0" />
            <span>{format(new Date(event.date), 'EEE, MMM d · h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
            <span className="truncate">
              {event.venue.name}, {event.venue.city}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <div>
            <p className="text-xs text-gray-500">Starting from</p>
            <p className="font-semibold text-white">₹{event.minPrice.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">{event.availableSeats} seats left</p>
            <div className="w-24 h-1.5 bg-gray-800 rounded-full mt-1">
              <div
                className="h-full bg-brand-500 rounded-full"
                style={{
                  width: `${Math.max(5, (event.availableSeats / event.totalSeats) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
