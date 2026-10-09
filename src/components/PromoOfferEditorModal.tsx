import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Tag, Sliders, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BannerActionType } from '../types';

const PROMO_GRADIENTS = [
  { label: 'Amber Gold Sunset', value: 'from-amber-500 via-yellow-500 to-orange-500' },
  { label: 'Emerald Green Festive', value: 'from-emerald-600 via-teal-600 to-green-700' },
  { label: 'Royal Blue Indigo', value: 'from-blue-600 via-indigo-600 to-purple-700' },
  { label: 'Crimson Rose Mega', value: 'from-rose-600 via-red-600 to-orange-600' },
  { label: 'Deep Bharat Navy', value: 'from-[#071A33] via-[#0E284D] to-[#040E1B]' },
];

export const PromoOfferEditorModal: React.FC = () => {
  const {
    currentUser,
    promoStrip,
    updatePromoStrip,
    promoEditorModalOpen,
    setPromoEditorModalOpen,
    categories,
    showToast,
  } = useApp();

  const [title, setTitle] = useState('');
  const [discountText, setDiscountText] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [primaryButtonText, setPrimaryButtonText] = useState('');
  const [primaryButtonActionType, setPrimaryButtonActionType] = useState<BannerActionType>('category');
  const [primaryButtonActionValue, setPrimaryButtonActionValue] = useState('books');
  const [secondaryButtonText, setSecondaryButtonText] = useState('');
  const [secondaryButtonActionType, setSecondaryButtonActionType] = useState<BannerActionType>('contact');
  const [secondaryButtonActionValue, setSecondaryButtonActionValue] = useState('');
  const [bgGradient, setBgGradient] = useState('from-amber-500 via-yellow-500 to-orange-500');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (promoStrip) {
      setTitle(promoStrip.title);
      setDiscountText(promoStrip.discountText);
      setCouponCode(promoStrip.couponCode);
      setPrimaryButtonText(promoStrip.primaryButtonText);
      setPrimaryButtonActionType(promoStrip.primaryButtonActionType);
      setPrimaryButtonActionValue(promoStrip.primaryButtonActionValue || 'books');
      setSecondaryButtonText(promoStrip.secondaryButtonText);
      setSecondaryButtonActionType(promoStrip.secondaryButtonActionType);
      setSecondaryButtonActionValue(promoStrip.secondaryButtonActionValue || '');
      setBgGradient(promoStrip.bgGradient || 'from-amber-500 via-yellow-500 to-orange-500');
      setActive(promoStrip.active);
    }
  }, [promoStrip, promoEditorModalOpen]);

  if (!promoEditorModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Permission Denied: Only Store Manager Arun Prakash can update promotional offers.', 'error');
      return;
    }

    if (!title.trim()) {
      showToast('Please enter an offer title.', 'error');
      return;
    }

    updatePromoStrip({
      title: title.trim(),
      discountText: discountText.trim(),
      couponCode: couponCode.trim().toUpperCase(),
      primaryButtonText: primaryButtonText.trim(),
      primaryButtonActionType,
      primaryButtonActionValue: primaryButtonActionValue.trim(),
      secondaryButtonText: secondaryButtonText.trim(),
      secondaryButtonActionType,
      secondaryButtonActionValue: secondaryButtonActionValue.trim(),
      bgGradient,
      active,
    });

    setPromoEditorModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col relative my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 bg-gradient-to-r from-amber-600 to-orange-600 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-orange-600 flex items-center justify-center font-black text-lg shadow-md">
              %
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Edit Promotional Offer Strip</h3>
                <span className="bg-white/20 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                  Manager Only
                </span>
              </div>
              <p className="text-xs text-orange-100">
                Special deal highlight bar shown beneath the hero carousel
              </p>
            </div>
          </div>
          <button
            onClick={() => setPromoEditorModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Live Preview */}
          <div>
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide mb-2">
              <Eye className="w-4 h-4 text-orange-600" />
              Live Visual Preview
            </span>

            <div
              className={`bg-gradient-to-r ${bgGradient} rounded-xl p-3 sm:p-4 text-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-orange-600 flex items-center justify-center font-black text-lg shadow-xs shrink-0">
                  %
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base leading-tight">
                    {title || 'Special Store Offers & Discounts'}
                  </h4>
                  <p className="text-xs text-orange-950 font-medium">
                    {discountText || 'Get extra discount using code'}{' '}
                    {couponCode && (
                      <span className="font-mono font-bold bg-white/30 px-1 py-0.5 rounded">
                        {couponCode.toUpperCase()}
                      </span>
                    )}{' '}
                    at checkout!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {primaryButtonText && (
                  <span className="bg-white text-orange-900 font-black text-xs px-3.5 py-2 rounded-lg shadow-xs">
                    {primaryButtonText}
                  </span>
                )}
                {secondaryButtonText && (
                  <span className="bg-orange-900/30 text-white font-semibold text-xs px-3.5 py-2 rounded-lg">
                    {secondaryButtonText}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Headline / Offer Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Arun Bookstores Academic Combos & Gadgets Special"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Discount Description Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Get extra ₹100 discount using code"
                  value={discountText}
                  onChange={(e) => setDiscountText(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. BHARAT100"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg font-mono font-bold uppercase tracking-wider"
                />
              </div>
            </div>

            {/* Primary Button */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
              <span className="text-xs font-bold text-gray-800 block">Primary Action Button</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={primaryButtonText}
                    onChange={(e) => setPrimaryButtonText(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Action Type</label>
                  <select
                    value={primaryButtonActionType}
                    onChange={(e) => setPrimaryButtonActionType(e.target.value as BannerActionType)}
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="category">Category Filter</option>
                    <option value="cart">View Cart</option>
                    <option value="checkout">Checkout</option>
                    <option value="contact">Helpline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Target Category / Value</label>
                  {primaryButtonActionType === 'category' ? (
                    <select
                      value={primaryButtonActionValue}
                      onChange={(e) => setPrimaryButtonActionValue(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={primaryButtonActionValue}
                      onChange={(e) => setPrimaryButtonActionValue(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Secondary Button */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
              <span className="text-xs font-bold text-gray-800 block">Secondary Action Button</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={secondaryButtonText}
                    onChange={(e) => setSecondaryButtonText(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Action Type</label>
                  <select
                    value={secondaryButtonActionType}
                    onChange={(e) => setSecondaryButtonActionType(e.target.value as BannerActionType)}
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="contact">Store Helpline</option>
                    <option value="category">Category Filter</option>
                    <option value="cart">Shopping Cart</option>
                    <option value="checkout">Checkout</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Target</label>
                  <input
                    type="text"
                    placeholder="Optional param"
                    value={secondaryButtonActionValue}
                    onChange={(e) => setSecondaryButtonActionValue(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Theme Gradient */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Strip Background Gradient
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PROMO_GRADIENTS.map((pg) => (
                  <button
                    key={pg.label}
                    type="button"
                    onClick={() => setBgGradient(pg.value)}
                    className={`p-2 rounded-lg border text-left text-xs transition flex items-center justify-between cursor-pointer ${
                      bgGradient === pg.value
                        ? 'border-orange-600 bg-orange-50 font-bold text-orange-950 ring-2 ring-orange-500/20'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-md bg-gradient-to-r ${pg.value}`} />
                      <span className="text-[11px] truncate">{pg.label}</span>
                    </div>
                    {bgGradient === pg.value && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Switch */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-gray-900 block">Offer Strip Active Status</span>
                <span className="text-[11px] text-gray-500">
                  Toggle whether the offer highlight bar is visible on the store front
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setPromoEditorModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Offer Strip</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
