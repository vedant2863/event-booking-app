import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
      <p>© 2025 EventBook. Built with ❤️ for unforgettable experiences.</p>
    </footer>
  </div>
);
