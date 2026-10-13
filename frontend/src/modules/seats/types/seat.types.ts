export type SeatStatus = 'available' | 'locked' | 'booked';

export interface Seat {
  _id: string;
  eventId: string;
  seatNumber: string;
  row: string;
  section: string;
  price: number;
  status: SeatStatus;
}

export type SeatLayout = Record<string, Record<string, Seat[]>>;

export interface SeatDetails {
  seatNumber: string;
  section: string;
  row: string;
  price: number;
}

export type SeatUpdate = {
  seatId: string;
  status: 'seat:locked' | 'seat:released' | 'seat:booked';
};
