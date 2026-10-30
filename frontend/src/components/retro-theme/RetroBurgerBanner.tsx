import React, { useState } from 'react';

interface RetroBurgerBannerProps {
  name: string;
  contact: string;
  onNameChange: (val: string) => void;
  onContactChange: (val: string) => void;
}

export const RetroBurgerBanner: React.FC<RetroBurgerBannerProps> = ({
  name,
  contact,
  onNameChange,
  onContactChange,
}) => {
  const [nameFocused, setNameFocused] = useState(false);
  const [contactFocused, setContactFocused] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto my-2 select-none group transition-transform duration-300">
      {/* Top Bun */}
      <div
        className={`relative bg-[#523d2d] text-[#faefcb] rounded-t-[28px] px-6 pt-3 pb-2.5 shadow-md border-b-2 border-[#3d2c1e] transition-all duration-300 ${
          nameFocused ? 'ring-2 ring-amber-400 bg-[#483424]' : 'hover:bg-[#4d3728]'
        }`}
      >
        {/* Subtle decorative sesame seeds on top bun */}
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

      {/* Delicious Burger Fillings (Lettuce, Melted Cheese, Patty with Seasoning) */}
      <div className="relative overflow-hidden z-10 -my-0.5 shadow-inner">
        {/* Crisp Wavy Lettuce Layer */}
        <div className="bg-[#48b839] h-2.5 sm:h-3 w-full flex items-center justify-around relative animate-lettuce-float">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-[#379c29]" />
          {/* Leaf waves */}
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-2 bg-[#5ed14f] rounded-b-full transform -translate-y-0.5 opacity-90"
            />
          ))}
        </div>

        {/* Melted Cheddar Cheese Layer with drip */}
        <div className="relative bg-[#f5b823] h-2.5 sm:h-3 w-full border-t border-[#f7cd44]">
          <div className="absolute right-12 top-1.5 w-3.5 h-2.5 bg-[#f5b823] rounded-b-md shadow-xs" />
          <div className="absolute left-16 top-1.5 w-2.5 h-1.5 bg-[#f5b823] rounded-b-xs" />
        </div>

        {/* Textured Savory Patty with Pepper & Seasoning dots */}
        <div className="relative bg-[#8f5a34] h-3 sm:h-3.5 w-full flex items-center justify-between px-4 border-t border-[#764523] border-b border-[#5c3316]">
          {/* Grill marks & seasoning flecks */}
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
