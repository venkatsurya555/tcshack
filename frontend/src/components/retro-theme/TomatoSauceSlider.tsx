import React, { useState, useEffect, useRef } from 'react';

interface TomatoSauceSliderProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export const TomatoSauceSlider: React.FC<TomatoSauceSliderProps> = ({
  scrollRef,
  className = ''
}) => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'idle'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [trackHeight, setTrackHeight] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const scrollTimeout = useRef<number | null>(null);

  // Sync with scroll container
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      const pct = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100)) : 0;
      setScrollPercent(pct);

      if (scrollTop > lastScrollTop.current) {
        setScrollDirection('down');
      } else if (scrollTop < lastScrollTop.current) {
        setScrollDirection('up');
      }
      lastScrollTop.current = scrollTop;
      setIsScrolling(true);

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = window.setTimeout(() => {
        setIsScrolling(false);
        setScrollDirection('idle');
      }, 350);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (trackRef.current) {
      setTrackHeight(trackRef.current.clientHeight);
    }

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [scrollRef]);

  // Click on track to jump scroll
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || !scrollRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const clickPct = Math.min(1, Math.max(0, clickY / rect.height));

    const { scrollHeight, clientHeight } = scrollRef.current;
    scrollRef.current.scrollTo({
      top: clickPct * (scrollHeight - clientHeight),
      behavior: 'smooth'
    });
  };

  // Drag thumb to scroll
  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    const startY = e.clientY;
    const startScrollTop = scrollRef.current?.scrollTop || 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!trackRef.current || !scrollRef.current) return;
      const deltaY = moveEvent.clientY - startY;
      const trackH = trackRef.current.clientHeight;
      const { scrollHeight, clientHeight } = scrollRef.current;
      const maxScroll = scrollHeight - clientHeight;
      const deltaScroll = (deltaY / trackH) * maxScroll;

      scrollRef.current.scrollTop = Math.min(maxScroll, Math.max(0, startScrollTop + deltaScroll));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const thumbHeight = 54;
  const maxThumbTop = Math.max(0, (trackHeight || 480) - thumbHeight);
  const thumbTop = (scrollPercent / 100) * maxThumbTop;

  return (
    <div
      className={`absolute right-1 sm:right-1.5 top-3 bottom-3 w-5 flex flex-col items-center select-none pointer-events-auto z-20 ${className}`}
    >
      {/* Top Diner Ketchup Bottle Squeeze Cap */}
      <div
        className="w-4 h-4 -mb-0.5 flex items-center justify-center shrink-0 cursor-pointer transition-transform hover:scale-125"
        title="Diner Ketchup Sauce Slider"
        onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-xs">
          {/* Yellow squeeze bottle nozzle tip */}
          <polygon points="12,2 8,10 16,10" fill="#f59e0b" stroke="#d97706" strokeWidth="1.2" />
          {/* Red bottle collar */}
          <rect x="7" y="10" width="10" height="4" rx="1.5" fill="#ea3a1e" stroke="#c7280f" strokeWidth="1.2" />
          {/* Ripe tomato body */}
          <circle cx="12" cy="17" r="5" fill="#f04824" stroke="#c7280f" strokeWidth="1.2" />
          <circle cx="10" cy="15" r="1.2" fill="white" fillOpacity="0.8" />
        </svg>
      </div>

      {/* Condiment Slider Canal (Warm Diner Amber/Cream Groove) */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative flex-1 w-2.5 my-1 bg-[#fef3c7]/80 rounded-full border border-[#f59e0b]/35 shadow-inner cursor-pointer overflow-visible group"
      >
        {/* Warm golden-orange condiment guide line */}
        <div className="absolute inset-x-0 inset-y-1 mx-auto w-0.5 bg-gradient-to-b from-orange-400/40 via-amber-400/30 to-orange-400/40 rounded-full" />

        {/* The Flowing Realistic Tomato Ketchup Thumb */}
        <div
          onMouseDown={handleThumbMouseDown}
          style={{
            top: `${thumbTop}px`,
            height: `${thumbHeight}px`
          }}
          className={`absolute inset-x-[-3px] rounded-full cursor-grab active:cursor-grabbing transition-all duration-75 flex flex-col items-center justify-between ${
            isDragging ? 'scale-105' : ''
          }`}
        >
          {/* Realistic Heinz Tomato Sauce Body (Warm, glossy ripe tomato orange-red) */}
          <div
            className={`w-full h-full rounded-full bg-gradient-to-b from-[#ff6647] via-[#ea3a1e] to-[#c7280f] border-1.5 border-[#b9220a] shadow-md relative overflow-hidden transition-all ${
              isScrolling
                ? 'shadow-[0_0_10px_rgba(240,72,36,0.85)] scale-x-105'
                : 'hover:shadow-[0_0_8px_rgba(240,72,36,0.65)]'
            }`}
          >
            {/* Glossy liquid white shine line (appetizing specular highlight) */}
            <div className="absolute left-0.5 top-1 bottom-1 w-0.5 bg-white/80 rounded-full blur-[0.2px]" />

            {/* Continuous flowing warm liquid sauce sheen */}
            <div
              className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(180deg,transparent_0px,#fff_3px,transparent_7px)]"
              style={{
                backgroundSize: '100% 14px',
                animation: 'sauceFlowing 1.8s linear infinite'
              }}
            />

            {/* Appetizing squeeze wave accents */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-0.5 opacity-70">
              <div className="w-1.5 h-0.5 bg-white/90 rounded-full" />
              <div className="w-2 h-0.5 bg-[#a8200b] rounded-full" />
              <div className="w-1.5 h-0.5 bg-white/90 rounded-full" />
            </div>
          </div>

          {/* Smooth Rounded Sauce Dollop (Like a dollop on a burger or plate, NOT a blood drop) */}
          <div
            className={`absolute -bottom-1.5 w-3.5 h-3 transition-transform duration-200 pointer-events-none flex items-center justify-center ${
              scrollDirection === 'down'
                ? 'scale-y-115 scale-x-95 translate-y-0.5'
                : scrollDirection === 'up'
                ? 'scale-y-90 scale-x-110 -translate-y-0.5'
                : 'hover:scale-110'
            }`}
          >
            <svg viewBox="0 0 18 14" fill="none" className="w-full h-full drop-shadow-xs">
              {/* Rounded smooth sauce swirl dollop */}
              <ellipse cx="9" cy="7" rx="8" ry="6" fill="#ea3a1e" stroke="#b9220a" strokeWidth="1.2" />
              {/* Warm orange-red gradient overlay */}
              <ellipse cx="8.5" cy="6" rx="6" ry="4" fill="#f04824" />
              {/* Glossy white highlight spot */}
              <ellipse cx="6.5" cy="5" rx="2.5" ry="1.5" fill="white" fillOpacity="0.85" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Ketchup Dollop on Plate */}
      <div
        className="w-4 h-2.5 -mt-0.5 flex items-center justify-center shrink-0 cursor-pointer transition-transform hover:scale-125"
        title="Scroll to bottom"
        onClick={() => {
          if (!scrollRef.current) return;
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }}
      >
        <svg viewBox="0 0 22 12" fill="none" className="w-full h-full">
          {/* Sauce dollop on white plate */}
          <ellipse cx="11" cy="7" rx="10" ry="4.5" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
          <ellipse cx="11" cy="6" rx="7" ry="3.5" fill="#ea3a1e" stroke="#c7280f" strokeWidth="1" />
          <ellipse cx="9.5" cy="5" rx="3" ry="1.2" fill="white" fillOpacity="0.8" />
        </svg>
      </div>
    </div>
  );
};
