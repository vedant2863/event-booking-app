import React, { useState } from 'react';
import { Event } from '../../shared/types';
import { useCityStore } from '../../shared/store/cityStore';

export interface ShowtimePickerProps {
  event?: Event | null;
  onSelectShowtime: (cinema: string, time: string, formatOrDate?: string, price?: number) => void;
  selectedCinema?: string;
  selectedTime?: string;
}

interface Cinema {
  id: string;
  name: string;
  location: string;
  distance: string;
  amenities: string[];
  showtimes: {
    time: string;
    format: string;
    price: number;
    fillingFast: boolean;
  }[];
}

const DATES = [
  { day: 'TODAY', date: '02 SEP', active: true },
  { day: 'TOM', date: '03 SEP', active: false },
  { day: 'THU', date: '04 SEP', active: false },
  { day: 'FRI', date: '05 SEP', active: false },
  { day: 'SAT', date: '06 SEP', active: false },
  { day: 'SUN', date: '07 SEP', active: false },
];

const FORMATS = ['ALL', '2D', '3D', 'IMAX 3D', '4DX'];

const CITY_CINEMAS_MAP: Record<string, Cinema[]> = {
  mumbai: [
    {
      id: 'pvr-inorbit',
      name: 'PVR: INORBIT Mall, Malad',
      location: 'Link Road, Malad West, Mumbai',
      distance: '3.2 km away',
      amenities: ['M-Ticket', 'F&B', 'Wheelchair Accessible', 'Dolby Atmos'],
      showtimes: [
        { time: '10:30 AM', format: 'IMAX 3D', price: 650, fillingFast: false },
        { time: '01:45 PM', format: 'IMAX 3D', price: 650, fillingFast: true },
        { time: '05:15 PM', format: 'IMAX 3D', price: 750, fillingFast: true },
        { time: '08:45 PM', format: 'IMAX 3D', price: 800, fillingFast: false },
        { time: '11:30 PM', format: '2D', price: 350, fillingFast: false },
      ],
    },
    {
      id: 'inox-megaplex',
      name: 'INOX: Megaplex, Phoenix Marketcity',
      location: 'LBS Marg, Kurla West, Mumbai',
      distance: '7.8 km away',
      amenities: ['M-Ticket', 'Dolby Atmos', 'Recliner Lounges', 'Kiddles'],
      showtimes: [
        { time: '11:00 AM', format: '3D', price: 450, fillingFast: false },
        { time: '02:30 PM', format: '3D', price: 500, fillingFast: false },
        { time: '06:00 PM', format: '3D', price: 600, fillingFast: true },
        { time: '09:30 PM', format: '3D', price: 650, fillingFast: true },
      ],
    },
    {
      id: 'cinepolis-grand',
      name: 'Cinépolis: Grand Central Mall',
      location: 'Seawoods Station, Navi Mumbai',
      distance: '14.5 km away',
      amenities: ['M-Ticket', '4DX Sensory', 'VIP Lounge'],
      showtimes: [
        { time: '12:15 PM', format: '4DX', price: 700, fillingFast: false },
        { time: '04:00 PM', format: '4DX', price: 750, fillingFast: true },
        { time: '07:45 PM', format: '4DX', price: 850, fillingFast: true },
        { time: '10:45 PM', format: '2D', price: 280, fillingFast: false },
      ],
    },
  ],
  ncr: [
    {
      id: 'pvr-citywalk',
      name: 'PVR: Select CITYWALK, Saket',
      location: 'A-3 District Centre, Saket, New Delhi',
      distance: '4.5 km away',
      amenities: ['M-Ticket', 'Gold Class', 'Dolby Atmos', 'F&B Express'],
      showtimes: [
        { time: '10:00 AM', format: 'IMAX 3D', price: 700, fillingFast: false },
        { time: '01:30 PM', format: 'IMAX 3D', price: 700, fillingFast: true },
        { time: '05:00 PM', format: 'IMAX 3D', price: 800, fillingFast: true },
        { time: '08:30 PM', format: 'IMAX 3D', price: 850, fillingFast: true },
      ],
    },
    {
      id: 'inox-insignia-epicuria',
      name: 'INOX: Insignia, Epicuria Mall',
      location: 'Nehru Place, New Delhi',
      distance: '6.1 km away',
      amenities: ['M-Ticket', 'Luxury Recliner', 'Gourmet Dining'],
      showtimes: [
        { time: '11:15 AM', format: '3D', price: 550, fillingFast: false },
        { time: '02:45 PM', format: '3D', price: 600, fillingFast: false },
        { time: '06:15 PM', format: '3D', price: 650, fillingFast: true },
        { time: '09:45 PM', format: '3D', price: 700, fillingFast: false },
      ],
    },
    {
      id: 'cinepolis-dlf-noida',
      name: 'Cinépolis: DLF Mall of India',
      location: 'Sector 18, Noida',
      distance: '11.2 km away',
      amenities: ['M-Ticket', '4DX Sensory', 'IMAX Laser'],
      showtimes: [
        { time: '12:00 PM', format: '4DX', price: 750, fillingFast: false },
        { time: '03:30 PM', format: '4DX', price: 800, fillingFast: true },
        { time: '07:00 PM', format: '4DX', price: 900, fillingFast: true },
        { time: '10:30 PM', format: '2D', price: 300, fillingFast: false },
      ],
    },
  ],
  bengaluru: [
    {
      id: 'pvr-forum-koramangala',
      name: 'PVR: Forum Mall, Koramangala',
      location: 'Hosur Road, Koramangala, Bengaluru',
      distance: '2.8 km away',
      amenities: ['M-Ticket', 'IMAX Laser', 'Dolby Atmos', 'F&B'],
      showtimes: [
        { time: '10:15 AM', format: 'IMAX 3D', price: 650, fillingFast: false },
        { time: '01:45 PM', format: 'IMAX 3D', price: 650, fillingFast: true },
        { time: '05:15 PM', format: 'IMAX 3D', price: 750, fillingFast: true },
        { time: '08:45 PM', format: 'IMAX 3D', price: 800, fillingFast: false },
      ],
    },
    {
      id: 'inox-garuda-mg',
      name: 'INOX: Garuda Mall, MG Road',
      location: 'Magrath Road, Ashok Nagar, Bengaluru',
      distance: '5.2 km away',
      amenities: ['M-Ticket', 'Insignia Lounge', 'Dolby 7.1'],
      showtimes: [
        { time: '11:30 AM', format: '3D', price: 450, fillingFast: false },
        { time: '03:00 PM', format: '3D', price: 500, fillingFast: false },
        { time: '06:30 PM', format: '3D', price: 600, fillingFast: true },
        { time: '10:00 PM', format: '2D', price: 280, fillingFast: false },
      ],
    },
    {
      id: 'cinepolis-orion',
      name: 'Cinépolis: Orion Mall, Rajajinagar',
      location: 'Dr Rajkumar Road, Malleshwaram West, Bengaluru',
      distance: '8.4 km away',
      amenities: ['M-Ticket', '4DX Sensory', 'VIP Lounge'],
      showtimes: [
        { time: '12:30 PM', format: '4DX', price: 700, fillingFast: false },
        { time: '04:15 PM', format: '4DX', price: 750, fillingFast: true },
        { time: '08:00 PM', format: '4DX', price: 850, fillingFast: true },
      ],
    },
  ],
  hyderabad: [
    {
      id: 'prasads-imax',
      name: 'Prasads Multiplex: Large Screen',
      location: 'Necklace Road, NTR Gardens, Hyderabad',
      distance: '3.5 km away',
      amenities: ['M-Ticket', 'Giant Screen 4K', 'Dolby Atmos'],
      showtimes: [
        { time: '10:00 AM', format: 'IMAX 3D', price: 600, fillingFast: true },
        { time: '01:30 PM', format: 'IMAX 3D', price: 600, fillingFast: true },
        { time: '05:00 PM', format: 'IMAX 3D', price: 700, fillingFast: true },
        { time: '08:30 PM', format: 'IMAX 3D', price: 750, fillingFast: true },
      ],
    },
    {
      id: 'amb-cinemas-gachibowli',
      name: 'AMB Cinemas: Superplex',
      location: 'Gachibowli - Miyapur Road, Kondapur, Hyderabad',
      distance: '7.0 km away',
      amenities: ['M-Ticket', 'M-Lounge', 'Dolby Atmos Laser', 'VIP Service'],
      showtimes: [
        { time: '11:00 AM', format: '3D', price: 500, fillingFast: false },
        { time: '02:30 PM', format: '3D', price: 550, fillingFast: true },
        { time: '06:00 PM', format: '3D', price: 650, fillingFast: true },
        { time: '09:30 PM', format: '3D', price: 700, fillingFast: true },
      ],
    },
    {
      id: 'pvr-next-galleria',
      name: 'PVR: Next Galleria Mall',
      location: 'Punjagutta, Hyderabad',
      distance: '5.6 km away',
      amenities: ['M-Ticket', '4DX', 'Food Court Express'],
      showtimes: [
        { time: '12:15 PM', format: '4DX', price: 650, fillingFast: false },
        { time: '04:00 PM', format: '4DX', price: 700, fillingFast: false },
        { time: '07:45 PM', format: '4DX', price: 800, fillingFast: true },
      ],
    },
  ],
};

export const ShowtimePicker: React.FC<ShowtimePickerProps> = ({
  onSelectShowtime,
  selectedCinema,
  selectedTime,
}) => {
  const { selectedCity } = useCityStore();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState('ALL');

  const cityKey = selectedCity?.id?.toLowerCase() || 'mumbai';
  const cinemas = CITY_CINEMAS_MAP[cityKey] || [
    {
      id: `pvr-${cityKey}`,
      name: `PVR: Central Mall, ${selectedCity?.name || 'City'}`,
      location: `City Centre, ${selectedCity?.name || 'City'}`,
      distance: '2.5 km away',
      amenities: ['M-Ticket', 'Dolby Atmos', 'F&B'],
      showtimes: [
        { time: '10:30 AM', format: 'IMAX 3D', price: 550, fillingFast: false },
        { time: '02:00 PM', format: '3D', price: 450, fillingFast: true },
        { time: '06:15 PM', format: '3D', price: 500, fillingFast: true },
        { time: '09:45 PM', format: '2D', price: 250, fillingFast: false },
      ],
    },
    {
      id: `inox-${cityKey}`,
      name: `INOX: Mega Mall, ${selectedCity?.name || 'City'}`,
      location: `Main Boulevard, ${selectedCity?.name || 'City'}`,
      distance: '5.1 km away',
      amenities: ['M-Ticket', 'Recliner', 'Food Court'],
      showtimes: [
        { time: '11:15 AM', format: '2D', price: 280, fillingFast: false },
        { time: '03:30 PM', format: '3D', price: 400, fillingFast: false },
        { time: '07:30 PM', format: '3D', price: 480, fillingFast: true },
      ],
    },
  ];

  return (
    <div className="bg-[#1a1f2b] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Date Navigation Strip */}
      <div className="bg-[#151922] border-b border-gray-800 p-4 flex items-center gap-3 overflow-x-auto">
        {DATES.map((item, idx) => {
          const isSelected = selectedDateIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedDateIndex(idx)}
              className={`flex flex-col items-center justify-center min-w-[72px] py-2.5 px-3 rounded-xl transition font-medium ${
                isSelected
                  ? 'bg-[#f84464] text-white shadow-lg shadow-[#f84464]/20'
                  : 'bg-[#1f2533] text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-[11px] uppercase tracking-wider font-semibold opacity-80">
                {item.day}
              </span>
              <span className="text-sm font-bold mt-0.5">{item.date}</span>
            </button>
          );
        })}

        <div className="ml-auto hidden md:flex items-center gap-2">
          {FORMATS.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedFormat === fmt
                  ? 'bg-gray-700 text-white'
                  : 'bg-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 bg-[#171c26] border-b border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> AVAILABLE
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> FILLING
            FAST
          </span>
        </div>
        <span className="hidden sm:inline">Cancellation Available with 100% Refund</span>
      </div>

      {/* Cinemas List */}
      <div className="divide-y divide-gray-800/80">
        {cinemas.map((cinema) => {
          const filteredShowtimes =
            selectedFormat === 'ALL'
              ? cinema.showtimes
              : cinema.showtimes.filter((s) => s.format === selectedFormat);

          if (filteredShowtimes.length === 0) return null;

          return (
            <div key={cinema.id} className="p-6 hover:bg-[#1f2533]/40 transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#f84464]">❤️</span>
                    <h4 className="font-bold text-white text-base hover:text-[#f84464] cursor-pointer transition">
                      {cinema.name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-3">
                    <span>📍 {cinema.location}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-emerald-400 font-medium">{cinema.distance}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {cinema.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes Pill Grid */}
                <div className="flex flex-wrap gap-2.5">
                  {filteredShowtimes.map((st, i) => {
                    const isChosen = selectedCinema === cinema.name && selectedTime === st.time;

                    return (
                      <button
                        key={i}
                        onClick={() => onSelectShowtime(cinema.name, st.time, st.format, st.price)}
                        className={`group relative flex flex-col items-center justify-center min-w-[96px] py-2 px-3 rounded-xl border transition ${
                          isChosen
                            ? 'bg-[#f84464] border-[#f84464] text-white shadow-lg shadow-[#f84464]/20'
                            : st.fillingFast
                              ? 'bg-[#151922] border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-amber-500/10'
                              : 'bg-[#151922] border-emerald-500/30 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        <span className="text-xs font-bold">{st.time}</span>
                        <span className="text-[10px] opacity-75 font-semibold mt-0.5">
                          {st.format}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
