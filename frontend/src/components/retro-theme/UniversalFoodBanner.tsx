import React, { useState } from 'react';

export type VenueMode = 'universal' | 'mess' | 'burger';

interface UniversalFoodBannerProps {
  mode: VenueMode;
  name: string;
  contact: string;
  onNameChange: (val: string) => void;
  onContactChange: (val: string) => void;
}

export const UniversalFoodBanner: React.FC<UniversalFoodBannerProps> = ({
  mode,
  name,
  contact,
  onNameChange,
  onContactChange
}) => {
  const [nameFocused, setNameFocused] = useState(false);
  const [contactFocused, setContactFocused] = useState(false);

  // -------------------------------------------------------------
  // 1. STUDENT MESS / CANTEEN MODE (Hostel Dining & Mess Thali)
  // -------------------------------------------------------------
  if (mode === 'mess') {
    return (
      <div className="w-full max-w-sm mx-auto my-2 select-none group transition-transform duration-300">
        {/* Top Mess Plaque / Student Identification */}
        <div
          className={`relative bg-[#3e2c1f] text-[#faefcb] rounded-t-[26px] px-5 pt-3 pb-2.5 shadow-md border-b-2 border-[#2b1e15] transition-all duration-300 ${
            nameFocused ? 'ring-2 ring-amber-400 bg-[#35251a]' : 'hover:bg-[#463223]'
          }`}
        >
          {/* Decorative brass rivets */}
          <div className="absolute top-2 left-4 w-1.5 h-1.5 rounded-full bg-amber-400/60 shadow-xs pointer-events-none" />
          <div className="absolute top-2 right-4 w-1.5 h-1.5 rounded-full bg-amber-400/60 shadow-xs pointer-events-none" />

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span className="text-xs">🍛</span>
              <label className="text-[12px] font-retro tracking-widest text-amber-200 uppercase cursor-text">
                STUDENT NAME / ROLL NO
              </label>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              placeholder="TAP TO ENTER NAME OR ROLL NO"
              className="w-full text-center bg-transparent border-none text-white font-retro text-sm placeholder:text-amber-200/40 focus:outline-none focus:placeholder-transparent selection:bg-amber-500/40"
            />
          </div>
        </div>

        {/* Partitioned Mess Meal Tray / Stainless & Golden Divider */}
        <div className="relative overflow-hidden z-10 -my-0.5 shadow-inner">
          {/* Fresh Stainless Steel Tray Divider with warm bronze trim */}
          <div className="bg-[#b45309] h-2.5 sm:h-3 w-full flex items-center justify-around px-2 relative">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-[#92400e]" />
            {/* Partitioned meal compartments / katori slots */}
            <div className="flex items-center space-x-3 text-[9px] font-retro text-amber-100 tracking-wider uppercase opacity-90">
              <span className="flex items-center space-x-0.5"><span>🥣</span><span>DAL</span></span>
              <span>•</span>
              <span className="flex items-center space-x-0.5"><span>🫓</span><span>ROTI</span></span>
              <span>•</span>
              <span className="flex items-center space-x-0.5"><span>🍚</span><span>RICE</span></span>
              <span>•</span>
              <span className="flex items-center space-x-0.5"><span>🥗</span><span>SABZI</span></span>
            </div>
          </div>

          {/* Steaming hot meal ribbon */}
          <div className="relative bg-[#d97706] h-1.5 w-full flex items-center justify-center border-t border-[#f59e0b]">
            <div className="w-16 h-0.5 bg-amber-200/80 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Bottom Section: Room No / Meal Session / Token */}
        <div
          className={`relative bg-[#3e2c1f] text-[#faefcb] rounded-b-[24px] px-5 pt-2 pb-3 shadow-md transition-all duration-300 ${
            contactFocused ? 'ring-2 ring-amber-400 bg-[#35251a]' : 'hover:bg-[#463223]'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span className="text-xs">🏢</span>
              <label className="text-[11px] font-retro tracking-widest text-amber-200 uppercase cursor-text">
                ROOM NO / PHONE / MEAL TOKEN
              </label>
            </div>
            <input
              type="text"
              value={contact}
              onChange={(e) => onContactChange(e.target.value)}
              onFocus={() => setContactFocused(true)}
              onBlur={() => setContactFocused(false)}
              placeholder="e.g. Room B-204 • Lunch / Dinner"
              className="w-full text-center bg-transparent border-none text-white font-retro text-sm placeholder:text-amber-200/40 focus:outline-none focus:placeholder-transparent selection:bg-amber-500/40"
            />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. UNIVERSAL RESTAURANT & GOURMET DINING MODE (Applicable to EVERY restaurant)
  // -------------------------------------------------------------
  if (mode === 'universal') {
    return (
      <div className="w-full max-w-sm mx-auto my-2 select-none group transition-transform duration-300">
        {/* Top Plaque: Dark Walnut Gourmet Serving Platter */}
        <div
          className={`relative bg-[#4a3525] text-[#faefcb] rounded-t-[26px] px-5 pt-3 pb-2.5 shadow-md border-b-2 border-[#362519] transition-all duration-300 ${
            nameFocused ? 'ring-2 ring-amber-400 bg-[#3d2a1c]' : 'hover:bg-[#523b2a]'
          }`}
        >
          {/* Golden brass gourmet corner accents */}
          <div className="absolute top-2 left-4 w-1.5 h-1.5 rounded-full bg-amber-300/80 shadow-xs pointer-events-none" />
          <div className="absolute top-2 right-4 w-1.5 h-1.5 rounded-full bg-amber-300/80 shadow-xs pointer-events-none" />

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span className="text-xs">🍽️</span>
              <label className="text-[12px] font-retro tracking-widest text-amber-100 uppercase cursor-text">
                GUEST NAME
              </label>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              placeholder="TAP TO ENTER YOUR NAME"
              className="w-full text-center bg-transparent border-none text-white font-retro text-sm placeholder:text-amber-200/40 focus:outline-none focus:placeholder-transparent selection:bg-amber-500/40"
            />
          </div>
        </div>

        {/* Elegant Brass & Herb Chef's Trim Divider */}
        <div className="relative overflow-hidden z-10 -my-0.5 shadow-inner">
          {/* Golden brass chef strip */}
          <div className="bg-[#b45309] h-2.5 sm:h-3 w-full flex items-center justify-between px-2 sm:px-4 relative">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-[#853a06]" />
            <div className="w-1.5 h-1 bg-amber-200/60 rounded-full" />
            <div className="flex items-center space-x-1.5 text-[8.5px] sm:text-[10px] font-retro text-amber-100 uppercase tracking-wider truncate">
              <span>✦</span>
              <span>FINE DINING & HOSPITALITY</span>
              <span>✦</span>
            </div>
            <div className="w-1.5 h-1 bg-amber-200/60 rounded-full" />
          </div>

          {/* Fresh garnish green line */}
          <div className="relative bg-[#15803d] h-1.5 w-full flex items-center justify-around border-t border-[#22c55e]">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-2 h-1 bg-[#4ade80] rounded-full opacity-70" />
            ))}
          </div>
        </div>

        {/* Bottom Section: Phone / Email / Table Number */}
        <div
          className={`relative bg-[#4a3525] text-[#faefcb] rounded-b-[24px] px-5 pt-2 pb-3 shadow-md transition-all duration-300 ${
            contactFocused ? 'ring-2 ring-amber-400 bg-[#3d2a1c]' : 'hover:bg-[#523b2a]'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span className="text-xs">📞</span>
              <label className="text-[11px] font-retro tracking-widest text-amber-100 uppercase cursor-text">
                PHONE / E-MAIL / TABLE NO
              </label>
            </div>
            <input
              type="text"
              value={contact}
              onChange={(e) => onContactChange(e.target.value)}
              onFocus={() => setContactFocused(true)}
              onBlur={() => setContactFocused(false)}
              placeholder="e.g. +91 98765 43210 • Table 4"
              className="w-full text-center bg-transparent border-none text-white font-retro text-sm placeholder:text-amber-200/40 focus:outline-none focus:placeholder-transparent selection:bg-amber-500/40"
            />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. FAST FOOD / BURGER DINER MODE (Classic Sandwich)
  // -------------------------------------------------------------
  return (
    <div className="w-full max-w-sm mx-auto my-2 select-none group transition-transform duration-300">
      {/* Top Bun */}
      <div
        className={`relative bg-[#523d2d] text-[#faefcb] rounded-t-[28px] px-6 pt-3 pb-2.5 shadow-md border-b-2 border-[#3d2c1e] transition-all duration-300 ${
          nameFocused ? 'ring-2 ring-amber-400 bg-[#483424]' : 'hover:bg-[#4d3728]'
        }`}
      >
        <div className="absolute top-1.5 left-8 w-1.5 h-0.5 bg-amber-100/50 rounded-full rotate-[-25deg] pointer-events-none" />
        <div className="absolute top-2.5 left-20 w-1.5 h-0.5 bg-amber-100/60 rounded-full rotate-[15deg] pointer-events-none" />
        <div className="absolute top-1.5 right-12 w-1.5 h-0.5 bg-amber-100/50 rounded-full rotate-[30deg] pointer-events-none" />
        <div className="absolute top-2.5 right-24 w-1.5 h-0.5 bg-amber-100/60 rounded-full rotate-[-15deg] pointer-events-none" />

        <div className="flex flex-col items-center justify-center">
          <label className="text-[13px] font-retro tracking-widest text-amber-100/90 drop-shadow-xs uppercase cursor-text">
            NAME
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            placeholder="TAP TO ENTER NAME"
            className="w-full text-center bg-transparent border-none text-white font-retro text-sm placeholder:text-amber-200/40 focus:outline-none focus:placeholder-transparent selection:bg-amber-500/40"
          />
        </div>
      </div>

      {/* Delicious Burger Fillings */}
      <div className="relative overflow-hidden z-10 -my-0.5 shadow-inner">
        <div className="bg-[#48b839] h-2.5 sm:h-3 w-full flex items-center justify-around relative animate-lettuce-float">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-[#379c29]" />
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-2 bg-[#5ed14f] rounded-b-full transform -translate-y-0.5 opacity-90"
            />
          ))}
        </div>

        <div className="relative bg-[#f5b823] h-2.5 sm:h-3 w-full border-t border-[#f7cd44]">
          <div className="absolute right-12 top-1.5 w-3.5 h-2.5 bg-[#f5b823] rounded-b-md shadow-xs" />
          <div className="absolute left-16 top-1.5 w-2.5 h-1.5 bg-[#f5b823] rounded-b-xs" />
        </div>

        <div className="relative bg-[#8f5a34] h-3 sm:h-3.5 w-full flex items-center justify-between px-4 border-t border-[#764523] border-b border-[#5c3316]">
          <div className="w-1.5 h-1 bg-black/40 rounded-full" />
          <div className="w-1 h-1 bg-amber-100/40 rounded-full" />
          <div className="w-2 h-1 bg-black/35 rounded-full" />
          <div className="w-1.5 h-1 bg-amber-100/50 rounded-full" />
          <div className="w-1 h-1 bg-black/40 rounded-full" />
          <div className="w-2 h-1 bg-black/30 rounded-full" />
          <div className="w-1.5 h-1 bg-amber-100/40 rounded-full" />
        </div>
      </div>

      {/* Bottom Bun */}
      <div
        className={`relative bg-[#523d2d] text-[#faefcb] rounded-b-[24px] px-6 pt-2 pb-3 shadow-md transition-all duration-300 ${
          contactFocused ? 'ring-2 ring-amber-400 bg-[#483424]' : 'hover:bg-[#4d3728]'
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          <label className="text-[12px] font-retro tracking-widest text-amber-100/90 drop-shadow-xs uppercase cursor-text">
            PHONE / E-MAIL
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => onContactChange(e.target.value)}
            onFocus={() => setContactFocused(true)}
            onBlur={() => setContactFocused(false)}
            placeholder="TAP TO ENTER CONTACT"
            className="w-full text-center bg-transparent border-none text-white font-retro text-sm placeholder:text-amber-200/40 focus:outline-none focus:placeholder-transparent selection:bg-amber-500/40"
          />
        </div>
      </div>
    </div>
  );
};
