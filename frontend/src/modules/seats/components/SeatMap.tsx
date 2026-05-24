import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Seat } from '../../shared/types';

interface Props {
  layout: Record<string, Record<string, Seat[]>>;
  onSelectionChange: (seats: Seat[]) => void;
  maxSelect?: number;
  realtimeUpdates?: { seatId: string; status: string }[];
}

export const SeatMap = ({
  layout,
  onSelectionChange,
  maxSelect = 8,
  realtimeUpdates = [],
}: Props) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [localLayout, setLocalLayout] = useState(layout);

  // Apply real-time seat updates
  useEffect(() => {
    if (!realtimeUpdates.length) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- updates driven by external realtime events
    setLocalLayout((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      for (const update of realtimeUpdates) {
        for (const section of Object.values(updated)) {
          for (const row of Object.values(section as any)) {
            const seat = (row as Seat[]).find((s) => s._id === update.seatId);
            if (seat)
              (seat as any).status =
                update.status === 'seat:locked'
                  ? 'locked'
                  : update.status === 'seat:booked'
                    ? 'booked'
                    : 'available';
          }
        }
      }
      return updated;
    });
  }, [realtimeUpdates]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status !== 'available') return;

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(seat._id)) {
        next.delete(seat._id);
      } else {
        if (next.size >= maxSelect) return prev;
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
    <div className="space-y-8">
      {/* Stage */}
      <div className="flex justify-center">
        <div className="bg-brand-500/10 border border-brand-500/30 rounded-xl px-16 py-3 text-brand-400 text-sm font-medium tracking-widest">
          STAGE
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
        {[
          { label: 'Available', cls: 'bg-gray-700' },
          { label: 'Selected', cls: 'bg-brand-500' },
          { label: 'Locked', cls: 'bg-yellow-600' },
          { label: 'Booked', cls: 'bg-red-800' },
        ].map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-4 h-4 rounded ${cls}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Sections */}
      {Object.entries(localLayout).map(([section, rows]) => (
        <div key={section} className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-white">{section}</h3>
            <span className="text-sm text-gray-400">
              ₹{Object.values(rows)[0]?.[0]?.price?.toLocaleString()} / seat
            </span>
          </div>

          <div className="space-y-2 overflow-x-auto">
            {Object.entries(rows).map(([row, seats]) => (
              <div key={row} className="flex items-center gap-2 min-w-max">
                <span className="text-xs text-gray-500 w-6 text-center font-mono">{row}</span>
                <div className="flex gap-1.5">
                  {seats.map((seat) => (
                    <button
                      key={seat._id}
                      onClick={() => toggleSeat(seat)}
                      disabled={seat.status !== 'available'}
                      title={`${section} - Row ${row} - Seat ${seat.seatNumber} (₹${seat.price})`}
                      className={clsx(
                        'w-8 h-8 rounded text-xs font-mono font-medium transition-all duration-150',
                        seat.status === 'available' && !selected.has(seat._id) && 'seat-available',
                        seat.status === 'locked' && 'seat-locked',
                        seat.status === 'booked' && 'seat-booked',
                        selected.has(seat._id) && 'seat-selected'
                      )}
                    >
                      {seat.seatNumber.replace(row, '')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selected.size > 0 && (
        <p className="text-center text-sm text-gray-400">
          {selected.size} seat{selected.size !== 1 ? 's' : ''} selected · Max {maxSelect}
        </p>
      )}
    </div>
  );
};
