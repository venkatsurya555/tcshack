import React from 'react';

// Common doodle icon wrapper with interactive hover animation
interface IconProps {
  className?: string;
  size?: number;
  onClick?: () => void;
}

export const ThumbsUpDownDoodle: React.FC<IconProps> = ({ className = 'w-10 h-10', onClick }) => (
  <div onClick={onClick} className={`inline-flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer ${className}`}>
    <svg viewBox="0 0 72 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
      {/* Thumbs Up (top-left) */}
      <path
        d="M16 26H9C7.3 26 6 24.7 6 23V13C6 11.3 7.3 10 9 10H16M16 26V8C16 5.8 17.8 4 20 4C21.8 4 23.3 5.2 23.8 6.9L26 15H36C38.2 15 40 16.8 40 19C40 19.4 39.9 19.8 39.8 20.2L37 32C36.6 33.7 35.1 35 33.3 35H21C18.2 35 16 32.8 16 30V26Z"
        stroke="#1c1917"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Thumbs Down (overlapping bottom-right) */}
      <path
        d="M56 22H63C64.7 22 66 23.3 66 25V35C66 36.7 64.7 38 63 38H56M56 22V40C56 42.2 54.2 44 52 44C50.2 44 48.7 42.8 48.2 41.1L46 33H36C33.8 33 32 31.2 32 29C32 28.6 32.1 28.2 32.2 27.8L35 16C35.4 14.3 36.9 13 38.7 13H51C53.8 13 56 15.2 56 18V22Z"
        stroke="#1c1917"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  </div>
);

export const PizzaDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 8C12 4 20 4 28 8L16 28L4 8Z" fill="#1c1917" fillOpacity="0.05" />
    <path d="M4 8C12 4 20 4 28 8" />
    <circle cx="16" cy="12" r="1.8" fill="#1c1917" />
    <circle cx="12" cy="18" r="1.8" fill="#1c1917" />
    <circle cx="20" cy="19" r="1.8" fill="#1c1917" />
  </svg>
);

export const CornDogsDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Left Corn Dog */}
    <rect x="7" y="4" width="7" height="17" rx="3.5" fill="#1c1917" fillOpacity="0.1" />
    <line x1="10.5" y1="21" x2="10.5" y2="28" strokeWidth="2.4" />
    <path d="M9 8C12 9 12 11 9 12C12 13 12 15 9 16" strokeWidth="1.8" />
    {/* Right Corn Dog */}
    <rect x="18" y="4" width="7" height="17" rx="3.5" fill="#1c1917" fillOpacity="0.1" />
    <line x1="21.5" y1="21" x2="21.5" y2="28" strokeWidth="2.4" />
    <path d="M20 8C23 9 23 11 20 12C23 13 23 15 20 16" strokeWidth="1.8" />
  </svg>
);

export const CoffeeCupDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 10H22V19C22 22 19 24 16 24H12C9 24 6 22 6 19V10Z" fill="#1c1917" fillOpacity="0.1" />
    <path d="M22 12H24.5C26 12 27 13 27 14.5C27 16 26 17 24.5 17H22" strokeWidth="2.2" />
    <line x1="5" y1="27" x2="27" y2="27" strokeWidth="2.6" />
    <path d="M11 6C11 4.5 12 4.5 12 3" strokeWidth="1.8" className="animate-steam-rise origin-bottom" />
    <path d="M16 6C16 4.5 17 4.5 17 3" strokeWidth="1.8" className="animate-steam-rise origin-bottom" style={{ animationDelay: '0.7s' }} />
  </svg>
);

export const FriesDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Box */}
    <path d="M7 14L9 28H23L25 14H7Z" fill="#1c1917" fillOpacity="0.1" />
    <path d="M11 14C12 16 20 16 21 14" />
    {/* Fries */}
    <rect x="9" y="6" width="3" height="8" rx="0.5" fill="#1c1917" />
    <rect x="14" y="4" width="3.5" height="10" rx="0.5" fill="#1c1917" className="animate-fry-pop origin-bottom" />
    <rect x="19.5" y="7" width="3" height="7" rx="0.5" fill="#1c1917" />
  </svg>
);

export const ToastDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="6" y="7" width="20" height="19" rx="5" fill="#1c1917" fillOpacity="0.1" />
    <rect x="11.5" y="12.5" width="9" height="8" rx="2" strokeWidth="2" />
  </svg>
);

export const FriedEggDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="16" cy="16" r="11" stroke="#1c1917" strokeWidth="2.8" fill="#1c1917" fillOpacity="0.05" />
    <circle cx="16" cy="16" r="4.8" fill="#1c1917" className="animate-yolk-squish origin-center" />
  </svg>
);

export const CakeDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="6" y="16" width="20" height="11" rx="2" fill="#1c1917" fillOpacity="0.1" />
    <line x1="16" y1="16" x2="16" y2="10" strokeWidth="2.2" />
    <circle cx="16" cy="8" r="2.2" fill="#ea580c" className="animate-candle-flicker origin-center" />
    <line x1="4" y1="27" x2="28" y2="27" strokeWidth="2.6" />
  </svg>
);

export const CarrotDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 18L7 28L17 23L25 15C26 14 26 12 25 11C24 10 22 10 21 11L12 18Z" fill="#1c1917" />
    <line x1="24" y1="11" x2="28" y2="6" strokeWidth="2" />
    <line x1="26" y1="13" x2="30" y2="10" strokeWidth="2" />
    <line x1="22" y1="9" x2="25" y2="4" strokeWidth="2" />
  </svg>
);

export const DrumstickDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="20" cy="12" rx="7.5" ry="5.5" transform="rotate(-35 20 12)" fill="#1c1917" />
    <line x1="14" y1="17" x2="7" y2="24" strokeWidth="3" />
    <circle cx="6" cy="24" r="2" fill="#1c1917" />
    <circle cx="8" cy="26" r="2" fill="#1c1917" />
  </svg>
);

export const BurgerDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Top Bun */}
    <path d="M6 14C6 8 10 5 16 5C22 5 26 8 26 14H6Z" fill="#1c1917" />
    {/* Filling */}
    <rect x="5" y="16.5" width="22" height="3" rx="1.5" fill="#1c1917" />
    {/* Bottom Bun */}
    <path d="M7 21H25C25 24 22 26 16 26C10 26 7 24 7 21Z" fill="#1c1917" />
  </svg>
);

export const CocktailDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 7H25L16 19L7 7Z" fill="#1c1917" fillOpacity="0.2" />
    <line x1="16" y1="19" x2="16" y2="27" strokeWidth="2.4" />
    <line x1="10" y1="27" x2="22" y2="27" strokeWidth="2.6" />
    <line x1="22" y1="4" x2="14" y2="15" strokeWidth="2" strokeDasharray="1 1" />
  </svg>
);

export const NoodleBowlDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 14H27C27 21 21 26 16 26C11 26 5 21 5 14Z" fill="#1c1917" />
    <line x1="9" y1="27" x2="23" y2="27" strokeWidth="2.8" />
    <path d="M10 10C10 7 13 8 13 5" strokeWidth="1.8" />
    <path d="M16 11C16 8 19 9 19 6" strokeWidth="1.8" />
    <path d="M21 11C21 8 24 9 24 6" strokeWidth="1.8" />
  </svg>
);

export const CutleryDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Fork */}
    <path d="M9 5V12C9 14 11 15 13 15V27M7 5V10M11 5V10M13 5V10" strokeWidth="2.2" />
    {/* Knife */}
    <path d="M21 5C23 6 25 9 25 14V27H22V5" fill="#1c1917" />
  </svg>
);

export const ClocheDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 21C6 13 10 9 16 9C22 9 26 13 26 21H6Z" fill="#1c1917" />
    <circle cx="16" cy="7" r="2.2" fill="#1c1917" />
    <line x1="4" y1="23" x2="28" y2="23" strokeWidth="3" />
  </svg>
);

export const PencilNoteDoodle: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="7" y="9" width="16" height="18" rx="2" fill="#543d2c" stroke="#1c1917" />
    <path d="M16 6L24 14L22 16L14 8L16 6Z" fill="#e5aa24" stroke="#1c1917" strokeWidth="2" />
  </svg>
);

export const RetroChevronToggle: React.FC<{ expanded?: boolean; onToggle?: () => void }> = ({
  expanded = false,
  onToggle
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label="Toggle menu items view"
    className="group flex flex-col items-center justify-center p-1.5 mx-auto text-amber-200/90 hover:text-amber-100 transition-all transform active:scale-90"
  >
    <svg viewBox="0 0 32 20" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-4 transition-transform group-hover:translate-y-[-2px]">
      <path d="M6 14L16 5L26 14" />
      <path d="M6 18L16 11L26 18" opacity="0.6" />
    </svg>
  </button>
);

export const StarIconDoodle: React.FC<{
  filled: boolean;
  size?: number;
  onClick?: () => void;
  className?: string;
}> = ({ filled, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-1 transition-all transform hover:scale-125 active:scale-90 focus:outline-none ${className}`}
  >
    <svg
      viewBox="0 0 24 24"
      fill={filled ? '#f59e0b' : 'none'}
      stroke={filled ? '#b45309' : '#d97706'}
      strokeWidth={filled ? '1.8' : '2.2'}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-6 h-6 transition-all duration-300 ${
        filled ? 'filter drop-shadow-[0_0_6px_rgba(245,158,11,0.85)] scale-110' : 'opacity-85 hover:opacity-100'
      }`}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  </button>
);

// The 5 expressive doodle emojis matching Screen 2:
// 1 = 😡 Angry/Steaming
// 2 = ☹️ Sad/Frown
// 3 = 😐 Neutral
// 4 = 🙂 Happy/Smile
// 5 = 😄 Super Grin/Laughing
export const EmojiFaceDoodle: React.FC<{
  rating: number; // 1 to 5
  selected: boolean;
  onClick?: () => void;
  size?: number;
}> = ({ rating, selected, onClick }) => {
  const getContinuousAnimation = () => {
    if (selected) {
      return 'scale-125 drop-shadow-[0_0_10px_rgba(250,204,21,0.9)] animate-gentle-float';
    }
    return 'animate-calm-circular-micro hover:scale-120 transition-transform';
  };

  // Staggered circular micro-motion delay for each rating emoji
  const delay = `${((rating - 1) * 0.75).toFixed(2)}s`;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: delay }}
      className={`relative flex items-center justify-center p-1 sm:p-1.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer mx-auto ${getContinuousAnimation()}`}
      title={`Rating ${rating} out of 5`}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        stroke="#1c1917"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8 sm:w-9 sm:h-9"
      >
        {/* Outer Circle */}
        <circle
          cx="18"
          cy="18"
          r="15"
          fill={selected ? '#fde047' : '#fef08a'}
          stroke="#1c1917"
          strokeWidth="2.8"
        />

        {rating === 5 && (
          // 😄 Beaming Laughing Eyes & Big Grin
          <>
            <path d="M11 15C12 12.5 15 12.5 16 15" strokeWidth="2.6" />
            <path d="M20 15C21 12.5 24 12.5 25 15" strokeWidth="2.6" />
            <path d="M11 20C11 25.5 25 25.5 25 20H11Z" fill="#1c1917" />
          </>
        )}

        {rating === 4 && (
          // 🙂 Warm Happy Smile
          <>
            <circle cx="13" cy="14" r="1.8" fill="#1c1917" />
            <circle cx="23" cy="14" r="1.8" fill="#1c1917" />
            <path d="M12 21C14 24 22 24 24 21" strokeWidth="2.6" />
          </>
        )}

        {rating === 3 && (
          // 😐 Neutral / Straight Line
          <>
            <circle cx="13" cy="14" r="1.8" fill="#1c1917" />
            <circle cx="23" cy="14" r="1.8" fill="#1c1917" />
            <line x1="12" y1="22" x2="24" y2="22" strokeWidth="2.8" />
          </>
        )}

        {rating === 2 && (
          // ☹️ Sad Frown
          <>
            <circle cx="13" cy="14" r="1.8" fill="#1c1917" />
            <circle cx="23" cy="14" r="1.8" fill="#1c1917" />
            <path d="M12 24C14 21 22 21 24 24" strokeWidth="2.6" />
          </>
        )}

        {rating === 1 && (
          // 😡 Angry / Steaming Furrowed Eyebrows
          <>
            <line x1="10" y1="12" x2="15" y2="15" strokeWidth="2.8" />
            <line x1="26" y1="12" x2="21" y2="15" strokeWidth="2.8" />
            <circle cx="13" cy="16" r="1.8" fill="#1c1917" />
            <circle cx="23" cy="16" r="1.8" fill="#1c1917" />
            <path d="M12 25C14 21.5 22 21.5 24 25" strokeWidth="2.8" />
          </>
        )}
      </svg>
    </button>
  );
};
