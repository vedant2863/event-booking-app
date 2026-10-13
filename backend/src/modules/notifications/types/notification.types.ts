export interface SeatDetailItem {
  section?: string;
  row?: string;
  seatNumber?: string;
}

export interface VenueDetailItem {
  name?: string;
  city?: string;
}

export interface BookingConfirmationEmailData {
  bookingId: string;
  userId: string;
}
