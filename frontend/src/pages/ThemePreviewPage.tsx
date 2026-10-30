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
      {/* Top Banner & Theme Controls */}
      <header className="bg-[#2d1f16] border-b border-[#4d3728] px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md z-20">
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="flex items-center space-x-1.5 text-xs font-semibold text-amber-200/80 hover:text-amber-100 bg-[#422e20] px-3 py-1.5 rounded-lg border border-[#5a3f2b] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-xl">🍽️</span>
            <div>
              <h1 className="text-sm font-bold text-amber-100 leading-tight">
                Universal Food & Mess Review Theme
              </h1>
              <p className="text-[11px] text-amber-300/70">
                Any Restaurant • Student Mess & Hostel Canteen • Diner • Tomato Sauce Flow
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Interactive Animations Active</span>
          </span>
          <Link
            to="/feedback/demo"
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors flex items-center space-x-1"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Customer View (/feedback/demo)</span>
          </Link>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto">
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
