import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Store, UserCheck, Bell, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const {
    user,
    demoUsers,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    switchUser,
    unreadNotificationsCount
  } = useAuth();

  return (
    <header className="h-16 bg-[#fffdfa] border-b border-[#ebdcc6] px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_4px_rgba(61,43,30,0.03)] select-none">
      {/* Branch / Dining Venue Selector */}
      <div className="flex items-center space-x-3">
        <div className="p-1.5 rounded-lg bg-[#faf4ea] border border-[#e5d5bf] text-amber-800">
          <Store className="w-4 h-4" />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="branch-select" className="text-xs font-semibold text-[#6e4e37]">
            Venue / Branch:
          </label>
          <select
            id="branch-select"
            value={selectedBranchId || ''}
            onChange={(e) => setSelectedBranchId(e.target.value ? Number(e.target.value) : null)}
            className="text-xs font-semibold text-[#2e1d13] bg-[#faf5eb] border border-[#decbb3] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all cursor-pointer shadow-2xs"
          >
            <option value="">All Branches & Mess Halls</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right controls: Theme Pill, Role switcher, Notifications, User profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Active Theme Indicator Pill with Micro-Animation */}
        <Link
          to="/theme-preview"
          className="hidden md:flex items-center space-x-1.5 bg-[#fbf5ea] hover:bg-[#f6ebd7] text-[#593d28] border border-[#e8d7c0] px-3 py-1 rounded-full text-xs font-semibold shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Open Theme Preview & Customizer"
        >
          <span className="text-sm">🍽️</span>
          <span>Food & Mess Theme</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
        </Link>

        {/* Quick Demo Role Switcher */}
        <div className="flex items-center space-x-2 bg-[#faf5eb] border border-[#decbb3] rounded-lg px-2.5 py-1.5 shadow-2xs">
          <UserCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="text-xs font-semibold text-[#6e4e37] hidden sm:inline">Role:</span>
          <select
            value={user?.username || ''}
            onChange={(e) => switchUser(e.target.value)}
            className="text-xs font-semibold text-[#2e1d13] bg-transparent focus:outline-none cursor-pointer"
          >
            {demoUsers.map((du) => (
              <option key={du.username} value={du.username}>
                {du.full_name} ({du.role.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>

        {/* Notification Bell */}
        <Link
          to="/notifications"
          className="relative p-2 text-[#6e4e37] hover:text-[#2e1d13] hover:bg-[#faf4ea] rounded-lg transition-all duration-200 hover:scale-105"
          title="Customer Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#ea3a1e] text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </Link>

        {/* Current User Badge */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#ebdcc6]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-amber-50 flex items-center justify-center text-xs font-bold shadow-xs border border-amber-500/50">
            {user?.full_name ? user.full_name[0] : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-[#2b1d14] leading-tight">
              {user?.full_name || 'Loading...'}
            </div>
            <div className="text-[10px] text-[#7a583e] flex items-center space-x-1 font-medium">
              <Shield className="w-2.5 h-2.5 text-amber-600" />
              <span>{user?.role?.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
