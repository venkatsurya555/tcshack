import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquareQuote,
  Ticket,
  Building2,
  ShoppingBag,
  UtensilsCrossed,
  QrCode,
  BellRing,
  BarChart3,
  Users2,
  Settings,
  ExternalLink,
  BrainCircuit,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onClose }) => {
  const { unreadNotificationsCount } = useAuth();

  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Feedback Management', path: '/feedback', icon: MessageSquareQuote },
    { name: 'Complaints & Tickets', path: '/complaints', icon: Ticket },
    { name: 'Department Operations', path: '/department-ops', icon: Building2 },
    { name: 'AI Semantic Clusters', path: '/ai-clusters', icon: BrainCircuit },
    { name: 'Order Management', path: '/orders', icon: ShoppingBag },
    { name: 'Menu & Items', path: '/menu', icon: UtensilsCrossed },
    { name: 'QR Code Management', path: '/qr-management', icon: QrCode },
    { 
      name: 'Customer Notifications', 
      path: '/notifications', 
      icon: BellRing,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined 
    },
    { name: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
    { name: 'Staff & Departments', path: '/staff', icon: Users2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileOpen && (
        <div
          role="presentation"
          onClick={onClose}
          className="fixed inset-0 bg-black/65 z-40 md:hidden backdrop-blur-xs transition-opacity animate-fadeIn"
        />
      )}

      {/* Main Sidebar Shell (Desktop Static + Mobile Slide-In Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#1a120c] border-r border-[#362418] text-[#e8d5c4] flex flex-col shrink-0 min-h-screen select-none transition-transform duration-300 ease-out md:static md:w-64 md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header with Food Insignia & Mobile Close Button */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#362418] bg-[#140e09]/70 shrink-0">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 border border-amber-400/50 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-950/40 relative transform transition-transform group-hover:scale-105 group-hover:rotate-2">
              <span className="text-base">🍽️</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-sm font-bold text-amber-100 tracking-tight font-retro">
                  The Royal Rasoi
                </h1>
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-[#bca188] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Restaurant & Mess OS</span>
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="md:hidden p-1.5 text-amber-300/70 hover:text-white rounded-lg hover:bg-[#281a10] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links with Warm Amber Tones & Micro-Lift Animations */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto tomato-sauce-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#9d7d65]">
            Core Operations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => onClose?.()}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm border border-amber-500/40 font-semibold translate-x-1'
                      : 'text-[#c7af99] hover:text-amber-100 hover:bg-[#2c1c13] hover:translate-x-0.5'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-115 group-hover:text-amber-300" />
                  <span>{item.name}</span>
                </div>
                {item.badge ? (
                  <span className="px-1.5 py-0.2 bg-[#ea3a1e] text-white rounded-full text-[10px] font-bold shadow-xs animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}

          <div className="pt-5 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#9d7d65]">
            Customer & Live Portals
          </div>
          
          {/* Interactive Food Review Theme Link */}
          <NavLink
            to="/review"
            onClick={() => onClose?.()}
            className="group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-amber-300 hover:text-amber-200 bg-[#28190f] hover:bg-[#342114] border border-amber-600/40 transition-all duration-200 hover:scale-[1.02] shadow-2xs mb-1.5"
          >
            <div className="flex items-center space-x-2.5">
              <span className="text-sm transition-transform group-hover:rotate-12">🍔</span>
              <span className="font-semibold">Review Theme Lab</span>
            </div>
            <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[9px] font-bold border border-amber-500/30 flex items-center space-x-0.5">
              <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>LIVE</span>
            </span>
          </NavLink>

          <Link
            to="/feedback/demo"
            onClick={() => onClose?.()}
            className="group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-[#162518]/60 hover:bg-[#1c301f] border border-emerald-800/40 transition-all duration-200 hover:scale-[1.01]"
          >
            <div className="flex items-center space-x-2.5">
              <QrCode className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
              <span>Live Customer QR</span>
            </div>
            <ExternalLink className="w-3 h-3 shrink-0 opacity-70 group-hover:opacity-100" />
          </Link>

          <Link
            to="/track/TKT-2026-001"
            onClick={() => onClose?.()}
            className="group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-amber-200 hover:text-white hover:bg-[#2c1c13] border border-[#3d2719] transition-all duration-200 hover:scale-[1.01]"
          >
            <div className="flex items-center space-x-2.5">
              <Ticket className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110 text-amber-400" />
              <span>Ticket Resolution Track</span>
            </div>
            <ExternalLink className="w-3 h-3 shrink-0 opacity-70 group-hover:opacity-100" />
          </Link>
        </nav>

        {/* Demo Notice Footer with Warm Ambient Status */}
        <div className="p-3.5 border-t border-[#362418] bg-[#140e09]/70 shrink-0">
          <div className="bg-[#241810] rounded-xl p-3 border border-[#3d291b] text-[11px] text-[#ebdcc6]/90 shadow-inner">
            <div className="flex items-center space-x-1.5 text-amber-300 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Bengaluru Operations Hub</span>
            </div>
            <p className="text-[#a48871] text-[10px] leading-relaxed">
              Multi-cuisine dining & student mess telemetry connected.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
