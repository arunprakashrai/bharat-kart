import React, { useState } from 'react';
import {
  X,
  Camera,
  Upload,
  Check,
  Sparkles,
  ShieldCheck,
  Briefcase,
  User as UserIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileAvatarModal: React.FC = () => {
  const { currentUser, profileModalOpen, setProfileModalOpen, updateProfileAvatar, showToast } = useApp();

  const [previewAvatar, setPreviewAvatar] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');

  if (!profileModalOpen || !currentUser) return null;

  const currentAvatar = previewAvatar || currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80';

  // Curated presets for Manager / Employee / Customer
  const curatedAvatars = [
    {
      label: 'Executive (Suit)',
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    },
    {
      label: 'Formal Manager',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      label: 'Business Professional',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      label: 'Corporate Staff',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    {
      label: 'Smart Professional',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    {
      label: 'Store Representative',
      url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size exceeds 5MB limit. Please choose a smaller photo.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPreviewAvatar(dataUrl);
        setCustomUrl('');
        showToast('Photo uploaded from device! Click "Save Profile Picture" to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUrl = previewAvatar || customUrl.trim() || currentAvatar;
    if (!targetUrl) {
      showToast('Please select or upload a profile picture.', 'error');
      return;
    }

    updateProfileAvatar(targetUrl);
    setProfileModalOpen(false);
    setPreviewAvatar('');
    setCustomUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative my-auto">
        {/* Header */}
        <div className="bg-[#071A33] text-white p-5 relative border-b border-white/10">
          <button
            onClick={() => {
              setProfileModalOpen(false);
              setPreviewAvatar('');
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-black italic tracking-tight">
              Bharat<span className="text-[#FFB703]">Kart</span>
            </span>
            <span className="bg-[#FFB703] text-[#071A33] text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
              Profile
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
            <Camera className="w-5 h-5 text-[#FFB703]" />
            <span>Upload Profile Picture</span>
          </h2>
          <p className="text-xs text-white/70">
            {currentUser.role === 'manager'
              ? 'Manager Profile (Arun Prakash)'
              : currentUser.role === 'employee'
              ? `Employee Profile (${currentUser.name})`
              : `Customer Profile (${currentUser.name})`}
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleApply} className="p-5 space-y-4">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#FF7A00] shadow-lg bg-gray-100 flex items-center justify-center">
                <img
                  src={currentAvatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Camera icon badge */}
              <label className="absolute bottom-0 right-0 bg-[#FF7A00] hover:bg-[#E86F00] text-white p-2 rounded-full shadow-md cursor-pointer transition transform hover:scale-105">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            <h3 className="font-bold text-gray-900 mt-2 text-sm">{currentUser.name}</h3>
            <p className="text-xs text-gray-500 font-mono">{currentUser.emailOrId}</p>
            <span className="mt-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-orange-50 text-[#FF7A00] flex items-center gap-1">
              {currentUser.role === 'manager' ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-[#FF7A00]" />
                  Store Manager
                </>
              ) : currentUser.role === 'employee' ? (
                <>
                  <Briefcase className="w-3 h-3 text-emerald-600" />
                  Store Employee
                </>
              ) : (
                <>
                  <UserIcon className="w-3 h-3 text-blue-600" />
                  Registered Customer
                </>
              )}
            </span>
          </div>

          {/* Option 1: Upload from Device */}
          <div className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/50 rounded-xl p-3.5 text-center transition">
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="p-2 rounded-full bg-blue-100 text-blue-700">
                <Upload className="w-5 h-5" />
              </div>
              <label className="cursor-pointer font-bold text-xs text-blue-700 hover:text-blue-900 underline mt-1">
                <span>Upload Photo from Phone / Camera / Computer</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              <p className="text-[10px] text-gray-400">Supports JPG, PNG, WEBP (Instant preview)</p>
            </div>
          </div>

          {/* Option 2: Custom URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Or Enter Image / Photo URL:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/my-photo.jpg"
                value={customUrl}
                onChange={(e) => {
                  setCustomUrl(e.target.value);
                  if (e.target.value) setPreviewAvatar(e.target.value);
                }}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Option 3: Presets */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Or Choose Curated Professional Avatar:</span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {curatedAvatars.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setPreviewAvatar(preset.url);
                    setCustomUrl('');
                  }}
                  title={preset.label}
                  className={`w-11 h-11 rounded-full overflow-hidden border-2 p-0.5 transition ${
                    currentAvatar === preset.url
                      ? 'border-[#FF7A00] ring-2 ring-orange-300'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover rounded-full" />
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setProfileModalOpen(false);
                setPreviewAvatar('');
              }}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Profile Picture</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
