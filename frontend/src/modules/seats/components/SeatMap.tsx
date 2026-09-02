import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { Seat } from '../../shared/types';
import { Lock, Armchair, Sparkles } from 'lucide-react';

interface Props {
  layout: Record<string, Record<string, Seat[]>>;
  onSelectionChange: (seats: Seat[]) => void;
  maxSelect?: number;
  realtimeUpdates?: { seatId: string; status: string }[];
  cinemaName?: string;
  showtime?: string;
}

const VEHICLE_ICONS: Record<number, { icon: string; label: string }> = {
  1: { icon: '🚲', label: 'Cycle' },
  2: { icon: '🛵', label: 'Scooter' },
  3: { icon: '🛺', label: 'Auto' },
  4: { icon: '🚗', label: 'Car' },
  5: { icon: '🚐', label: 'Van' },
  6: { icon: '🚌', label: 'Bus' },
  7: { icon: '✈️', label: 'Flight' },
  8: { icon: '🚀', label: 'Rocket' },
};

export const SeatMap = ({
  layout,
  onSelectionChange,
  maxSelect = 8,
  realtimeUpdates = [],
  cinemaName = 'PVR: INORBIT Mall',
  showtime = '08:30 PM (IMAX 3D)',
}: Props) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [targetSeatsCount, setTargetSeatsCount] = useState(2);

  // Apply real-time seat updates cleanly with useMemo
  const localLayout = useMemo(() => {
    if (!realtimeUpdates.length) return layout;
    const updated: Record<string, Record<string, Seat[]>> = JSON.parse(JSON.stringify(layout));
    for (const update of realtimeUpdates) {
      for (const rows of Object.values(updated)) {
        for (const seats of Object.values(rows)) {
          const seat = seats.find((s) => s._id === update.seatId);
          if (seat) {
            seat.status =
              update.status === 'seat:locked'
                ? 'locked'
                : update.status === 'seat:booked'
                  ? 'booked'
                  : 'available';
          }
        }
      }
    }
    return updated;
  }, [layout, realtimeUpdates]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status !== 'available') return;

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(seat._id)) {
        next.delete(seat._id);
      } else {
        const effectiveLimit = Math.min(targetSeatsCount, maxSelect);
        if (next.size >= effectiveLimit) {
          next.clear();
        }
        next.add(seat._id);
      }

      // Collect selected seat objects
      const selectedSeats: Seat[] = [];
      for (const rows of Object.values(localLayout)) {
        for (const row of Object.values(rows)) {
          for (const s of row) {
            if (next.has(s._id)) selectedSeats.push(s);
          }
        }
      }
      onSelectionChange(selectedSeats);
      return next;
    });
  };

  return (
    <div className="space-y-8 bg-gray-950 border border-gray-800 rounded-3xl p-4 sm:p-8 shadow-2xl animate-fade-in">
      {/* Top Auditorium Info Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <span className="text-xs font-bold text-[#f84464] uppercase tracking-wider">
            Auditorium Seat Layout
          </span>
          <h3 className="text-lg font-extrabold text-white">{cinemaName}</h3>
          <p className="text-xs text-gray-400">{showtime}</p>
        </div>

        {/* Number of Seats Selector Modal Strip (BMS Iconic Feature) */}
        <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 p-1.5 rounded-xl">
          <span className="text-[11px] font-semibold text-gray-400 px-2">Seats:</span>
          {[1, 2, 3, 4, 5, 6, 8].map((num) => (
            <button
              key={num}
              onClick={() => {
                setTargetSeatsCount(num);
                setSelected(new Set());
                onSelectionChange([]);
              }}
              className={`w-8 h-8 rounded-lg text-xs font-extrabold flex items-center justify-center transition-all ${
                targetSeatsCount === num
                  ? 'bg-[#f84464] text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              title={`${num} Seats (${VEHICLE_ICONS[num]?.label || ''})`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-gray-300 bg-gray-900/60 py-2.5 px-4 rounded-xl border border-gray-800/80">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gray-800 border border-emerald-500/50" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center">
            ✓
          </div>
          <span>
            Selected ({selected.size}/{targetSeatsCount})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-amber-600/80 border border-amber-500 flex items-center justify-center">
            <Lock className="w-3 h-3 text-white" />
          </div>
          <span>Locked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gray-800/60 border border-gray-800" />
          <span>Booked</span>
        </div>
      </div>

      {/* Seating Tiers */}
      <div className="space-y-8 overflow-x-auto py-2">
        {Object.entries(localLayout).map(([section, rows]) => {
          const sectionPrice = Object.values(rows)[0]?.[0]?.price || 350;
          const isRecliner =
            section.toLowerCase().includes('recliner') ||
            section.toLowerCase().includes('gold') ||
            section.toLowerCase().includes('vip');

          return (
            <div key={section} className="space-y-3 min-w-max mx-auto text-center">
              {/* Section Header */}
              <div className="flex items-center justify-center gap-2 border-b border-gray-800/60 pb-1.5 max-w-xl mx-auto">
                {isRecliner && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                <h4 className="font-bold text-xs uppercase tracking-widest text-gray-300">
                  {section} — ₹{sectionPrice.toLocaleString()}
                </h4>
              </div>

              {/* Rows */}
              <div className="space-y-2 inline-block">
                {Object.entries(rows).map(([row, seats]) => (
                  <div key={row} className="flex items-center justify-center gap-2">
                    <span className="text-[11px] font-bold text-gray-500 w-6 text-center font-mono">
                      {row}
                    </span>
                    <div className="flex gap-1.5 sm:gap-2">
                      {seats.map((seat) => (
                        <button
                          key={seat._id}
                          onClick={() => toggleSeat(seat)}
                          disabled={seat.status !== 'available'}
                          title={`${section} - Row ${row} - Seat ${seat.seatNumber} (₹${seat.price})`}
                          className={clsx(
                            'w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-mono font-bold transition-all duration-150 flex items-center justify-center select-none',
                            seat.status === 'available' &&
                              !selected.has(seat._id) &&
                              'seat-available',
                            seat.status === 'locked' && 'seat-locked',
                            seat.status === 'booked' && 'seat-booked',
                            selected.has(seat._id) && 'seat-selected'
                          )}
                        >
                          {seat.status === 'locked' ? (
                            <Lock className="w-3 h-3" />
                          ) : isRecliner ? (
                            <Armchair className="w-3.5 h-3.5" />
                          ) : (
                            seat.seatNumber.replace(row, '')
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Curved Cinema Screen with Glow (Iconic BookMyShow Screen) */}
      <div className="pt-8 space-y-4 max-w-xl mx-auto text-center">
        <div className="relative">
          {/* Curved glowing screen line */}
          <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#f84464] to-transparent rounded-full cinema-screen-glow" />
          <div className="h-10 w-full bg-gradient-to-b from-[#f84464]/10 to-transparent rounded-t-3xl" />
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 tracking-widest uppercase">
          <span>📽️ All eyes this way please!</span>
          <span className="text-white bg-gray-900 border border-gray-700 px-2 py-0.5 rounded text-[10px]">
            SCREEN
          </span>
        </div>
      </div>
    </div>
  );
};
