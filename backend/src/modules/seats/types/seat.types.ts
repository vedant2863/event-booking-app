import { Seat } from '@prisma/client';

export type SeatStatusType = 'available' | 'locked' | 'booked';

export interface SeatLockPayload {
  eventId: string;
  seatIds: string[];
  userId: string;
}

export interface SeatLayoutMap {
  [section: string]: {
    [row: string]: Seat[];
  };
}
