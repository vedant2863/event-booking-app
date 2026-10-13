import { Outlet, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { CityModal } from './CityModal';
import { ShieldCheck, HelpCircle, Ticket, Heart } from 'lucide-react';

export const Layout = () => (
  <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
    <Navbar />
    <CityModal />
    <main className="flex-1">
      <Outlet />
    </main>

    {/* BookMyShow Style Footer */}
    <footer className="bg-[#333545] text-gray-400 border-t border-[#2b2d3c] mt-16 text-xs">
      {/* Help & Assurance Bar */}
      <div className="border-b border-[#3e4054] py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 bg-[#222434] rounded-full text-[#f84464]">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">24/7 Customer Care</p>
              <p className="text-[11px] text-gray-400">
                We're here to assist you anytime, anywhere
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 bg-[#222434] rounded-full text-[#f84464]">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Instant M-Tickets</p>
              <p className="text-[11px] text-gray-400">
                Direct digital pass with scannable QR Code
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 bg-[#222434] rounded-full text-[#f84464]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">100% Safe Payments</p>
              <p className="text-[11px] text-gray-400">
                Encrypted checkout via UPI, Cards & NetBanking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Movies Now Showing</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/events?category=movie" className="hover:text-white transition-colors">
                  Kalki 2898 AD
                </Link>
              </li>
              <li>
                <Link to="/events?category=movie" className="hover:text-white transition-colors">
                  Dune: Part Two
                </Link>
              </li>
              <li>
                <Link to="/events?category=movie" className="hover:text-white transition-colors">
                  Stree 2
                </Link>
              </li>
              <li>
                <Link to="/events?category=movie" className="hover:text-white transition-colors">
                  Pushpa 2: The Rule
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Live Events</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/events?category=music" className="hover:text-white transition-colors">
                  Coldplay World Tour
                </Link>
              </li>
              <li>
                <Link to="/events?category=music" className="hover:text-white transition-colors">
                  Diljit Dosanjh Dil-Luminati
                </Link>
              </li>
              <li>
                <Link to="/events?category=comedy" className="hover:text-white transition-colors">
                  Zakir Khan Standup Special
                </Link>
              </li>
              <li>
                <Link to="/events?category=sports" className="hover:text-white transition-colors">
                  IPL 2025 Wankhede Matches
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">BookMyShow Exclusives</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/events?category=stream" className="hover:text-white transition-colors">
                  BMS Stream Premiere
                </Link>
              </li>
              <li>
                <Link to="/events/create" className="hover:text-white transition-colors">
                  List Your Show
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Offers & Promotions
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Corporate Vouchers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Help & Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/bookings" className="hover:text-white transition-colors">
                  Your Orders & Tickets
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-6 border-t border-[#3e4054] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 font-bold text-lg text-white">
            <span>book</span>
            <span className="bg-[#f84464] text-white px-1.5 py-0.5 rounded text-xs uppercase font-black">
              my
            </span>
            <span>show</span>
          </div>
          <p className="text-gray-400 text-center text-xs">
            © 2025 Bigtree Entertainment Pvt. Ltd. All Rights Reserved. Made with{' '}
            <Heart className="w-3.5 h-3.5 inline text-[#f84464] fill-[#f84464]" /> for movie & event
            lovers.
          </p>
        </div>
      </div>
    </footer>
  </div>
);
