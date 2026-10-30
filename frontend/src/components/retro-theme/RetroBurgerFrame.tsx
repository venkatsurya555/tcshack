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
    <div className="relative w-full max-w-[450px] mx-auto min-h-[780px] bg-[#c37b2d] rounded-[48px] p-0 shadow-2xl border-4 border-[#a35e16] flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="relative w-full h-14 flex items-center justify-between px-4 pt-2 pb-1 shrink-0">
        {/* Back Button */}
        <div className="w-10 flex items-center justify-center">
          {showBackArrow ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="text-[#1c1917] hover:text-black hover:scale-125 active:scale-95 transition-all p-1 focus:outline-none"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          ) : (
            <span className="text-[10px] font-retro text-[#593717]/60">RETRO</span>
          )}
        </div>

        {/* Center Thumbs Up / Down Doodle */}
        <div className="flex-1 flex items-center justify-center -mt-0.5">
          <ThumbsUpDownDoodle onClick={onThumbsClick} className="w-12 h-10 hover:rotate-6 transition-transform" />
        </div>

        {/* Right balance spacing */}
        <div className="w-10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#1c1917]/25" />
        </div>
      </div>

      {/* Main Inner Body with Side Borders */}
      <div className="relative flex-1 flex items-stretch w-full px-0 min-h-0">
        {/* Left Doodle Column - Dead Center with Smooth Circular Orbit Revolving Motion */}
        <div className="w-14 sm:w-16 shrink-0 flex flex-col justify-around items-center py-2 text-[#1c1917]">
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '0s' }} title="Coffee">
            <CoffeeCupDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '0.5s' }} title="French Fries">
            <FriesDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '1.0s' }} title="Toast">
            <ToastDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '1.5s' }} title="Pizza Slice">
            <PizzaDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '2.0s' }} title="Corn Dogs">
            <CornDogsDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '2.5s' }} title="Coffee">
            <CoffeeCupDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '3.0s' }} title="French Fries">
            <FriesDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '3.5s' }} title="Toast">
            <ToastDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '4.0s' }} title="Pizza Slice">
            <PizzaDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '4.5s' }} title="Fried Egg">
            <FriedEggDoodle className="w-6 h-6" />
          </div>
        </div>

        {/* Center Cream Canvas with Interactive Tomato Sauce Flowing Slider */}
        <div className="relative flex-1 max-h-[660px] my-0.5 flex flex-col">
          <div
            ref={scrollContainerRef}
            className="flex-1 bg-[#faefcb] rounded-[34px] px-3 sm:px-3.5 py-4 pr-5 sm:pr-6 shadow-inner flex flex-col justify-between overflow-y-auto border-2 border-[#ecdba8] hide-native-scrollbar relative"
          >
            {children}
          </div>

          {/* Tomato Sauce Flowing Slider ("like a tomato sauce flowing animation while scrolling up and down") */}
          <TomatoSauceSlider scrollRef={scrollContainerRef} />
        </div>

        {/* Right Doodle Column - Dead Center with Smooth Circular Orbit Revolving Motion (Matches User Screenshot) */}
        <div className="w-14 sm:w-16 shrink-0 flex flex-col justify-around items-center py-2 text-[#1c1917]">
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '0.2s' }} title="Pizza Slice">
            <PizzaDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '0.7s' }} title="Corn Dogs">
            <CornDogsDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '1.2s' }} title="Coffee">
            <CoffeeCupDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '1.7s' }} title="French Fries">
            <FriesDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '2.2s' }} title="Toast">
            <ToastDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '2.7s' }} title="Corn Dogs">
            <CornDogsDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '3.2s' }} title="Coffee">
            <CoffeeCupDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '3.7s' }} title="French Fries">
            <FriesDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '4.2s' }} title="Toast">
            <ToastDoodle className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '4.7s' }} title="Fried Egg">
            <FriedEggDoodle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Bottom Food Doodle Dock - Dead Center with Smooth Circular Revolving Motion */}
      <div className="w-full h-14 flex items-center justify-around px-3 pt-1 pb-2 shrink-0 text-[#1c1917]">
        <div className="flex-1 flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '0.3s' }} title="Birthday Cake"><CakeDoodle className="w-6 h-6 sm:w-7 sm:h-7" /></div>
        <div className="flex-1 flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '0.8s' }} title="Carrot"><CarrotDoodle className="w-6 h-6 sm:w-7 sm:h-7" /></div>
        <div className="flex-1 flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '1.3s' }} title="Crispy Drumstick"><DrumstickDoodle className="w-6 h-6 sm:w-7 sm:h-7" /></div>
        <div className="flex-1 flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '1.8s' }} title="Cheeseburger"><BurgerDoodle className="w-6 h-6 sm:w-7 sm:h-7" /></div>
        <div className="flex-1 flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '2.3s' }} title="Cocktail"><CocktailDoodle className="w-6 h-6 sm:w-7 sm:h-7" /></div>
        <div className="flex-1 flex items-center justify-center animate-circular-revolve-ccw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '2.8s' }} title="Noodle Soup"><NoodleBowlDoodle className="w-6 h-6 sm:w-7 sm:h-7" /></div>
        <div className="flex-1 flex items-center justify-center animate-circular-revolve-cw hover:scale-140 transition-transform cursor-pointer" style={{ animationDelay: '3.3s' }} title="Cutlery"><CutleryDoodle className="w-6 h-6 sm:w-7 sm:h-7" /></div>
      </div>
    </div>
  );
};
