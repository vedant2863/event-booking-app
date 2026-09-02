import React, { useState, useEffect } from 'react';
import { Booking, Event, Seat } from '../../shared/types';

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: Booking | null;
  onSuccess?: () => Promise<void>;
  onPaymentSuccess?: (bookingId: string) => Promise<void>;
  seats?: Seat[];
  eventTitle?: string;
  cinemaName?: string;
  showtime?: string;
}

type PaymentTab = 'upi_qr' | 'card' | 'netbanking';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
  onPaymentSuccess,
  seats,
  eventTitle,
  cinemaName,
  showtime,
}) => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('upi_qr');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('hdfc');
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(300);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const seatList = seats || booking?.seats || [];
  const seatCount = seatList.length || 1;
  const basePrice =
    booking?.totalAmount || (seats ? seats.reduce((sum, s) => sum + s.price, 0) : 250);
  const convenienceFee = seatCount * 35;
  const gst = convenienceFee * 0.18;
  const grandTotal = Math.round((basePrice + convenienceFee + gst) * 100) / 100;

  const title =
    eventTitle ||
    (typeof booking?.eventId === 'object' && booking.eventId
      ? (booking.eventId as Event).title
      : '') ||
    'Movie / Event';

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder.toString().padStart(2, '0')}`;
  };

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await new Promise((res) => setTimeout(res, 1200));
      if (onSuccess) {
        await onSuccess();
      } else if (onPaymentSuccess && booking) {
        await onPaymentSuccess(booking._id);
      }
      onClose();
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1c2230] border border-gray-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* Left Side: Itemized Order Summary */}
        <div className="w-full md:w-5/12 bg-[#151922] p-6 border-b md:border-b-0 md:border-r border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f84464] bg-[#f84464]/10 px-2.5 py-1 rounded-full">
                BOOKMYSHOW CHECKOUT
              </span>
              <span className="text-xs font-mono font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                ⏱️ {formatTime(countdownSeconds)}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            {cinemaName && (
              <p className="text-xs text-gray-400 mb-1">
                📍 {cinemaName} {showtime ? `· ${showtime}` : ''}
              </p>
            )}
            {booking?.bookingReference && (
              <p className="text-xs text-gray-400 mb-4">
                Ref: <span className="font-mono text-gray-300">{booking.bookingReference}</span>
              </p>
            )}

            <div className="space-y-3 py-4 border-t border-b border-gray-800 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>
                  Tickets ({seatCount} Seat{seatCount > 1 ? 's' : ''})
                </span>
                <span className="font-semibold text-white">₹{basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Convenience Fee (₹35 / ticket)</span>
                <span className="text-gray-300">₹{convenienceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Integrated GST (18%)</span>
                <span className="text-gray-300">₹{gst.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-800">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-gray-300">Total Payable</span>
              <span className="text-2xl font-black text-white">₹{grandTotal.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">🔒 256-bit SSL Bank-Grade Encryption</p>
          </div>
        </div>

        {/* Right Side: Payment Options */}
        <div className="w-full md:w-7/12 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
              <h4 className="font-bold text-white text-base">Select Payment Method</h4>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button
                onClick={() => setActiveTab('upi_qr')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'upi_qr'
                    ? 'bg-[#f84464] text-white shadow-lg shadow-[#f84464]/20'
                    : 'bg-[#151922] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                <span>⚡</span> UPI / QR
              </button>
              <button
                onClick={() => setActiveTab('card')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'card'
                    ? 'bg-[#f84464] text-white shadow-lg shadow-[#f84464]/20'
                    : 'bg-[#151922] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                <span>💳</span> Cards
              </button>
              <button
                onClick={() => setActiveTab('netbanking')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'netbanking'
                    ? 'bg-[#f84464] text-white shadow-lg shadow-[#f84464]/20'
                    : 'bg-[#151922] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                <span>🏦</span> NetBanking
              </button>
            </div>

            {/* Tab: UPI QR */}
            {activeTab === 'upi_qr' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-[#151922] border border-gray-800">
                  <div className="bg-white p-3 rounded-xl shadow-md flex flex-col items-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=bookmyshow@razorpay%26pn=BookMyShow%26am=${grandTotal}%26cu=INR`}
                      alt="UPI QR Code"
                      className="w-28 h-28"
                    />
                    <span className="text-[10px] text-gray-600 font-bold mt-1">SCAN & PAY</span>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h5 className="font-bold text-white text-sm">Scan QR with Any App</h5>
                    <p className="text-xs text-gray-400 mt-1">
                      Google Pay, PhonePe, Paytm, BHIM, CRED
                    </p>
                    <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                        GPay
                      </span>
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                        PhonePe
                      </span>
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                        Paytm
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#1c2230] px-2 text-gray-500 uppercase font-semibold">
                      Or enter UPI ID
                    </span>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="e.g. mobile@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-[#151922] border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#f84464]"
                />
              </div>
            )}

            {/* Tab: Cards */}
            {activeTab === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8910"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#151922] border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#f84464]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 block mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-[#151922] border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#f84464]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 block mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-[#151922] border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#f84464]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: NetBanking */}
            {activeTab === 'netbanking' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'hdfc', name: 'HDFC Bank', icon: '🏛️' },
                  { id: 'sbi', name: 'SBI', icon: '🏦' },
                  { id: 'icici', name: 'ICICI Bank', icon: '🏢' },
                  { id: 'axis', name: 'Axis Bank', icon: '🏛️' },
                  { id: 'kotak', name: 'Kotak Bank', icon: '🏦' },
                  { id: 'other', name: 'Other Banks', icon: '🌐' },
                ].map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => setSelectedBank(bank.id)}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      selectedBank === bank.id
                        ? 'bg-[#f84464]/10 border-[#f84464] text-white'
                        : 'bg-[#151922] border-gray-800 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <span>{bank.icon}</span>
                    <span className="text-xs font-semibold">{bank.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={isProcessing || countdownSeconds === 0}
            className="w-full mt-6 bg-[#f84464] hover:bg-[#e03a57] disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#f84464]/25 transition flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin text-lg">⏳</span> Authorizing Payment...
              </>
            ) : (
              <>
                <span>🔒</span> Pay ₹{grandTotal.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
