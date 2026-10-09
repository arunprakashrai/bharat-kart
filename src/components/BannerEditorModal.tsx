import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Zap,
  Tag,
  Sparkles,
  ShieldCheck,
  Sliders,
  Eye,
  Trash2,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BannerActionType, HeroSlide } from '../types';

const GRADIENT_PRESETS = [
  { label: 'Deep Navy Utsav', value: 'from-[#071A33] via-[#0E284D] to-[#040E1B]' },
  { label: 'Emerald Arun Books', value: 'from-[#071A33] via-[#103426] to-[#0F4A1C]' },
  { label: 'Amber Festive Sun', value: 'from-[#071A33] via-[#4A2406] to-[#7A3600]' },
  { label: 'Royal Indigo Gold', value: 'from-[#1A1040] via-[#2D1B69] to-[#0D0826]' },
  { label: 'Crimson Super Deal', value: 'from-[#380D15] via-[#5C1622] to-[#20070B]' },
  { label: 'Midnight Platinum', value: 'from-[#111827] via-[#1F2937] to-[#030712]' },
];

const BADGE_COLOR_PRESETS = [
  { label: 'Gold Badge', value: 'bg-[#FFB703] text-[#071A33]' },
  { label: 'Emerald Green', value: 'bg-[#138808] text-white' },
  { label: 'Vibrant Orange', value: 'bg-[#FF7A00] text-white' },
  { label: 'Indigo Purple', value: 'bg-indigo-600 text-white' },
  { label: 'Rose Pink', value: 'bg-rose-600 text-white' },
];

export const BannerEditorModal: React.FC = () => {
  const {
    currentUser,
    bannerEditorModalOpen,
    setBannerEditorModalOpen,
    editingHeroSlide,
    setEditingHeroSlide,
    addHeroSlide,
    updateHeroSlide,
    categories,
    showToast,
  } = useApp();

  // Form states
  const isEditing = Boolean(editingHeroSlide);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [highlight, setHighlight] = useState('');
  const [badge, setBadge] = useState('');
  const [badgeColor, setBadgeColor] = useState('bg-[#FFB703] text-[#071A33]');
  const [tag, setTag] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonActionType, setButtonActionType] = useState<BannerActionType>('category');
  const [buttonActionValue, setButtonActionValue] = useState('all');
  const [bgGradient, setBgGradient] = useState('from-[#071A33] via-[#0E284D] to-[#040E1B]');
  const [bgImage, setBgImage] = useState('');
  const [active, setActive] = useState(true);

  // Sync state when modal opens or editing slide changes
  useEffect(() => {
    if (editingHeroSlide) {
      setTitle(editingHeroSlide.title);
      setSubtitle(editingHeroSlide.subtitle);
      setHighlight(editingHeroSlide.highlight || '');
      setBadge(editingHeroSlide.badge);
      setBadgeColor(editingHeroSlide.badgeColor || 'bg-[#FFB703] text-[#071A33]');
      setTag(editingHeroSlide.tag || '');
      setButtonText(editingHeroSlide.buttonText);
      setButtonActionType(editingHeroSlide.buttonActionType);
      setButtonActionValue(editingHeroSlide.buttonActionValue || 'all');
      setBgGradient(editingHeroSlide.bgGradient);
      setBgImage(editingHeroSlide.bgImage || '');
      setActive(editingHeroSlide.active);
    } else {
      // New Slide defaults
      setTitle('Festive Mega Electronics Sale 2026');
      setSubtitle('Get up to 60% off on smartphones, laptops and accessories with fast door delivery.');
      setHighlight('⚡ Special ₹100 instant bonus on Instant UPI payments');
      setBadge('SPECIAL STORE OFFER');
      setBadgeColor('bg-[#FFB703] text-[#071A33]');
      setTag('100% Genuine Match Guarantee');
      setButtonText('Shop Electronics');
      setButtonActionType('category');
      setButtonActionValue('electronics');
      setBgGradient('from-[#071A33] via-[#0E284D] to-[#040E1B]');
      setBgImage('');
      setActive(true);
    }
  }, [editingHeroSlide, bannerEditorModalOpen]);

  if (!bannerEditorModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file too large! Please choose an image under 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setBgImage(dataUrl);
        showToast('Background image uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Permission Denied: Only Store Manager Arun Prakash can edit banners.', 'error');
      return;
    }

    if (!title.trim()) {
      showToast('Please enter a banner title.', 'error');
      return;
    }

    if (isEditing && editingHeroSlide) {
      updateHeroSlide(editingHeroSlide.id, {
        title: title.trim(),
        subtitle: subtitle.trim(),
        highlight: highlight.trim() || undefined,
        badge: badge.trim() || 'FEATURED',
        badgeColor,
        tag: tag.trim() || undefined,
        buttonText: buttonText.trim() || 'Explore Store',
        buttonActionType,
        buttonActionValue: buttonActionValue.trim(),
        bgGradient,
        bgImage: bgImage.trim() || undefined,
        active,
      });
    } else {
      addHeroSlide({
        title: title.trim(),
        subtitle: subtitle.trim(),
        highlight: highlight.trim() || undefined,
        badge: badge.trim() || 'FEATURED',
        badgeColor,
        tag: tag.trim() || undefined,
        buttonText: buttonText.trim() || 'Explore Store',
        buttonActionType,
        buttonActionValue: buttonActionValue.trim(),
        bgGradient,
        bgImage: bgImage.trim() || undefined,
        active,
      });
    }

    setBannerEditorModalOpen(false);
    setEditingHeroSlide(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col relative my-auto max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 bg-gradient-to-r from-[#071A33] to-[#0E284D] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFB703] text-[#071A33] flex items-center justify-center font-black shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {isEditing ? 'Edit Hero Banner Slide' : 'Add New Hero Banner Slide'}
                </h3>
                <span className="bg-[#FFB703] text-[#071A33] text-[9px] font-black uppercase px-2 py-0.5 rounded">
                  Manager Only
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Hero carousel advertisement shown directly below category navigation
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setBannerEditorModalOpen(false);
              setEditingHeroSlide(null);
            }}
            className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Real-time live visual preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                <Eye className="w-4 h-4 text-indigo-600" />
                Live Customer Preview
              </span>
              <span className="text-[10px] text-gray-500">
                Updates dynamically as you edit fields
              </span>
            </div>

            <div
              className={`rounded-xl bg-gradient-to-r ${bgGradient} p-5 sm:p-6 text-white shadow-md relative overflow-hidden transition-all`}
            >
              {bgImage && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none mix-blend-overlay"
                  style={{ backgroundImage: `url(${bgImage})` }}
                />
              )}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs flex items-center gap-1 ${badgeColor}`}
                  >
                    <Zap className="w-3 h-3" />
                    {badge || 'BADGE TEXT'}
                  </span>
                  {tag && (
                    <span className="text-[10px] text-blue-100/90 font-medium bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#FFB703]" />
                      {tag}
                    </span>
                  )}
                </div>

                <h4 className="text-lg sm:text-2xl font-black text-white leading-tight">
                  {title || 'Headline / Title'}
                </h4>
                <p className="text-xs sm:text-sm text-gray-200 line-clamp-2">
                  {subtitle || 'Subtitle description of product offerings, discount, or brand partnership.'}
                </p>

                {highlight && (
                  <div className="bg-black/30 backdrop-blur-xs border border-white/10 rounded-lg p-2 inline-block">
                    <p className="text-xs text-[#FFB703] font-semibold">{highlight}</p>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-2">
                  <span className="bg-[#FF7A00] text-white font-black text-xs px-4 py-2 rounded-lg shadow inline-block">
                    {buttonText || 'Button CTA'} →
                  </span>
                  <span className="text-[10px] text-gray-300 bg-white/10 px-2 py-1 rounded">
                    Action: {buttonActionType} {buttonActionValue ? `(${buttonActionValue})` : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Main Headline / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bharat Shopping Utsav 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Subtitle / Description
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Up to 70% Off on Top Electronics, Mobiles & Fashion Brands"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. MEGA FESTIVE DHAMAKA"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Trust Tag / Secondary Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100% Genuine Match Guarantee"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Special Highlight Strip (Yellow Bar)
              </label>
              <input
                type="text"
                placeholder="e.g. ⚡ Instant ₹100 Off on Instant UPI Payments • Free Fast Delivery"
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Button CTA Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shop Electronics Now"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Button Action
                </label>
                <select
                  value={buttonActionType}
                  onChange={(e) => setButtonActionType(e.target.value as BannerActionType)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="category">Open Category Filter</option>
                  <option value="cart">Open Shopping Cart</option>
                  <option value="checkout">Open Checkout</option>
                  <option value="contact">Open Store Support</option>
                  <option value="url">External Link URL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Action Value / Target
                </label>
                {buttonActionType === 'category' ? (
                  <select
                    value={buttonActionValue}
                    onChange={(e) => setButtonActionValue(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg bg-white"
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
                    placeholder={
                      buttonActionType === 'url' ? 'https://example.com' : 'Optional note'
                    }
                    value={buttonActionValue}
                    onChange={(e) => setButtonActionValue(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Gradient Background Presets */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Background Theme / Color Palette
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GRADIENT_PRESETS.map((gp) => (
                  <button
                    key={gp.label}
                    type="button"
                    onClick={() => setBgGradient(gp.value)}
                    className={`p-2 rounded-lg border text-left text-xs transition flex items-center justify-between cursor-pointer ${
                      bgGradient === gp.value
                        ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-md bg-gradient-to-r ${gp.value} shadow-xs`} />
                      <span className="text-[11px] truncate">{gp.label}</span>
                    </div>
                    {bgGradient === gp.value && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge Color Presets */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Badge Color Style
              </label>
              <div className="flex flex-wrap gap-2">
                {BADGE_COLOR_PRESETS.map((bp) => (
                  <button
                    key={bp.label}
                    type="button"
                    onClick={() => setBadgeColor(bp.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      badgeColor === bp.value ? 'ring-2 ring-black shadow-xs' : 'opacity-70 hover:opacity-100'
                    } ${bp.value}`}
                  >
                    <span>{bp.label}</span>
                    {badgeColor === bp.value && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Image (Optional) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                Custom Background Graphic / Photo (Optional)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-3 py-2 rounded-lg text-xs transition flex items-center gap-1.5 border border-gray-300">
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Upload Image File (Device)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                <div className="flex-1 w-full">
                  <input
                    type="url"
                    placeholder="Or paste image URL"
                    value={bgImage}
                    onChange={(e) => setBgImage(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {bgImage && (
                  <button
                    type="button"
                    onClick={() => setBgImage('')}
                    className="text-xs text-red-600 hover:underline cursor-pointer"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>

            {/* Active Toggle */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-gray-900 block">Banner Active Status</span>
                <span className="text-[11px] text-gray-500">
                  When active, this banner is displayed in the carousel to store visitors
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

          {/* Modal Footer */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setBannerEditorModalOpen(false);
                setEditingHeroSlide(null);
              }}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Slide'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
