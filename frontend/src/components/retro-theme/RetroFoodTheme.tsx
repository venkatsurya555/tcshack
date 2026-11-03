import React, { useState } from 'react';
import { RetroBurgerFrame } from './RetroBurgerFrame';
import { UniversalFoodBanner, VenueMode } from './UniversalFoodBanner';
import { RevolvingEmojisOrbit } from './RevolvingEmojisOrbit';
import {
  StarIconDoodle,
  EmojiFaceDoodle,
  CutleryDoodle,
  ClocheDoodle,
  PencilNoteDoodle,
  RetroChevronToggle
} from './RetroFoodIcons';

export type { VenueMode };

export interface ThemeOrderItem {
  id: number | string;
  name: string;
  rating?: number;
  feedback?: string;
  quantity?: number;
  price?: number;
}

interface RetroFoodThemeProps {
  initialVenueMode?: VenueMode;
  initialItems?: ThemeOrderItem[];
  restaurantName?: string;
  orderNumber?: string;
  initialGuestName?: string;
  initialGuestContact?: string;
  onSubmitFeedback?: (data: {
    venueMode: VenueMode;
    guestName: string;
    guestContact: string;
    items: Array<{ id: string | number; name: string; rating: number; feedback: string }>;
    foodRating: number;
    foodFeedback: string;
    serviceRating: number;
    serviceFeedback: string;
    otherQueries: string;
    overallRating: number;
    detailedFeedback: string;
  }) => Promise<void> | void;
  isSubmitting?: boolean;
}

// 1. UNIVERSAL RESTAURANT PRESET (Fine Dining, Multicuisine, Bistro, Family Dining)
export const UNIVERSAL_SAMPLE_ITEMS: ThemeOrderItem[] = [
  { id: 'u1', name: 'BUTTER NAAN / ROTI', rating: 5, feedback: '' },
  { id: 'u2', name: 'PANEER TIKKA', rating: 5, feedback: '' },
  { id: 'u3', name: 'SPECIAL CURRY', rating: 5, feedback: '' },
  { id: 'u4', name: 'DUM BIRYANI', rating: 5, feedback: '' },
  { id: 'u5', name: 'DESSERT / SWEET', rating: 5, feedback: '' },
  { id: 'u6', name: 'CHILLED BEVERAGE', rating: 5, feedback: '' }
];

// 2. STUDENT MESS / CANTEEN PRESET (College Hostel, Dining Hall, Thali Meals)
export const MESS_SAMPLE_ITEMS: ThemeOrderItem[] = [
  { id: 'm1', name: 'HOT CHAPATI / ROTI', rating: 5, feedback: '' },
  { id: 'm2', name: 'DAL TADKA / SAMBAR', rating: 5, feedback: '' },
  { id: 'm3', name: 'PANEER MASALA / SABZI', rating: 5, feedback: '' },
  { id: 'm4', name: 'STEAMED JEERA RICE', rating: 5, feedback: '' },
  { id: 'm5', name: 'CURD / RAITA', rating: 5, feedback: '' },
  { id: 'm6', name: 'MESS SWEET / KHEER', rating: 5, feedback: '' }
];

// 3. BURGER DINER PRESET (Fast Food, Burgers & Shakes)
export const BURGER_SAMPLE_ITEMS: ThemeOrderItem[] = [
  { id: 'b1', name: 'CHEESE PIZZA', rating: 5, feedback: '' },
  { id: 'b2', name: 'TACO (VEG)', rating: 5, feedback: '' },
  { id: 'b3', name: 'LOADED FRIES', rating: 5, feedback: '' },
  { id: 'b4', name: 'BURGER (VEG)', rating: 5, feedback: '' },
  { id: 'b5', name: 'GARLIC BREAD', rating: 5, feedback: '' },
  { id: 'b6', name: 'CHOCO LAVA CAKE', rating: 5, feedback: '' }
];

export const RetroFoodTheme: React.FC<RetroFoodThemeProps> = ({
  initialVenueMode = 'universal',
  initialItems,
  restaurantName,
  orderNumber,
  initialGuestName,
  initialGuestContact,
  onSubmitFeedback,
  isSubmitting = false
}) => {
  // Venue Mode: 'universal' (All Restaurants) | 'mess' (Students Mess) | 'burger' (Burger Diner)
  const [venueMode, setVenueMode] = useState<VenueMode>(initialVenueMode);

  // Screen state: 'items' (Screen 1) | 'feedback' (Screen 2) | 'thank_you' (Submitted)
  const [currentScreen, setCurrentScreen] = useState<'items' | 'feedback' | 'thank_you'>('items');

  // Customer / Student Contact Info
  const [guestName, setGuestName] = useState(() => {
    if (initialGuestName) return initialGuestName;
    if (initialVenueMode === 'mess') return 'KAVIN S (ROLL: 23CS108)';
    return 'ALEX MORGAN';
  });

  const [guestContact, setGuestContact] = useState(() => {
    if (initialGuestContact) return initialGuestContact;
    if (initialVenueMode === 'mess') return 'Hostel Room B-204 • Lunch';
    return '+91 98765 43210 • Table 4';
  });

  // Ordered / Meal Items Ratings & Individual Notes
  const [items, setItems] = useState<ThemeOrderItem[]>(() => {
    if (initialItems && initialItems.length > 0) return initialItems;
    if (initialVenueMode === 'mess') return MESS_SAMPLE_ITEMS;
    if (initialVenueMode === 'burger') return BURGER_SAMPLE_ITEMS;
    return UNIVERSAL_SAMPLE_ITEMS;
  });

  const [showAllItems, setShowAllItems] = useState(false);

  // Categories (Food, Service/Hygiene, Other Queries/Timings)
  const [foodRating, setFoodRating] = useState(5);
  const [foodFeedback, setFoodFeedback] = useState('');
  const [serviceRating, setServiceRating] = useState(5);
  const [serviceFeedback, setServiceFeedback] = useState('');
  const [otherQueries, setOtherQueries] = useState('');

  // Screen 2 States (Overall Feedback & Rating)
  const [detailedFeedback, setDetailedFeedback] = useState('');
  const [overallRating, setOverallRating] = useState(5);
  const [issueTag, setIssueTag] = useState('');
  const [, setShowConfetti] = useState(false);

  // Handle switching venue presets
  const handleModeChange = (newMode: VenueMode) => {
    setVenueMode(newMode);
    if (!initialItems) {
      if (newMode === 'mess') {
        setItems(MESS_SAMPLE_ITEMS);
        if (!guestName || guestName === 'ALEX MORGAN' || guestName === 'ALEX') {
          setGuestName('KAVIN S (ROLL: 23CS108)');
        }
        if (!guestContact || guestContact.includes('@') || guestContact.includes('Table')) {
          setGuestContact('Hostel Room B-204 • Lunch');
        }
      } else if (newMode === 'burger') {
        setItems(BURGER_SAMPLE_ITEMS);
        if (guestName === 'KAVIN S (ROLL: 23CS108)') {
          setGuestName('ALEX MORGAN');
        }
        if (guestContact.includes('Hostel Room')) {
          setGuestContact('alex.foodie@gmail.com');
        }
      } else {
        setItems(UNIVERSAL_SAMPLE_ITEMS);
        if (guestName === 'KAVIN S (ROLL: 23CS108)') {
          setGuestName('ALEX MORGAN');
        }
        if (guestContact.includes('Hostel Room')) {
          setGuestContact('+91 98765 43210 • Table 4');
        }
      }
    }
  };

  // Handle rating change for a specific item
  const handleItemRating = (id: string | number, newRating: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rating: newRating } : item
      )
    );
  };

  const handleItemFeedbackChange = (id: string | number, val: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, feedback: val } : item
      )
    );
  };

  const handleFinalSubmit = async () => {
    setShowConfetti(true);
    if (onSubmitFeedback) {
      await onSubmitFeedback({
        venueMode,
        guestName,
        guestContact,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          rating: i.rating || 5,
          feedback: i.feedback || ''
        })),
        foodRating,
        foodFeedback,
        serviceRating,
        serviceFeedback,
        otherQueries,
        overallRating,
        detailedFeedback
      });
    }
    setCurrentScreen('thank_you');
  };

  // Visible items based on chevron toggle
  const visibleItems = showAllItems ? items : items.slice(0, 4);

  // Dynamic Venue Display Name
  const displayVenueName =
    restaurantName ||
    (venueMode === 'mess'
      ? 'CAMPUS STUDENT HOSTEL MESS'
      : venueMode === 'burger'
      ? 'THE RETRO BURGER DINER'
      : 'THE ROYAL RASOI RESTAURANT');

  return (
    <div className="w-full min-h-screen py-2 sm:py-6 px-0.5 sm:px-3 pb-32 sm:pb-12 flex flex-col items-center justify-center bg-[#291e17] font-diner relative overflow-hidden">
      {/* Decorative ambient background blur spots */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Calm, Pleasant, Slow Revolving Circular Orbit of Emojis around the Page */}
      <RevolvingEmojisOrbit />

      {/* Top Floating Preset Switcher (Applicable to Any Restaurant & Students Mess) */}
      <div className="relative z-30 mb-2.5 sm:mb-3 flex items-center justify-center px-1">
        <div className="bg-[#1b120c]/90 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-2xl sm:rounded-full border border-amber-600/40 shadow-xl flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 backdrop-blur-md max-w-full">
          <button
            type="button"
            onClick={() => handleModeChange('universal')}
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-retro tracking-wide transition-all flex items-center space-x-1 cursor-pointer ${
              venueMode === 'universal'
                ? 'bg-amber-500 text-[#1a110a] font-bold shadow-md scale-105'
                : 'text-amber-200/80 hover:text-amber-100 hover:bg-white/5'
            }`}
          >
            <span>🍽️</span>
            <span>RESTAURANTS</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('mess')}
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-retro tracking-wide transition-all flex items-center space-x-1 cursor-pointer ${
              venueMode === 'mess'
                ? 'bg-amber-500 text-[#1a110a] font-bold shadow-md scale-105'
                : 'text-amber-200/80 hover:text-amber-100 hover:bg-white/5'
            }`}
          >
            <span>🍛</span>
            <span>STUDENT MESS</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('burger')}
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-retro tracking-wide transition-all flex items-center space-x-1 cursor-pointer ${
              venueMode === 'burger'
                ? 'bg-amber-500 text-[#1a110a] font-bold shadow-md scale-105'
                : 'text-amber-200/80 hover:text-amber-100 hover:bg-white/5'
            }`}
          >
            <span>🍔</span>
            <span>BURGER DINER</span>
          </button>
        </div>
      </div>

      {/* Retro Theme Shell */}
      <div className="relative z-20 w-full max-w-[450px]">
        <RetroBurgerFrame
          onBack={() => {
            if (currentScreen === 'thank_you') setCurrentScreen('feedback');
            else if (currentScreen === 'feedback') setCurrentScreen('items');
          }}
          showBackArrow={currentScreen !== 'items'}
          onThumbsClick={() => {
            // Playful animation toggle between screens
            setCurrentScreen((prev) => (prev === 'items' ? 'feedback' : 'items'));
          }}
        >
          {/* ============================================================ */}
          {/* SCREEN 1: ITEMS & SERVICE RATINGS (Adaptive Food Theme)       */}
          {/* ============================================================ */}
          {currentScreen === 'items' && (
            <div className="flex flex-col justify-between h-full space-y-3.5 transition-opacity duration-300">
              {/* Top Banner (Adapts to Universal Restaurant / Mess / Burger) */}
              <div>
                <div className="text-center mb-1">
                  <span className="text-[10px] uppercase font-retro tracking-wider text-[#543d2c]/75">
                    {displayVenueName} {orderNumber ? `• #${orderNumber}` : ''}
                  </span>
                </div>

                {/* Sub-pill switcher inside the phone screen */}
                <div className="flex items-center justify-center gap-1.5 mb-1 px-2">
                  <button
                    type="button"
                    onClick={() => handleModeChange('universal')}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-retro tracking-wide transition-all border flex items-center space-x-1 cursor-pointer ${
                      venueMode === 'universal'
                        ? 'bg-[#523d2d] text-[#faefcb] border-[#faefcb]/50 shadow-xs'
                        : 'bg-[#faefcb]/60 text-[#523d2d] border-[#523d2d]/20 hover:bg-[#faefcb]'
                    }`}
                  >
                    <span>🍽️</span>
                    <span>RESTAURANT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange('mess')}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-retro tracking-wide transition-all border flex items-center space-x-1 cursor-pointer ${
                      venueMode === 'mess'
                        ? 'bg-[#523d2d] text-[#faefcb] border-[#faefcb]/50 shadow-xs'
                        : 'bg-[#faefcb]/60 text-[#523d2d] border-[#523d2d]/20 hover:bg-[#faefcb]'
                    }`}
                  >
                    <span>🍛</span>
                    <span>STUDENT MESS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange('burger')}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-retro tracking-wide transition-all border flex items-center space-x-1 cursor-pointer ${
                      venueMode === 'burger'
                        ? 'bg-[#523d2d] text-[#faefcb] border-[#faefcb]/50 shadow-xs'
                        : 'bg-[#faefcb]/60 text-[#523d2d] border-[#523d2d]/20 hover:bg-[#faefcb]'
                    }`}
                  >
                    <span>🍔</span>
                    <span>DINER</span>
                  </button>
                </div>

                <UniversalFoodBanner
                  mode={venueMode}
                  name={guestName}
                  contact={guestContact}
                  onNameChange={setGuestName}
                  onContactChange={setGuestContact}
                />
              </div>

              {/* Middle Container: Ordered Food / Mess Meal Items */}
              <div className="bg-[#523d2d] rounded-[24px] p-3.5 text-[#faefcb] shadow-md border border-[#3e2c1e] space-y-2.5">
                <div className="flex items-center justify-between px-1 pb-1 border-b border-[#6d4f38]/60 text-[10px] font-retro text-amber-200/80 uppercase tracking-wider">
                  <span>
                    {venueMode === 'mess'
                      ? 'TODAY\'S MESS MEAL'
                      : venueMode === 'universal'
                      ? 'ORDERED DISHES'
                      : 'ORDER ITEMS'}
                  </span>
                  <span>FEEDBACK & STAR</span>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  {visibleItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-1 py-0.5 group"
                    >
                      {/* Item Name */}
                      <span className="font-retro text-[10.5px] sm:text-[12px] leading-tight tracking-wide text-[#faefcb] flex-1 min-w-0 pr-1 drop-shadow-xs uppercase">
                        {item.name}
                      </span>

                      {/* Feedback Pill Input */}
                      <div className="w-18 xs:w-22 sm:w-26 shrink-0">
                        <input
                          type="text"
                          placeholder="NOTE"
                          value={item.feedback || ''}
                          onChange={(e) => handleItemFeedbackChange(item.id, e.target.value)}
                          className="w-full bg-white text-[#3d2a1b] font-retro text-[9.5px] sm:text-[11px] placeholder:text-[#523d2d]/60 px-1.5 py-0.5 sm:py-1 rounded-full text-center border-none shadow-xs focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all"
                        />
                      </div>

                      {/* Star Rating Button */}
                      <div className="shrink-0 flex items-center pl-0.5">
                        <StarIconDoodle
                          filled={(item.rating ?? 5) >= 4}
                          onClick={() =>
                            handleItemRating(
                              item.id,
                              (item.rating ?? 5) === 5 ? 3 : 5
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expand / Collapse Chevron Toggle */}
                {items.length > 4 && (
                  <div className="pt-1 border-t border-[#674c36]/60 flex justify-center">
                    <RetroChevronToggle
                      expanded={showAllItems}
                      onToggle={() => setShowAllItems(!showAllItems)}
                    />
                  </div>
                )}
              </div>

              {/* Bottom Container: Overall Food & Service / Hygiene Categories */}
              <div className="bg-[#523d2d] rounded-[24px] p-3 text-[#faefcb] shadow-md border border-[#3e2c1e] space-y-2">
                {/* Food / Mess Food Category Row */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center space-x-1 flex-1 min-w-0 pr-1">
                    <span className="font-retro text-[11px] sm:text-[12px] tracking-wide uppercase truncate">
                      {venueMode === 'mess'
                        ? 'MESS FOOD'
                        : venueMode === 'universal'
                        ? 'FOOD'
                        : 'FOOD'}
                    </span>
                    <CutleryDoodle className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                  </div>
                  <div className="w-18 xs:w-22 sm:w-26 shrink-0">
                    <input
                      type="text"
                      placeholder="NOTE"
                      value={foodFeedback}
                      onChange={(e) => setFoodFeedback(e.target.value)}
                      className="w-full bg-white text-[#3d2a1b] font-retro text-[9.5px] sm:text-[11px] placeholder:text-[#523d2d]/60 px-1.5 py-0.5 sm:py-1 rounded-full text-center border-none shadow-xs focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="shrink-0 pl-0.5">
                    <StarIconDoodle
                      filled={foodRating >= 4}
                      onClick={() => setFoodRating(foodRating === 5 ? 3 : 5)}
                    />
                  </div>
                </div>

                {/* Service / Mess Hygiene Category Row */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center space-x-1 flex-1 min-w-0 pr-1">
                    <span className="font-retro text-[11px] sm:text-[12px] tracking-wide uppercase truncate">
                      {venueMode === 'mess' ? 'HYGIENE' : 'SERVICE'}
                    </span>
                    <ClocheDoodle className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                  </div>
                  <div className="w-18 xs:w-22 sm:w-26 shrink-0">
                    <input
                      type="text"
                      placeholder="NOTE"
                      value={serviceFeedback}
                      onChange={(e) => setServiceFeedback(e.target.value)}
                      className="w-full bg-white text-[#3d2a1b] font-retro text-[9.5px] sm:text-[11px] placeholder:text-[#523d2d]/60 px-1.5 py-0.5 sm:py-1 rounded-full text-center border-none shadow-xs focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="shrink-0 pl-0.5">
                    <StarIconDoodle
                      filled={serviceRating >= 4}
                      onClick={() => setServiceRating(serviceRating === 5 ? 3 : 5)}
                    />
                  </div>
                </div>

                {/* Any Other Queries / Mess Suggestions Wide Pill */}
                <div className="pt-0.5">
                  <input
                    type="text"
                    placeholder={
                      venueMode === 'mess'
                        ? 'MESS SUGGESTIONS / QUERIES'
                        : 'SPECIAL REQUESTS / QUERIES'
                    }
                    value={otherQueries}
                    onChange={(e) => setOtherQueries(e.target.value)}
                    className="w-full bg-white text-[#3d2a1b] font-retro text-[9.5px] sm:text-[11px] placeholder:text-[#523d2d]/65 tracking-wide px-3 py-1.5 rounded-full text-center uppercase border-none shadow-xs focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Interactive Screen 1 -> Screen 2 Navigation Pill */}
              <div className="pt-1 pb-6 sm:pb-4">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('feedback')}
                  className="w-full py-2.5 pr-6 sm:pr-8 pl-3 bg-[#e5aa24] hover:bg-[#d89b1c] active:scale-95 text-[#2c1d11] font-retro text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-md border-2 border-[#b87c0e] transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>CONTINUE TO FEEDBACK & RATINGS</span>
                  <span className="text-sm">→</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 2: FEEDBACK, RATINGS & EMOJIS (Image 2)                */}
          {/* ============================================================ */}
          {currentScreen === 'feedback' && (
            <div className="flex flex-col justify-between h-full space-y-4 transition-opacity duration-300">
              {/* Top Feedback Header */}
              <div>
                <div className="flex items-center justify-center space-x-2 text-[#4d3728] font-retro text-lg sm:text-xl tracking-wider uppercase drop-shadow-xs mb-1.5">
                  <PencilNoteDoodle className="w-5 h-5 -mt-1 text-[#4d3728]" />
                  <h2>FEEDBACK</h2>
                </div>

                {/* Big Golden Yellow Feedback Card / Textarea */}
                <div className="relative bg-[#e5aa24] rounded-[28px] p-4 shadow-md border-2 border-[#c88d12] transition-transform hover:scale-[1.01]">
                  <textarea
                    rows={4}
                    value={detailedFeedback}
                    onChange={(e) => setDetailedFeedback(e.target.value)}
                    placeholder={
                      venueMode === 'mess'
                        ? 'Share your thoughts on mess food quality, roti softness, dal thickness, dining hall cleanliness, refill speed, or hostel mess timings...'
                        : venueMode === 'universal'
                        ? 'Tell us about the flavours, hospitality, ambience, presentation, portion size or how we can make your dining visit extraordinary...'
                        : 'Tell us about the flavours, crunch, buns, sauce, fries or how we can make your burger visit even tastier...'
                    }
                    className="w-full bg-transparent border-none text-[#2d1e11] font-diner font-semibold text-xs sm:text-sm placeholder:text-[#4d3728]/70 focus:outline-none resize-none selection:bg-amber-800 selection:text-white"
                  />
                  <div className="flex justify-between items-center text-[10px] font-retro text-[#4d3728]/75 mt-1 pt-1 border-t border-[#c88d12]/40">
                    <span>
                      {venueMode === 'mess' ? 'STUDENT MESS NOTES' : 'SHARE YOUR TASTE NOTES'}
                    </span>
                    <span>{detailedFeedback.length} CHARS</span>
                  </div>
                </div>
              </div>

              {/* Ratings Section */}
              <div>
                <div className="text-center text-[#4d3728] font-retro text-lg sm:text-xl tracking-wider uppercase drop-shadow-xs mb-2">
                  <h3>RATINGS</h3>
                </div>

                {/* Golden Yellow Ratings Card with 5 Stars and 5 Animated Emoji Faces */}
                <div className="bg-[#e5aa24] rounded-[28px] p-3.5 sm:p-4 shadow-md border-2 border-[#c88d12] space-y-3">
                  {/* 5 Columns - Left-to-Right Order: 1 Star (Left) to 5 Stars (Right) */}
                  <div className="grid grid-cols-5 gap-1 items-center justify-items-center w-full px-1">
                    {[
                      { starVal: 1, emojiRating: 1 },
                      { starVal: 2, emojiRating: 2 },
                      { starVal: 3, emojiRating: 3 },
                      { starVal: 4, emojiRating: 4 },
                      { starVal: 5, emojiRating: 5 }
                    ].map(({ starVal, emojiRating }, idx) => {
                      const isSelected = overallRating === starVal;
                      const isStarFilled = starVal <= overallRating;
                      return (
                        <div
                          key={idx}
                          className="flex flex-col items-center justify-center space-y-2 w-full text-center group cursor-pointer"
                          onClick={() => setOverallRating(starVal)}
                        >
                          {/* Centered Star */}
                          <div className="flex items-center justify-center w-full">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOverallRating(starVal);
                              }}
                              className="p-1 focus:outline-none transition-transform hover:scale-130 active:scale-95 mx-auto"
                              title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill={isStarFilled ? '#fff8db' : 'none'}
                                stroke="#fff8db"
                                strokeWidth="2.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`w-7 h-7 sm:w-8 sm:h-8 transition-all mx-auto ${
                                  isStarFilled
                                    ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pop-star'
                                    : 'opacity-70'
                                }`}
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            </button>
                          </div>

                          {/* Centered Emoji with Continuous Animated Movement */}
                          <div className="flex items-center justify-center w-full">
                            <EmojiFaceDoodle
                              rating={emojiRating}
                              selected={isSelected}
                              onClick={() => setOverallRating(starVal)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Micro helper label */}
                  <div className="text-center text-[11px] font-retro text-[#4d3728] uppercase tracking-wider">
                    {overallRating === 1 && '🚨 1 Star — Poor: We will escalate this!'}
                    {overallRating === 2 && '⚠️ 2 Stars — Below Average: Needs attention'}
                    {overallRating === 3 && '😐 3 Stars — Average: Tell us what we can improve'}
                    {overallRating === 4 && '👍 4 Stars — Good: Delicious & Enjoyable!'}
                    {overallRating === 5 && '🌟 5 Stars — Extraordinary Experience! 🌟'}
                  </div>
                </div>

                {/* If low rating (1-2), show quick problem classification tag */}
                {overallRating <= 2 && (
                  <div className="mt-2 p-2 bg-rose-100/90 border border-rose-300 rounded-xl text-center space-y-1 animate-fadeIn">
                    <span className="text-[10px] font-retro text-rose-900 uppercase block">
                      {venueMode === 'mess'
                        ? 'What was the mess issue?'
                        : 'What was the primary issue?'}
                    </span>
                    <div className="flex flex-wrap justify-center gap-1">
                      {(venueMode === 'mess'
                        ? ['Roti Hard / Cold', 'Dal Watery', 'Mess Hygiene', 'Refill Delay', 'Taste / Salt', 'Mess Staff']
                        : venueMode === 'universal'
                        ? ['Food Taste', 'Cold Food', 'Slow Service', 'Order Mixup', 'Staff Hospitality', 'Ambiance']
                        : ['Food Taste', 'Cold Food', 'Slow Service', 'Order Mixup', 'Staff']
                      ).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setIssueTag(tag)}
                          className={`text-[9px] font-retro px-2 py-0.5 rounded-full uppercase transition-all ${
                            issueTag === tag
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-white text-rose-800 hover:bg-rose-50'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Thank You Banner (Image 2) & Submit Button */}
              <div className="text-center pt-1 pb-6 sm:pb-4 space-y-2.5">
                <h4 className="font-retro text-[#4d3728] text-sm sm:text-base tracking-wider leading-snug uppercase drop-shadow-xs">
                  THANK YOU FOR YOUR
                  <br />
                  VALUABLE TIME !
                </h4>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="w-full py-2.5 sm:py-3 pr-6 sm:pr-8 pl-3 bg-[#523d2d] hover:bg-[#433022] active:scale-95 text-[#fbf1cd] font-retro text-xs sm:text-sm uppercase tracking-widest rounded-2xl shadow-lg border-2 border-[#3d2a1b] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <span>
                    {isSubmitting
                      ? 'SAVING FEEDBACK...'
                      : venueMode === 'mess'
                      ? 'SUBMIT MESS REVIEW'
                      : 'SUBMIT YOUR REVIEW'}
                  </span>
                  <span className="text-amber-300">★</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 3: THANK YOU & SUCCESS CELEBRATION                     */}
          {/* ============================================================ */}
          {currentScreen === 'thank_you' && (
            <div className="flex flex-col items-center justify-center text-center h-full py-6 space-y-5 animate-fadeIn">
              {/* Celebration Food Icon */}
              <div className="w-20 h-20 bg-[#e5aa24] rounded-full flex items-center justify-center shadow-lg border-4 border-[#c88d12] animate-bounce-emoji">
                <span className="text-4xl">
                  {venueMode === 'mess' ? '🍛' : venueMode === 'universal' ? '🍽️' : '🍔'}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-retro tracking-widest text-[#523d2d] bg-[#faefcb] px-3 py-1 rounded-full border border-[#d8c28f]">
                  {venueMode === 'mess' ? 'STUDENT FEEDBACK LOGGED' : 'REVIEW RECORDED'}
                </span>
                <h3 className="text-2xl font-retro text-[#4d3728] uppercase tracking-wide">
                  {venueMode === 'mess' ? 'THANK YOU FOR MESS FEEDBACK!' : 'THANK YOU FOR DINING WITH US!'}
                </h3>
                <p className="text-xs font-diner text-[#523d2d]/80 px-4 leading-relaxed">
                  {venueMode === 'mess'
                    ? `Your feedback for student ${guestName || 'student'} has been submitted directly to the Hostel Mess Committee & Warden to improve upcoming meals.`
                    : venueMode === 'universal'
                    ? `Your feedback for ${guestName ? `${guestName}'s visit` : 'your visit'} has been delivered straight to the head chef & restaurant management.`
                    : `Your feedback for ${guestName ? `${guestName}'s order` : 'your visit'} has been delivered straight to the diner crew & kitchen.`}
                </p>
              </div>

              {/* Star badge */}
              <div className="bg-[#e5aa24] px-5 py-2.5 rounded-2xl shadow-md border-2 border-[#c88d12] text-[#2d1e11] font-retro text-sm flex items-center space-x-2">
                <span>RATED: {overallRating} / 5</span>
                <span className="text-lg">
                  {overallRating === 5 ? '😄' : overallRating === 4 ? '🙂' : overallRating === 3 ? '😐' : overallRating === 2 ? '☹️' : '😡'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setCurrentScreen('items')}
                className="px-6 py-2.5 bg-[#523d2d] hover:bg-[#433022] active:scale-95 text-[#fbf1cd] font-retro text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                ← REVIEW AGAIN OR EDIT
              </button>
            </div>
          )}
        </RetroBurgerFrame>
      </div>
    </div>
  );
};
