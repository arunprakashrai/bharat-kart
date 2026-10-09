import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Briefcase,
  Layers,
  Heart,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MANAGER_CREDENTIALS } from '../data/initialData';

export const HeroSplitSection: React.FC = () => {
  const {
    currentUser,
    setCurrentView,
    setAuthModalOpen,
    setAuthModalDefaultTab,
    loginUser,
    loginWithGoogle,
    setSelectedCategory,
    showToast,
    logout,
  } = useApp();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!emailOrPhone.trim() || !password.trim()) {
      setLoginError('Please enter mobile/email and password');
      return;
    }
    const res = loginUser(emailOrPhone.trim(), password);
    if (res.success) {
      showToast(`Welcome back, ${res.message}!`);
      setEmailOrPhone('');
      setPassword('');
    } else {
      setLoginError(res.message || 'Invalid credentials');
    }
  };

  const handleQuickGoogle = () => {
    loginWithGoogle({
      name: 'Arun Prakash (IIT)',
      email: 'arunprakashiit@gmail.com',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-3 mb-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* LEFT / CENTER MAIN HERO BANNER (approx 8 cols on desktop) */}
        <div className="lg:col-span-8 bg-gradient-to-r from-[#FFF5EB] via-[#FFF9F2] to-[#FFF0E0] rounded-2xl border border-orange-100/80 shadow-md p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
          {/* Subtle India Gate and Tricolor Background Decorative Accents */}
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-20 sm:opacity-25 w-72 h-72">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-orange-600">
              {/* Stylized Indian Architectural Arch & Monument Silhouette */}
              <path d="M40 180 V80 H160 V180 H130 V110 Q100 85 70 110 V180 Z" fill="currentColor" />
              <circle cx="100" cy="55" r="15" fill="#FF7A00" />
            </svg>
          </div>

          {/* Top Indian Tricolor Ribbon Flourish */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-1.5 w-14 rounded-full overflow-hidden shadow-xs">
              <span className="w-1/3 bg-[#FF7A00]" />
              <span className="w-1/3 bg-white" />
              <span className="w-1/3 bg-[#138808]" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#FF7A00] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FFB703]" />
              Official Bharat Card Store
            </span>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-xl">
            {/* Brand Title with Flag Motif */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#071A33] font-sans flex items-center gap-2">
                <span>BHARAT</span>
                <span className="text-[#FF7A00]">CARD</span>
              </h1>
              {/* Tricolor wave flourish */}
              <div className="hidden sm:flex items-center -space-x-1">
                <span className="w-3 h-3 rounded-full bg-[#FF7A00]" />
                <span className="w-3 h-3 rounded-full bg-white border border-gray-300" />
                <span className="w-3 h-3 rounded-full bg-[#138808]" />
              </div>
            </div>

            <p className="text-xl sm:text-2xl font-black text-[#071A33] mb-1 leading-tight">
              Shop Bharat. Shop Smart.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 font-medium">
              Everything you need, one Bharat Card away.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  const el = document.getElementById('trending-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#FF7A00] hover:bg-[#E86F00] text-white font-black text-xs sm:text-sm py-2.5 px-5 rounded-full shadow-md transition transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('bharat-deal-banner');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-orange-50 text-[#071A33] border border-gray-300 font-bold text-xs sm:text-sm py-2.5 px-5 rounded-full shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5 text-[#FF7A00]" />
                <span>Today's Deals</span>
              </button>
            </div>
          </div>

          {/* Right Floating Cart Illustration & Badge */}
          <div className="mt-6 sm:mt-0 sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 flex flex-col items-center sm:items-end">
            <div className="relative">
              {/* Badge: Desh ka Apna Shopping Platform */}
              <div className="bg-white/95 backdrop-blur-xs border-2 border-orange-200 text-[#071A33] text-[10px] font-black py-1.5 px-3 rounded-xl shadow-lg flex items-center gap-1.5 mb-2 -rotate-2">
                <span className="text-rose-500">❤️</span>
                <span>Desh ka Apna Shopping Platform</span>
              </div>

              {/* Shopping trolley filled with items */}
              <div className="w-32 h-32 sm:w-44 sm:h-44 relative flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80"
                  alt="Shopping Cart"
                  className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-2xl rounded-2xl border-2 border-white"
                />
                <div className="absolute -bottom-2 -left-2 bg-[#FF7A00] text-white p-2 rounded-xl shadow-md font-black text-xs flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>100% Desi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT EMBEDDED WELCOME & QUICK LOGIN CARD (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-md p-5 flex flex-col justify-between">
          {!currentUser ? (
            <div>
              {/* Header inside login card */}
              <div className="text-center pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
                  <span className="font-extrabold text-xs tracking-tight text-[#071A33]">
                    BHARAT <span className="text-[#FF7A00]">CARD</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">• India in Every Click</span>
                </div>
                <h3 className="text-base font-black text-gray-900 leading-tight">Welcome Back!</h3>
                <p className="text-[11px] text-gray-500">Your shopping journey starts here.</p>
              </div>

              {loginError && (
                <div className="p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-[11px] mt-2 text-center font-medium">
                  {loginError}
                </div>
              )}

              {/* Quick Login Form */}
              <form onSubmit={handleQuickLogin} className="space-y-2.5 mt-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Mobile / Email"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF7A00]"
                  />
                  <UserIcon className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-8 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF7A00]"
                  />
                  <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF7A00] hover:bg-[#E86F00] text-white font-black text-xs py-2.5 rounded-lg shadow-sm transition active:scale-98 cursor-pointer"
                >
                  Login to Bharat Card
                </button>
              </form>

              {/* OR Divider */}
              <div className="relative my-2.5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <span className="relative bg-white px-2 text-[10px] uppercase font-bold text-gray-400">
                  OR
                </span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleQuickGoogle}
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalDefaultTab('user');
                    setAuthModalOpen(true);
                  }}
                  className="hover:underline"
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalDefaultTab('user');
                    setAuthModalOpen(true);
                  }}
                  className="text-[#FF7A00] font-bold hover:underline"
                >
                  Create New Account
                </button>
              </div>

              {/* Other Login Options: User, Seller, Admin */}
              <div className="pt-3 border-t border-gray-100 mt-2">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1.5">Other Login Options</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalDefaultTab('user');
                      setAuthModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 flex flex-col items-center text-center transition cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-gray-600 mb-0.5" />
                    <span className="text-[10px] font-bold text-gray-800">User Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalDefaultTab('employee');
                      setAuthModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 flex flex-col items-center text-center transition cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
                    <span className="text-[10px] font-bold text-gray-800">Seller Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalDefaultTab('manager');
                      setAuthModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 flex flex-col items-center text-center transition cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 mb-0.5" />
                    <span className="text-[10px] font-bold text-gray-800">Admin Login</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // LOGGED IN USER CARD
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#FFB703] text-[#071A33] font-black flex items-center justify-center text-base border-2 border-orange-200 shrink-0">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] bg-orange-100 text-[#FF7A00] font-black px-2 py-0.5 rounded-full uppercase">
                    {currentUser.role === 'manager'
                      ? '👑 Store Admin'
                      : currentUser.role === 'employee'
                      ? '💼 Store Staff'
                      : '🛍️ Verified Customer'}
                  </span>
                  <p className="font-black text-gray-900 text-sm truncate mt-0.5">{currentUser.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{currentUser.emailOrId}</p>
                </div>
              </div>

              {/* Portal Actions */}
              <div className="space-y-2">
                {currentUser.role === 'manager' && (
                  <button
                    onClick={() => setCurrentView('manager-dashboard')}
                    className="w-full bg-[#071A33] hover:bg-[#0E284D] text-[#FFB703] font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#FFB703]" />
                    <span>Open Manager Portal</span>
                  </button>
                )}

                {currentUser.role === 'employee' && (
                  <button
                    onClick={() => setCurrentView('employee-dashboard')}
                    className="w-full bg-[#138808] hover:bg-[#107507] text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                  >
                    <Briefcase className="w-4 h-4 text-white" />
                    <span>Open Employee Portal</span>
                  </button>
                )}

                <button
                  onClick={() => setCurrentView('my-orders')}
                  className="w-full bg-orange-50 hover:bg-orange-100 text-[#FF7A00] font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer border border-orange-200"
                >
                  <ShoppingBag className="w-4 h-4 text-[#FF7A00]" />
                  <span>My Orders & Live Tracking</span>
                </button>

                <button
                  onClick={logout}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs py-2 px-3 rounded-lg transition cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Bottom Skyline Sketch Stamp: Made in India ♥ For India */}
          <div className="pt-3 border-t border-gray-100 mt-3 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 font-semibold">
              <span>Made in India</span>
              <span className="text-red-500">❤️</span>
              <span>For India</span>
              <span className="inline-block w-3 h-2 rounded-xs overflow-hidden ml-1 border border-gray-300">
                <span className="block h-1/3 bg-[#FF7A00]" />
                <span className="block h-1/3 bg-white" />
                <span className="block h-1/3 bg-[#138808]" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
