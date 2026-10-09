import React from 'react';
import { Tag, Edit3, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BannerActionType } from '../types';

export const PromoStripBanner: React.FC = () => {
  const {
    promoStrip,
    currentUser,
    setPromoEditorModalOpen,
    setSelectedCategory,
    setCartOpen,
    setCheckoutOpen,
    setContactModalOpen,
    setCurrentView,
    requireAuth,
  } = useApp();

  const isManager = currentUser?.role === 'manager';

  // If inactive and not manager, don't show
  if (!promoStrip?.active && !isManager) {
    return null;
  }

  const handleAction = (actionType: BannerActionType, actionValue?: string) => {
    switch (actionType) {
      case 'category':
        setSelectedCategory(actionValue || 'all');
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
        if (actionValue) {
          window.open(actionValue, '_blank', 'noopener,noreferrer');
        }
        break;
      default:
        setSelectedCategory('all');
        setCurrentView('shop');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 my-2 relative">
      <div
        className={`bg-gradient-to-r ${
          promoStrip?.bgGradient || 'from-amber-500 via-yellow-500 to-orange-500'
        } rounded-xl p-3 sm:p-4 text-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden transition-all`}
      >
        {!promoStrip?.active && isManager && (
          <div className="absolute top-1 left-2 bg-red-600/90 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
            Banner Inactive (Visible only to Manager)
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white text-orange-600 flex items-center justify-center font-black text-lg shadow-xs shrink-0">
            %
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base leading-tight">
              {promoStrip?.title || 'Special Store Offers & Discounts'}
            </h3>
            <p className="text-xs text-orange-950 font-medium">
              {promoStrip?.discountText || 'Get instant discount on your order using code'}{' '}
              {promoStrip?.couponCode && (
                <span className="font-mono font-bold bg-white/30 px-1 py-0.5 rounded">
                  {promoStrip.couponCode}
                </span>
              )}{' '}
              at checkout!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {promoStrip?.primaryButtonText && (
            <button
              onClick={() =>
                handleAction(
                  promoStrip.primaryButtonActionType,
                  promoStrip.primaryButtonActionValue
                )
              }
              className="bg-white text-orange-900 hover:bg-orange-50 font-black text-xs px-3.5 py-2 rounded-lg shadow-xs transition cursor-pointer"
            >
              {promoStrip.primaryButtonText}
            </button>
          )}

          {promoStrip?.secondaryButtonText && (
            <button
              onClick={() =>
                handleAction(
                  promoStrip.secondaryButtonActionType,
                  promoStrip.secondaryButtonActionValue
                )
              }
              className="bg-orange-900/30 hover:bg-orange-900/50 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition cursor-pointer"
            >
              {promoStrip.secondaryButtonText}
            </button>
          )}

          {isManager && (
            <button
              onClick={() => setPromoEditorModalOpen(true)}
              className="bg-black/40 hover:bg-black/60 text-[#FFB703] border border-[#FFB703]/40 px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ml-1"
              title="Manager: Edit Offer Strip details"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Offer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
