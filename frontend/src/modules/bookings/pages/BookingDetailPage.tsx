import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Calendar,
  MapPin,
  Ticket,
  CheckCircle2,
  ArrowLeft,
  QrCode,
  Printer,
  Download,
  Share2,
  Navigation,
  ShieldCheck,
} from 'lucide-react';
import { bookingsApi } from '../api/index';
import { Booking, Event } from '../../shared/types';
import toast from 'react-hot-toast';

export const BookingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    bookingsApi
      .getById(id)
      .then(({ data }: { data: { data?: Booking | null } }) => setBooking(data.data ?? null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 bg-gray-800 rounded w-1/4" />
        <div className="h-96 bg-gray-900 rounded-3xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-24 text-gray-400 space-y-3">
        <p className="text-4xl">🎟️</p>
        <p className="text-base font-bold text-white">Booking not found</p>
        <Link to="/bookings" className="text-xs text-[#f84464] hover:underline">
          View all bookings
        </Link>
      </div>
    );
  }

  const event = booking.eventId as Event | undefined;
  const isConfirmed = booking.bookingStatus === 'confirmed';

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('M-Ticket link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/bookings"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All Orders & Tickets
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg border border-gray-800"
            title="Share Ticket"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg border border-gray-800"
            title="Print Ticket"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Authentic BookMyShow M-Ticket Card */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden text-gray-100">
        {/* Ticket Header Banner */}
        <div className="bg-[#f84464] p-5 sm:p-6 text-white space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-lg">
              <span>book</span>
              <span className="bg-white text-[#f84464] px-1 py-0.2 rounded text-xs font-black uppercase">
                my
              </span>
              <span>show</span>
            </div>
            <div className="inline-flex items-center gap-1 bg-black/25 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>
                {isConfirmed ? 'CONFIRMED M-TICKET' : booking.bookingStatus.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <div>
              <p className="text-rose-200 text-[10px] uppercase tracking-wider">
                Booking Reference
              </p>
              <p className="font-mono font-black text-sm tracking-wider">
                {booking.bookingReference}
              </p>
            </div>
            <div className="text-right">
              <p className="text-rose-200 text-[10px] uppercase tracking-wider">Audi Number</p>
              <p className="font-black text-sm">AUDI 04 (IMAX 3D)</p>
            </div>
          </div>
        </div>

        {/* Perforated Divider Strip with Circular Cutouts */}
        <div className="relative h-6 bg-gray-950 flex items-center justify-between">
          <div className="w-6 h-6 bg-gray-950 rounded-full -ml-3 border-r border-gray-800" />
          <div className="flex-1 border-t-2 border-dashed border-gray-800 mx-3" />
          <div className="w-6 h-6 bg-gray-950 rounded-full -mr-3 border-l border-gray-800" />
        </div>

        {/* Ticket Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Movie / Show Title & Cinema */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {event?.title}
            </h1>
            <p className="text-xs text-[#f84464] font-semibold">
              Hindi, English (2D / 3D / IMAX 3D) • UA 16+
            </p>
          </div>

          {/* Date, Time & Cinema Hall */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-950/80 p-4 rounded-2xl border border-gray-800/80 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#f84464]" />
                <span>Show Date & Time</span>
              </div>
              <p className="text-sm font-bold text-white">
                {event?.date ? format(new Date(event.date), 'EEE, d MMM yyyy') : 'Today'}
              </p>
              <p className="text-xs text-rose-300 font-semibold">08:30 PM</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#f84464]" />
                <span>Cinema Venue</span>
              </div>
              <p className="text-xs font-bold text-white">
                {event?.venue?.name || 'PVR INORBIT Mall'}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {event?.venue?.address || 'Malad West, Mumbai'}
              </p>
            </div>
          </div>

          {/* Seats Allocation */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              Confirmed Seats ({booking.seatDetails?.length || 0})
            </p>
            <div className="flex flex-wrap gap-2">
              {booking.seatDetails?.map((seat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-[#f84464]/10 border border-[#f84464]/40 px-3 py-2 rounded-xl text-xs"
                >
                  <Ticket className="w-3.5 h-3.5 text-[#f84464]" />
                  <span className="font-extrabold text-white">
                    {seat.section} - {seat.seatNumber}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">₹{seat.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code & Barcode Scanner for Cinema Entrance */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-950 p-5 rounded-2xl border border-gray-800">
            {/* QR Code Simulation */}
            <div className="flex flex-col items-center bg-white p-3 rounded-xl shadow-md">
              <div className="w-28 h-28 bg-gray-900 rounded flex items-center justify-center relative overflow-hidden">
                <QrCode className="w-24 h-24 text-white" />
                <div className="absolute inset-0 bg-[#f84464]/15 flex items-center justify-center">
                  <span className="bg-[#f84464] text-white text-[8px] font-black px-1 rounded shadow">
                    BMS
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-gray-800 mt-1 uppercase">
                Scan at Gate
              </span>
            </div>

            {/* Entrance Guidance */}
            <div className="space-y-2 text-center sm:text-left text-xs">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Direct Cinema Entry</span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Show this digital QR code at the cinema usher gate. Physical printouts are not
                required.
              </p>
              <p className="text-[10px] text-gray-500 font-mono">
                Scan ID: {booking.bookingReference}-SECURE
              </p>
            </div>
          </div>

          {/* Payment & Breakdown Summary */}
          <div className="border-t border-gray-800 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Ticket Subtotal</span>
              <span>₹{booking.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Convenience Fee & Taxes</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-white pt-1">
              <span>Total Amount Paid</span>
              <span className="text-[#f84464]">₹{booking.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-950 border-t border-gray-800 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handlePrint}
            className="w-full sm:flex-1 bg-[#f84464] hover:bg-[#e03050] text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download / Print M-Ticket
          </button>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              event?.venue?.name || 'Mumbai'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs px-4 py-3 rounded-xl border border-gray-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-[#f84464]" /> Directions
          </a>
        </div>
      </div>
    </div>
  );
};
