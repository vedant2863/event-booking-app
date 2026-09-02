import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface City {
  id: string;
  name: string;
  state: string;
  icon: string;
  isPopular?: boolean;
}

export const POPULAR_CITIES: City[] = [
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', icon: '🏙️', isPopular: true },
  { id: 'delhi', name: 'Delhi-NCR', state: 'Delhi', icon: '🏛️', isPopular: true },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', icon: '💻', isPopular: true },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', icon: '🏰', isPopular: true },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', icon: '🪁', isPopular: true },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', icon: '🌊', isPopular: true },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', icon: '🎓', isPopular: true },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', icon: '🚖', isPopular: true },
  { id: 'kochi', name: 'Kochi', state: 'Kerala', icon: '🌴', isPopular: true },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Punjab', icon: '🌾', isPopular: true },
];

export interface CityState {
  selectedCity: City;
  isCityModalOpen: boolean;
  setSelectedCity: (city: City) => void;
  openCityModal: () => void;
  closeCityModal: () => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useCityStore = create<CityState>()(
  persist(
    (set) => ({
      selectedCity: POPULAR_CITIES[0],
      isCityModalOpen: false,
      setSelectedCity: (city) => set({ selectedCity: city, isCityModalOpen: false }),
      openCityModal: () => set({ isCityModalOpen: true }),
      closeCityModal: () => set({ isCityModalOpen: false }),
      openModal: () => set({ isCityModalOpen: true }),
      closeModal: () => set({ isCityModalOpen: false }),
    }),
    {
      name: 'bms_selected_city',
    }
  )
);
