import React, { useRef } from 'react';
import {
  ThumbsUpDownDoodle,
  PizzaDoodle,
  CornDogsDoodle,
  CoffeeCupDoodle,
  FriesDoodle,
  ToastDoodle,
  FriedEggDoodle,
  CakeDoodle,
  CarrotDoodle,
  DrumstickDoodle,
  BurgerDoodle,
  CocktailDoodle,
  NoodleBowlDoodle,
  CutleryDoodle
} from './RetroFoodIcons';
import { TomatoSauceSlider } from './TomatoSauceSlider';

interface RetroBurgerFrameProps {
  children: React.ReactNode;
  onBack?: () => void;
  showBackArrow?: boolean;
  onThumbsClick?: () => void;
}

export const RetroBurgerFrame: React.FC<RetroBurgerFrameProps> = ({
  children,
  onBack,
  showBackArrow = true,
  onThumbsClick
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full max-w-[430px] mx-auto min-h-[620px] sm:min-h-[740px] bg-[#c37b2d] rounded-[28px] sm:rounded-[44px] p-0 shadow-2xl border-2 sm:border-4 border-[#a35e16] flex flex-col justify-between overflow-hidden select-none transition-all">
      {/* Top Header Bar */}
      <div className="relative w-full h-11 sm:h-13 flex items-center justify-between px-3 sm:px-4 pt-1 sm:pt-2 pb-0.5 shrink-0">
        {/* Back Button */}
        <div className="w-8 sm:w-9 flex items-center justify-center">
          {showBackArrow ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="text-[#1c1917] hover:text-black hover:scale-125 active:scale-95 transition-all p-1 focus:outline-none"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          ) : (
            <span className="text-[9px] sm:text-[10px] font-retro text-[#593717]/60">RETRO</span>
          )}
        </div>

        {/* Center Thumbs Up / Down Doodle */}
        <div className="flex-1 flex items-center justify-center -mt-0.5">
          <ThumbsUpDownDoodle onClick={onThumbsClick} className="w-9 h-7 sm:w-11 sm:h-9 hover:rotate-6 transition-transform" />
        </div>

        {/* Right balance spacing */}
        <div className="w-8 sm:w-9 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#1c1917]/25" />
        </div>
      </div>

      {/* Main Inner Body with Side Borders */}
      <div className="relative flex-1 flex items-stretch w-full px-1 sm:px-0 min-h-0">
        {/* Left Doodle Column - Dead Center with Smooth Circular Orbit Revolving Motion (Always visible) */}
        <div className="w-8 sm:w-11 md:w-13 shrink-0 flex flex-col justify-around items-center py-2 text-[#1c1917]">
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '0s' }} title="Coffee">
            <CoffeeCupDoodle className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '0.5s' }} title="French Fries">
            <FriesDoodle className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '1.0s' }} title="Toast">
            <ToastDoodle className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '1.5s' }} title="Pizza Slice">
            <PizzaDoodle className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '2.0s' }} title="Corn Dogs">
            <CornDogsDoodle className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '2.5s' }} title="Coffee">
            <CoffeeCupDoodle className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '3.0s' }} title="French Fries">
            <FriesDoodle className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '3.5s' }} title="Toast">
            <ToastDoodle className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '4.0s' }} title="Pizza Slice">
            <PizzaDoodle className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '4.5s' }} title="Fried Egg">
            <FriedEggDoodle className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
          </div>
        </div>

        {/* Center Cream Canvas with Interactive Tomato Sauce Flowing Slider */}
        <div className="relative flex-1 min-w-0 max-h-[580px] sm:max-h-[660px] my-0.5 flex flex-col">
          <div
            ref={scrollContainerRef}
            className="flex-1 bg-[#faefcb] rounded-[20px] sm:rounded-[32px] px-2 sm:px-3 py-2.5 sm:py-3.5 pr-6 sm:pr-7 shadow-inner flex flex-col justify-between overflow-y-auto border-2 border-[#ecdba8] hide-native-scrollbar relative"
          >
            {children}
          </div>

          {/* Tomato Sauce Flowing Slider ("like a tomato sauce flowing animation while scrolling up and down") */}
          <TomatoSauceSlider scrollRef={scrollContainerRef} />
        </div>

        {/* Right Doodle Column (Shown on tablet/desktop, smoothly hidden on phone to give maximum space to dishes) */}
        <div className="hidden sm:flex w-11 md:w-13 shrink-0 flex-col justify-around items-center py-2 text-[#1c1917]">
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '0.2s' }} title="Pizza Slice">
            <PizzaDoodle className="w-5.5 h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '0.7s' }} title="Corn Dogs">
            <CornDogsDoodle className="w-5.5 h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '1.2s' }} title="Coffee">
            <CoffeeCupDoodle className="w-5.5 h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '1.7s' }} title="French Fries">
            <FriesDoodle className="w-5.5 h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '2.2s' }} title="Toast">
            <ToastDoodle className="w-5.5 h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '2.7s' }} title="Corn Dogs">
            <CornDogsDoodle className="w-5.5 h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '3.2s' }} title="Coffee">
            <CoffeeCupDoodle className="w-5.5 h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '3.7s' }} title="French Fries">
            <FriesDoodle className="w-5.5 h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '4.2s' }} title="Toast">
            <ToastDoodle className="w-5.5 h-5.5" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '4.7s' }} title="Fried Egg">
            <FriedEggDoodle className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* Bottom Food Doodle Dock - Dead Center with Smooth Circular Revolving Motion */}
      <div className="w-full h-10 sm:h-13 flex items-center justify-around px-2 sm:px-3 pt-0.5 sm:pt-1 pb-1 sm:pb-2 shrink-0 text-[#1c1917]">
        <div className="flex-1 flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '0.3s' }} title="Birthday Cake"><CakeDoodle className="w-4.5 h-4.5 sm:w-6.5 sm:h-6.5" /></div>
        <div className="flex-1 flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '0.8s' }} title="Carrot"><CarrotDoodle className="w-4.5 h-4.5 sm:w-6.5 sm:h-6.5" /></div>
        <div className="flex-1 flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '1.3s' }} title="Crispy Drumstick"><DrumstickDoodle className="w-4.5 h-4.5 sm:w-6.5 sm:h-6.5" /></div>
        <div className="flex-1 flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '1.8s' }} title="Cheeseburger"><BurgerDoodle className="w-4.5 h-4.5 sm:w-6.5 sm:h-6.5" /></div>
        <div className="flex-1 flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '2.3s' }} title="Cocktail"><CocktailDoodle className="w-4.5 h-4.5 sm:w-6.5 sm:h-6.5" /></div>
        <div className="flex-1 flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '2.8s' }} title="Noodle Soup"><NoodleBowlDoodle className="w-4.5 h-4.5 sm:w-6.5 sm:h-6.5" /></div>
        <div className="flex-1 flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '3.3s' }} title="Cutlery"><CutleryDoodle className="w-4.5 h-4.5 sm:w-6.5 sm:h-6.5" /></div>
      </div>
    </div>
  );
};
