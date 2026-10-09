import React from 'react';
import {
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MANAGER_CREDENTIALS } from '../data/initialData';
import { CreatorProfileSection } from './CreatorProfileSection';

export const Footer: React.FC = () => {
  const {
    categories,
    setSelectedCategory,
    setContactModalOpen,
    setAuthModalOpen,
    setAuthModalDefaultTab,
    setCurrentView,
  } = useApp();

  return (
    <footer className="bg-[#071A33] text-white border-t border-white/10 text-xs">
      {/* CREATOR & FOUNDER SHOWCASE SECTION ("Created by Arun Prakash") */}
      <CreatorProfileSection />

      <div className="max-w-7xl mx-auto px-4 pt-10 pb-24 md:pb-6">
        {/* Value Proposition Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 mb-8 border-b border-white/10 text-center">
          <div className="flex flex-col items-center p-3 rounded-lg bg-[#040E1B]/50 border border-white/5">
            <Truck className="w-6 h-6 text-[#FFB703] mb-2" />
            <h4 className="font-bold text-sm text-gray-100">Free & Fast Delivery</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Across 19,000+ Indian Pincodes</p>
          </div>

          <div className="flex flex-col items-center p-3 rounded-lg bg-[#040E1B]/50 border border-white/5">
            <ShieldCheck className="w-6 h-6 text-[#138808] mb-2" />
            <h4 className="font-bold text-sm text-gray-100">100% Genuine Guarantee</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Direct from Arun Bookstores & Brands</p>
          </div>

          <div className="flex flex-col items-center p-3 rounded-lg bg-[#040E1B]/50 border border-white/5">
            <RotateCcw className="w-6 h-6 text-sky-400 mb-2" />
            <h4 className="font-bold text-sm text-gray-100">Easy 7-Day Returns</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Hassle-free doorstep replacement</p>
          </div>

          <div className="flex flex-col items-center p-3 rounded-lg bg-[#040E1B]/50 border border-white/5">
            <Sparkles className="w-6 h-6 text-[#FF7A00] mb-2" />
            <h4 className="font-bold text-sm text-gray-100">Instant UPI & COD</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Secure UPI & Email Order Dispatch</p>
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-700/60">
          {/* Col 1: About Bharat Kart */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xl font-black italic tracking-tight">
                Bharat<span className="text-[#FFB703]">Kart</span>
              </span>
              <span className="bg-[#FFB703] text-[#071A33] text-[10px] font-bold px-1.5 py-0.5 rounded">
                Plus
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-[11px] mb-3">
              India's premier online shopping platform bringing together Flipkart & Amazon style
              e-commerce with Arun Bookstores curated academic books, electronics, smartphones, and
              fashion.
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span>Official Partner:</span>
              <span className="underline">Arun Bookstores</span>
            </p>
          </div>

          {/* Col 2: Top Categories */}
          <div>
            <h4 className="text-gray-300 font-bold uppercase tracking-wider text-xs mb-3">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-gray-400 text-xs">
              {categories
                .filter((c) => c.id !== 'all')
                .slice(0, 7)
                .map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCurrentView('shop');
                      }}
                      className="hover:text-yellow-300 transition text-left"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Col 3: Portals & Logins */}
          <div>
            <h4 className="text-gray-300 font-bold uppercase tracking-wider text-xs mb-3">
              Role Access & Portals
            </h4>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li>
                <button
                  onClick={() => {
                    setAuthModalDefaultTab('user');
                    setAuthModalOpen(true);
                  }}
                  className="hover:text-yellow-300 transition flex items-center gap-1.5"
                >
                  <span>Customer Login & Sign Up</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAuthModalDefaultTab('employee');
                    setAuthModalOpen(true);
                  }}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5"
                >
                  <span>Employee Login (Staff Product Entry)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAuthModalDefaultTab('manager');
                    setAuthModalOpen(true);
                  }}
                  className="hover:text-amber-400 transition font-bold flex items-center gap-1.5 text-amber-300"
                >
                  <span>Manager Login (Admin Only)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Contact & Help */}
          <div>
            <h4 className="text-gray-300 font-bold uppercase tracking-wider text-xs mb-3">
              Store Support & Contact
            </h4>
            <div className="space-y-2.5 text-gray-400 text-xs">
              <a
                href={`mailto:${MANAGER_CREDENTIALS.email}`}
                className="flex items-center gap-2 text-[#FFB703] hover:text-white transition font-medium"
              >
                <Mail className="w-4 h-4 text-[#FF7A00] shrink-0" />
                <span>Manager: {MANAGER_CREDENTIALS.email}</span>
              </a>

              <a
                href="mailto:arunbookstores123@gmail.com"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition"
              >
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate">Store: arunbookstores123@gmail.com</span>
              </a>

              <div className="pt-2 text-[11px] text-gray-400">
                <span>Active UPI ID: </span>
                <span className="text-[#FFB703] font-mono font-bold">{MANAGER_CREDENTIALS.upiId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & payment security icons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-[11px]">
          <div>
            © 2026 Bharat Kart (भारत कार्ट) • Dedicated Partner: Arun Bookstores. All Rights Reserved.
          </div>

          <div className="flex items-center gap-3 text-gray-400 flex-wrap">
            <span className="bg-gray-800 px-2 py-0.5 rounded border border-gray-700 font-semibold text-[10px]">
              UPI AUTO-PAY
            </span>
            <span className="bg-gray-800 px-2 py-0.5 rounded border border-gray-700 font-semibold text-[10px]">
              GOOGLE PAY
            </span>
            <span className="bg-gray-800 px-2 py-0.5 rounded border border-gray-700 font-semibold text-[10px]">
              PHONEPE
            </span>
            <span className="bg-gray-800 px-2 py-0.5 rounded border border-gray-700 font-semibold text-[10px]">
              PAYTM
            </span>
            <span className="bg-gray-800 px-2 py-0.5 rounded border border-gray-700 font-semibold text-[10px]">
              CASH ON DELIVERY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
