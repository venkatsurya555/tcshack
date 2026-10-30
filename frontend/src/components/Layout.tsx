import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-[#faf6f0] text-[#2b1d14] overflow-hidden font-sans relative">
      {/* Subtle ambient warm diner glow spots in background (delightful, non-distracting) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Dark Mahogany & Espresso Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 tomato-sauce-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
