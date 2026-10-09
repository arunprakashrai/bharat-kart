import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Crown, Headphones } from 'lucide-react';

export const TrustFeaturesStrip: React.FC = () => {
  return (
    <div className="bg-[#071A33] border-t border-b border-white/10 text-white py-4 px-4 my-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 flex-1">
          {/* 1. Free Delivery */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg text-[#FFB703] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight text-white">Free Delivery</p>
              <p className="text-[10px] text-gray-300">On orders above ₹499</p>
            </div>
          </div>

          {/* 2. Easy Returns */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg text-sky-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight text-white">Easy Returns</p>
              <p className="text-[10px] text-gray-300">Within 7 days</p>
            </div>
          </div>

          {/* 3. Secure Payments */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg text-[#138808] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight text-white">Secure Payments</p>
              <p className="text-[10px] text-gray-300">100% Safe & Secure</p>
            </div>
          </div>

          {/* 4. Bharat Card+ */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg text-[#FFB703] shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight text-white">Bharat Card+</p>
              <p className="text-[10px] text-gray-300">More Savings, More Benefits</p>
            </div>
          </div>

          {/* 5. 24/7 Support */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg text-orange-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight text-white">24/7 Support</p>
              <p className="text-[10px] text-gray-300">We're always here</p>
            </div>
          </div>
        </div>

        {/* Script Logo on the right */}
        <div className="text-right hidden lg:block shrink-0 pl-4 border-l border-white/10">
          <p className="text-sm font-black italic tracking-wide text-white font-serif">
            Bharat Card
          </p>
          <p className="text-[9px] text-[#FFB703] tracking-widest uppercase font-semibold">
            India in Every Click
          </p>
        </div>
      </div>
    </div>
  );
};
