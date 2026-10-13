export type EventCategory =
  | 'movie'
  | 'stream'
  | 'music'
  | 'sports'
  | 'tech'
  | 'art'
  | 'food'
  | 'comedy'
  | 'theatre'
  | 'other';

export interface Venue {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  capacity: number;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  venue: Venue;
  category: EventCategory;
  date: string;
  endDate: string;
  organizer: { _id: string; username: string; email: string; profileImage?: string };
  banner?: string;
  tags: string[];
  isPublished: boolean;
  isCancelled: boolean;
  totalSeats: number;
  availableSeats: number;
  minPrice: number;
  maxPrice: number;
  createdAt: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  venue: Venue;
  category: string;
  date: string;
  endDate: string;
  banner?: string;
  tags?: string[];
  seatingLayout: {
    sections: { name: string; rows: string[]; seatsPerRow: number; price: number }[];
  };
}
