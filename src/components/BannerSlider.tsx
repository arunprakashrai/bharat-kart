import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  BookOpen,
  ShieldCheck,
  Edit3,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroSlide } from '../types';
import { INITIAL_HERO_SLIDES } from '../data/initialData';

export const BannerSlider: React.FC = () => {
  const {
    heroSlides,
    currentUser,
    setBannerEditorModalOpen,
    setEditingHeroSlide,
    setSelectedCategory,
    setCheckoutOpen,
    setCartOpen,
    setContactModalOpen,
    setCurrentView,
    requireAuth,
  } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter only active slides, with fallback to initial data if empty
  const activeSlides: HeroSlide[] = React.useMemo(() => {
    const filtered = (heroSlides || []).filter((s) => s.active);
    return filtered.length > 0 ? filtered : INITIAL_HERO_SLIDES;
  }, [heroSlides]);

  // Handle slide index bounds safety
  useEffect(() => {
    if (currentSlide >= activeSlides.length) {
      setCurrentSlide(0);
    }
  }, [activeSlides.length, currentSlide]);

  // Auto-play timer (6 seconds)
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const activeBanner = activeSlides[currentSlide] || activeSlides[0];
  const isManager = currentUser?.role === 'manager';

  const handleActionClick = (slide: HeroSlide) => {
    switch (slide.buttonActionType) {
      case 'category':
        setSelectedCategory(slide.buttonActionValue || 'all');
        setCurrentView('shop');
        break;
      case 'cart':
        if (!requireAuth({ type: 'open_cart' })) return;
        setCartOpen(true);
        break;
      case 'checkout':
        if (!requireAuth({ type: 'open_checkout' })) return;
        setCheckoutOpen(true);
        break;
      case 'contact':
        setContactModalOpen(true);
        break;
      case 'url':
        if (slide.buttonActionValue) {
          window.open(slide.buttonActionValue, '_blank', 'noopener,noreferrer');
        }
        break;
      default:
        setSelectedCategory('all');
        setCurrentView('shop');
    }
  };

  return (
    <div className="relative overflow-hidden bg-gray-900 text-white rounded-xl shadow-lg my-3 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Manager Direct Overlay Edit Trigger */}
      {isManager && (
        <button
          onClick={() => {
            setEditingHeroSlide(activeBanner);
            setBannerEditorModalOpen(true);
          }}
          className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/85 text-[#FFB703] border border-[#FFB703]/50 hover:border-[#FFB703] px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer group"
          title="Manager Control: Edit this banner slide directly"
        >
          <Edit3 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>Edit Banner (Manager)</span>
        </button>
      )}

      <div
        className={`bg-gradient-to-r ${activeBanner.bgGradient || 'from-[#071A33] via-[#0E284D] to-[#040E1B]'} p-6 sm:p-10 md:p-12 rounded-xl transition-all duration-700 relative overflow-hidden`}
      >
        {/* Optional Custom Background Image with overlay */}
        {activeBanner.bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: `url(${activeBanner.bgImage})` }}
          />
        )}

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Badge & Tag strip */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-xs flex items-center gap-1 ${
                activeBanner.badgeColor || 'bg-[#FFB703] text-[#071A33]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {activeBanner.badge}
            </span>

            {activeBanner.tag && (
              <span className="text-xs text-blue-100/90 font-medium hidden sm:inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFB703]" />
                {activeBanner.tag}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white mb-2 font-sans">
            {activeBanner.title}
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-200 mb-4 max-w-2xl leading-relaxed">
            {activeBanner.subtitle}
          </p>

          {/* Highlight pill */}
          {activeBanner.highlight && (
            <div className="bg-black/30 backdrop-blur-xs border border-white/10 rounded-lg p-2.5 max-w-xl mb-6">
              <p className="text-xs sm:text-sm text-[#FFB703] font-semibold flex items-center gap-2">
                {activeBanner.highlight}
              </p>
            </div>
          )}

          {/* Buttons CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleActionClick(activeBanner)}
              className="bg-[#FF7A00] hover:bg-[#E86F00] text-white font-black text-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition transform active:scale-95 cursor-pointer"
            >
              {activeBanner.buttonText} →
            </button>
            <button
              onClick={() => setContactModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-4 py-3 rounded-lg border border-white/20 transition backdrop-blur-xs cursor-pointer"
            >
              Need Help? Store Support
            </button>
          </div>
        </div>

        {/* Carousel Prev/Next controls */}
        {activeSlides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition border border-white/20 cursor-pointer z-10"
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition border border-white/20 cursor-pointer z-10"
              aria-label="Next banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? 'w-8 bg-[#FFB703]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
