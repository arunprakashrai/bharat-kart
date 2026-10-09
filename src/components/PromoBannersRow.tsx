import React, { useState, useEffect } from 'react';
import { Flame, ArrowRight, ShieldCheck, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PromoBannersRow: React.FC = () => {
  const { setSelectedCategory, setCartOpen } = useApp();

  // Dynamic countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 18,
    seconds: 45,
    ms: 9,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59, ms: 9 };
        }
        return { hours: 2, minutes: 18, seconds: 45, ms: 9 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="bharat-deal-banner" className="max-w-7xl mx-auto px-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
        {/* BANNER 1: BHARAT DEAL OF THE DAY (approx 7.5 / 12 cols on desktop) */}
        <div className="md:col-span-8 bg-gradient-to-r from-[#071A33] via-[#0E284D] to-[#3B1A04] rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          {/* Subtle glow */}
          <div className="absolute top-0 right-1/4 w-52 h-52 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-[#FF7A00] font-black text-xs sm:text-sm tracking-wide uppercase">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
                BHARAT DEAL OF THE DAY
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[#FFB703] tracking-tight">
                Up to 70% OFF
              </span>
              <span className="text-xs text-gray-300 hidden sm:inline">• Top Electronics & Fashion</span>
            </div>

            {/* Countdown timer pills */}
            <div className="flex items-center gap-1 sm:gap-2 mb-4 flex-wrap">
              <div className="bg-black/60 border border-white/20 rounded-lg px-2.5 py-1 text-center min-w-10">
                <span className="text-xs sm:text-sm font-black text-white font-mono block">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-gray-300 block -mt-0.5">Hours</span>
              </div>
              <span className="font-bold text-orange-400">:</span>
              <div className="bg-black/60 border border-white/20 rounded-lg px-2.5 py-1 text-center min-w-10">
                <span className="text-xs sm:text-sm font-black text-white font-mono block">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-gray-300 block -mt-0.5">Minutes</span>
              </div>
              <span className="font-bold text-orange-400">:</span>
              <div className="bg-black/60 border border-white/20 rounded-lg px-2.5 py-1 text-center min-w-10">
                <span className="text-xs sm:text-sm font-black text-white font-mono block">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-gray-300 block -mt-0.5">Seconds</span>
              </div>
            </div>
          </div>

          {/* Bottom row: CTA & Product Thumbnails */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 flex-wrap">
            <button
              onClick={() => {
                setSelectedCategory('electronics');
                const el = document.getElementById('trending-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#FFB703] hover:bg-[#EBA802] text-[#071A33] font-black text-xs sm:text-sm py-2 px-4 rounded-full shadow-md transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>Grab This Deal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Product thumbnails preview */}
            <div className="flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80"
                alt="Smartwatch"
                className="w-10 h-10 object-contain bg-white rounded-lg p-1 border border-white/20 shadow-xs"
              />
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80"
                alt="Headphones"
                className="w-10 h-10 object-contain bg-white rounded-lg p-1 border border-white/20 shadow-xs"
              />
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80"
                alt="Running Shoes"
                className="w-10 h-10 object-contain bg-white rounded-lg p-1 border border-white/20 shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* BANNER 2: MADE FOR BHARAT (approx 4.5 / 12 cols on desktop) */}
        <div className="md:col-span-4 bg-gradient-to-br from-[#FFF3E0] via-[#FFE0B2] to-[#FFCC80] rounded-2xl p-5 sm:p-6 text-[#071A33] shadow-md border border-orange-200 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-full text-orange-800 inline-block mb-1">
              Desi Heritage
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              Made for Bharat
            </h3>
            <p className="text-xs text-orange-950 font-bold mt-0.5">
              Support Local. Support Indian.
            </p>
            <p className="text-[11px] text-gray-700 mt-2 leading-relaxed">
              Arun Bookstores academic publications, handcrafted textiles, organic essentials & Indian brands.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between gap-2 relative z-10">
            <button
              onClick={() => {
                setSelectedCategory('books');
                const el = document.getElementById('trending-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#138808] hover:bg-[#107507] text-white font-black text-xs py-2 px-4 rounded-full shadow-md transition flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Indian handicrafts & lamps image */}
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80"
              alt="Made for Bharat"
              className="w-14 h-14 object-cover rounded-xl border-2 border-white shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
