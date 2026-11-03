import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RetroFoodTheme } from '../components/retro-theme/RetroFoodTheme';
import { Sparkles, ArrowLeft, Smartphone, RefreshCw, CheckCircle2 } from 'lucide-react';

export const ThemePreviewPage: React.FC = () => {
  const [demoSubmitted, setDemoSubmitted] = useState<any>(null);

  const handleDemoSubmit = async (data: any) => {
    // Simulate short network delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    setDemoSubmitted(data);
  };

  return (
    <div className="min-h-screen bg-[#1e150f] text-amber-50 flex flex-col font-sans">
      {/* Top Banner & Theme Controls (Compact & Clean on Mobile) */}
      <header className="bg-[#2d1f16] border-b border-[#4d3728] px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 shadow-md z-20 shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <Link
            to="/"
            className="flex items-center space-x-1 text-xs font-semibold text-amber-200/80 hover:text-amber-100 bg-[#422e20] px-2 sm:px-3 py-1 rounded-lg border border-[#5a3f2b] transition-colors shrink-0"
            title="Back to Admin Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="flex items-center space-x-1.5 min-w-0">
            <span className="text-base sm:text-lg shrink-0">🍽️</span>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold text-amber-100 truncate">
                Universal Food & Mess Review
              </h1>
              <p className="text-[10px] text-amber-300/70 hidden md:block">
                Any Restaurant • Student Mess & Hostel Canteen • Diner Theme
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="hidden lg:flex bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-medium items-center space-x-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Interactive Theme</span>
          </span>
          <Link
            to="/feedback/demo"
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1 shadow-xs"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>QR View</span>
          </Link>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-1 sm:p-6 pb-32 sm:pb-12 overflow-y-auto">
        <div className="w-full max-w-lg">
          <RetroFoodTheme
            restaurantName="THE ROYAL RASOI"
            orderNumber="RR-8842"
            initialGuestName="ALEX MORGAN"
            initialGuestContact="alex.foodie@gmail.com"
            onSubmitFeedback={handleDemoSubmit}
          />
        </div>

        {/* Live Submission Debug Viewer */}
        {demoSubmitted && (
          <div className="w-full max-w-md mt-6 bg-[#2d1f16] border border-[#523d2d] rounded-2xl p-4 text-xs text-amber-200 space-y-2 shadow-xl animate-fadeIn">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Feedback Submitted Successfully!</span>
            </div>
            <p className="text-[11px] text-amber-300/80">
              Customer: <strong className="text-white">{demoSubmitted.guestName || 'Anonymous'}</strong> ({demoSubmitted.guestContact || 'No contact'})
            </p>
            <p className="text-[11px] text-amber-300/80">
              Overall Rating: <strong className="text-white">{demoSubmitted.overallRating} / 5</strong>
            </p>
            {demoSubmitted.detailedFeedback && (
              <p className="text-[11px] text-amber-100 bg-[#3d2a1b] p-2 rounded-lg italic">
                "{demoSubmitted.detailedFeedback}"
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
