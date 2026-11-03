import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

export const ModeSwitcher: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isUserMode =
    location.pathname.startsWith('/theme-preview') ||
    location.pathname.startsWith('/diner-review') ||
    location.pathname.startsWith('/review') ||
    location.pathname.startsWith('/feedback');

  return (
    <aside
      aria-label="Portal Navigation"
      className="fixed bottom-2.5 left-1/2 -translate-x-1/2 sm:bottom-auto sm:top-2.5 sm:left-auto sm:right-3.5 sm:translate-x-0 z-50 flex items-center bg-[#1a110a]/95 backdrop-blur-md border border-amber-500/50 rounded-full p-0.5 sm:p-1 shadow-2xl select-none transition-all duration-300 scale-90 sm:scale-100 origin-bottom"
    >
      <button
        type="button"
        onClick={() => navigate('/review')}
        className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
          isUserMode
            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md scale-102'
            : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-950/40 active:scale-95'
        }`}
        title="Switch to User / Diner Review Page"
      >
        <span className="text-xs sm:text-sm">🍔</span>
        <span>User Page</span>
      </button>

      <button
        type="button"
        onClick={() => navigate('/')}
        className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
          !isUserMode
            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md scale-102'
            : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-950/40 active:scale-95'
        }`}
        title="Switch to Admin Operations Dashboard"
      >
        <LayoutDashboard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        <span>Admin Page</span>
      </button>
    </aside>
  );
};
