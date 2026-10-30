import React from 'react';

interface OrbitItem {
  id: string;
  emoji: string;
  label: string;
  size?: string;
  bgGlow?: string;
}

const ORBIT_ITEMS: OrbitItem[] = [
  { id: '1', emoji: '😄', label: 'Super Happy', size: 'text-2xl sm:text-3xl', bgGlow: 'rgba(250, 204, 21, 0.35)' },
  { id: '2', emoji: '🍕', label: 'Pizza', size: 'text-xl sm:text-2xl', bgGlow: 'rgba(249, 115, 22, 0.3)' },
  { id: '3', emoji: '🙂', label: 'Happy', size: 'text-2xl sm:text-3xl', bgGlow: 'rgba(250, 204, 21, 0.35)' },
  { id: '4', emoji: '⭐', label: '5 Stars', size: 'text-xl sm:text-2xl', bgGlow: 'rgba(234, 179, 8, 0.4)' },
  { id: '5', emoji: '🍔', label: 'Cheeseburger', size: 'text-xl sm:text-2xl', bgGlow: 'rgba(217, 119, 6, 0.35)' },
  { id: '6', emoji: '😐', label: 'Average', size: 'text-2xl sm:text-3xl', bgGlow: 'rgba(251, 191, 36, 0.35)' },
  { id: '7', emoji: '🍟', label: 'Fries', size: 'text-xl sm:text-2xl', bgGlow: 'rgba(245, 158, 11, 0.3)' },
  { id: '8', emoji: '☹️', label: 'Poor', size: 'text-2xl sm:text-3xl', bgGlow: 'rgba(239, 68, 68, 0.3)' },
  { id: '9', emoji: '🌮', label: 'Taco', size: 'text-xl sm:text-2xl', bgGlow: 'rgba(249, 115, 22, 0.3)' },
  { id: '10', emoji: '😡', label: 'Angry', size: 'text-2xl sm:text-3xl', bgGlow: 'rgba(239, 68, 68, 0.35)' }
];

export const RevolvingEmojisOrbit: React.FC = () => {
  const count = ORBIT_ITEMS.length;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-10">
      {/* Outer ambient soft glowing ring */}
      <div className="absolute w-[540px] h-[780px] sm:w-[620px] sm:h-[860px] rounded-[60px] border border-amber-500/15 shadow-[0_0_80px_rgba(245,158,11,0.06)] pointer-events-none" />

      {/* The revolving circular orbit track */}
      <div className="relative w-[520px] h-[760px] sm:w-[600px] sm:h-[840px] pointer-events-none">
        {ORBIT_ITEMS.map((item, index) => {
          // Angle in degrees for each item around the ellipse
          const angleDeg = (index / count) * 360;
          // Calculate staggered delay so each starts at its angle
          const animationDelay = `-${(index * (40 / count)).toFixed(2)}s`;

          return (
            <div
              key={item.id}
              className="absolute left-1/2 top-1/2 -ml-6 -mt-6 w-12 h-12 flex items-center justify-center pointer-events-none animate-revolve-orbit"
              style={{
                animationDelay,
                animationDuration: '42s'
              }}
            >
              {/* Floating circular bubble badge */}
              <div
                className={`relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#3d2a1b]/85 border-2 border-amber-300/40 shadow-lg backdrop-blur-xs transition-transform transform hover:scale-125 animate-gentle-float`}
                style={{
                  boxShadow: `0 4px 16px ${item.bgGlow}`,
                  animationDelay: `${(index * 0.4).toFixed(1)}s`
                }}
                title={item.label}
              >
                {/* Subtle soft pulse halo */}
                <div
                  className="absolute inset-0 rounded-full opacity-40 animate-pulse"
                  style={{ backgroundColor: item.bgGlow }}
                />

                {/* The Emoji itself */}
                <span className={`${item.size} relative drop-shadow-md`}>
                  {item.emoji}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
