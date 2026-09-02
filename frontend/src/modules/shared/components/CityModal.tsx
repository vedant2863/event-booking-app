import React, { useState } from 'react';
import { useCityStore, POPULAR_CITIES, City } from '../store/cityStore';

export const CityModal: React.FC = () => {
  const { isCityModalOpen, closeCityModal, selectedCity, setSelectedCity } = useCityStore();
  const [search, setSearch] = useState('');

  if (!isCityModalOpen) return null;

  const filteredCities = POPULAR_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1f2533] border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📍</span> Select Your City
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Choose your city to discover movies, events, and plays near you
            </p>
          </div>
          <button
            onClick={closeCityModal}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 pb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for your city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#151922] text-white placeholder-gray-500 rounded-xl px-4 py-3 pl-11 border border-gray-700 focus:outline-none focus:border-[#f84464] text-sm"
              autoFocus
            />
            <span className="absolute left-3.5 top-3.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="p-6 pt-4 max-h-[60vh] overflow-y-auto">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Popular Cities
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {filteredCities.map((city: City) => {
              const isSelected = selectedCity.id === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition group ${
                    isSelected
                      ? 'bg-[#f84464]/10 border-[#f84464] text-white shadow-lg shadow-[#f84464]/10'
                      : 'bg-[#151922] border-gray-800 text-gray-300 hover:border-gray-600 hover:bg-[#1c2230]'
                  }`}
                >
                  <span className="text-3xl mb-2 transform group-hover:scale-110 transition">
                    {city.icon}
                  </span>
                  <span className="text-sm font-semibold text-center">{city.name}</span>
                  {isSelected && (
                    <span className="text-[10px] bg-[#f84464] text-white px-1.5 py-0.5 rounded-full mt-1.5 font-bold">
                      SELECTED
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
