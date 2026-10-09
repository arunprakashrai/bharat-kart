import React, { useState } from 'react';
import {
  X,
  Upload,
  Link,
  ShieldCheck,
  Check,
  Mail,
  Linkedin,
  Instagram,
  Sparkles,
  Camera,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EditCreatorProfileModal: React.FC = () => {
  const {
    currentUser,
    creatorProfile,
    updateCreatorProfile,
    editCreatorModalOpen,
    setEditCreatorModalOpen,
    showToast,
  } = useApp();

  const [name, setName] = useState(creatorProfile.name);
  const [title, setTitle] = useState(creatorProfile.title);
  const [email, setEmail] = useState(creatorProfile.email);
  const [linkedin, setLinkedin] = useState(creatorProfile.linkedin);
  const [instagram, setInstagram] = useState(creatorProfile.instagram);
  const [bio, setBio] = useState(creatorProfile.bio || '');
  const [photoUrl, setPhotoUrl] = useState(creatorProfile.photoUrl);
  const [photoInputMode, setPhotoInputMode] = useState<'upload' | 'url' | 'preset'>('upload');

  if (!editCreatorModalOpen) return null;

  // Preset professional founder avatars
  const PRESET_PHOTOS = [
    {
      label: 'Executive Navy Suit',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Formal Blazer & Glasses',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Smart Tech Entrepreneur',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Classic Professional',
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP)', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image size exceeds 8MB. Please select a smaller photo.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPhotoUrl(dataUrl);
        showToast('Photo uploaded successfully! Preview updated.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Permission Denied: Only Store Manager Arun Prakash can update this section.', 'error');
      return;
    }

    updateCreatorProfile({
      name: name.trim() || 'Arun Prakash',
      title: title.trim() || 'Founder & Creator',
      email: email.trim() || 'arunpakash123ihs@gmail.com',
      linkedin: linkedin.trim(),
      instagram: instagram.trim().replace(/^@/, ''),
      bio: bio.trim(),
      photoUrl: photoUrl.trim() || creatorProfile.photoUrl,
    });

    setEditCreatorModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col relative my-auto max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#071A33] text-white p-4 sm:p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-[#FFB703] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Manager: Edit Creator Profile</h3>
                <span className="bg-[#FFB703] text-[#071A33] text-[10px] font-black px-1.5 py-0.5 rounded">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Update "Created by Arun Prakash" portion, profile photo, and social contact links
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditCreatorModalOpen(false)}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          {/* Manager Auth Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs">Protected Founder Showcase</p>
              <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                This section on the bottom of the website is exclusively maintained by Store Manager <strong>Arun Prakash</strong>. Changes are immediately reflected to all site visitors.
              </p>
            </div>
          </div>

          {/* Photo Preview & Selector */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <label className="block text-xs font-bold text-gray-800">
              Founder Profile Photo:
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group shrink-0">
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-3 border-amber-400 shadow-md"
                />
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition pointer-events-none">
                  <Camera className="w-6 h-6" />
                </div>
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex gap-1.5 border-b border-gray-200 pb-2">
                  <button
                    type="button"
                    onClick={() => setPhotoInputMode('upload')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      photoInputMode === 'upload'
                        ? 'bg-[#071A33] text-white'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    Upload from Device
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoInputMode('url')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      photoInputMode === 'url'
                        ? 'bg-[#071A33] text-white'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    Image Web URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoInputMode('preset')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      photoInputMode === 'preset'
                        ? 'bg-[#071A33] text-white'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    Presets
                  </button>
                </div>

                {photoInputMode === 'upload' && (
                  <div className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-xl p-3 text-center bg-white transition">
                    <label className="cursor-pointer flex flex-col items-center gap-1">
                      <Upload className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-xs text-blue-700 hover:underline">
                        Select Photo (e.g. IMG_20251207_150918_656.webp)
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Supports WEBP, PNG, JPG (Instant local device upload)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                )}

                {photoInputMode === 'url' && (
                  <div>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://example.com/arun-prakash-photo.jpg"
                      className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Paste any direct public image link</p>
                  </div>
                )}

                {photoInputMode === 'preset' && (
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {PRESET_PHOTOS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoUrl(p.url)}
                        className={`rounded-lg overflow-hidden border-2 transition relative ${
                          photoUrl === p.url ? 'border-amber-500 ring-2 ring-amber-300' : 'border-gray-200'
                        }`}
                        title={p.label}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-12 object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Full Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Founder / Creator Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Arun Prakash"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Headline / Role *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Founder & Lead Developer • Store Manager"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Contact Details Requested by User */}
          <div className="space-y-3 pt-1">
            <h4 className="font-bold text-gray-800 text-xs border-b border-gray-100 pb-1">
              Contact & Social Channels:
            </h4>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Contact Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arunpakash123ihs@gmail.com"
                  className="w-full text-xs p-2.5 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Tapping on this button opens mail to this address</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                LinkedIn Profile URL *
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://www.linkedin.com/in/arun-prakash-8a9774385..."
                  className="w-full text-xs p-2.5 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
                />
                <Linkedin className="w-4 h-4 text-blue-600 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Instagram Handle / Username *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="arun.prakash.45"
                  className="w-full text-xs p-2.5 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <Instagram className="w-4 h-4 text-pink-500 absolute left-2.5 top-3" />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Will link to https://www.instagram.com/{instagram.replace(/^@/, '')}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Personal Bio / Statement (Optional)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Passionate software engineer and entrepreneur leading Bharat Kart..."
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setEditCreatorModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#071A33] hover:bg-[#0E284D] text-[#FFB703] font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-1.5 cursor-pointer border border-[#FFB703]/30"
            >
              <Check className="w-4 h-4" />
              <span>Save Creator Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
