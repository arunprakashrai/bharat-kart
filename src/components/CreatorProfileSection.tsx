import React from 'react';
import {
  Mail,
  Linkedin,
  Instagram,
  Sparkles,
  ShieldCheck,
  Edit3,
  ExternalLink,
  Code2,
  Heart,
  Camera,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CreatorProfileSection: React.FC = () => {
  const { currentUser, creatorProfile, setEditCreatorModalOpen } = useApp();

  const isManager = currentUser?.role === 'manager';

  // Format instagram link safely
  const instagramHandle = creatorProfile.instagram.replace(/^@/, '');
  const instagramUrl = `https://www.instagram.com/${instagramHandle}`;

  return (
    <div className="border-t border-white/10 bg-gradient-to-b from-[#040E1B] to-[#071A33] py-10 px-4 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#071A33] via-[#0E284D] to-[#0B213F] p-6 sm:p-8 md:p-10 border border-white/15 shadow-2xl">
          {/* Background decorative glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#FFB703]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#2874f0]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            {/* Creator Photo with Manager quick-edit overlay */}
            <div className="relative shrink-0 text-center">
              <div className="relative inline-block group">
                <img
                  src={creatorProfile.photoUrl}
                  alt={creatorProfile.name}
                  className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-3xl object-cover border-4 border-[#FFB703] shadow-xl ring-4 ring-[#FFB703]/20"
                />

                {/* Manager update icon overlay */}
                {isManager && (
                  <button
                    onClick={() => setEditCreatorModalOpen(true)}
                    className="absolute -bottom-2 -right-2 bg-[#FFB703] hover:bg-yellow-400 text-[#071A33] p-2.5 rounded-full shadow-lg border-2 border-[#071A33] transition transform hover:scale-110 cursor-pointer"
                    title="Store Manager: Update Photo & Details"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}

                {/* Verified Founder Badge */}
                <div className="absolute -top-2 -left-2 bg-emerald-600 text-white p-1 rounded-full border-2 border-[#071A33] shadow-md flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>

              {isManager && (
                <button
                  onClick={() => setEditCreatorModalOpen(true)}
                  className="mt-3 block mx-auto text-[11px] font-bold text-[#FFB703] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update Photo</span>
                </button>
              )}
            </div>

            {/* Creator Bio & Info */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="bg-[#FFB703] text-[#071A33] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#071A33]" />
                  Founder & Architect
                </span>
                <span className="bg-white/10 text-gray-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/10">
                  Arun Bookstores & Bharat Kart
                </span>

                {isManager && (
                  <button
                    onClick={() => setEditCreatorModalOpen(true)}
                    className="ml-auto hidden md:inline-flex items-center gap-1.5 bg-[#FFB703]/20 hover:bg-[#FFB703]/30 text-[#FFB703] border border-[#FFB703]/40 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Manager: Edit Creator Section</span>
                  </button>
                )}
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Created by {creatorProfile.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#FFB703] font-semibold mt-0.5">
                  {creatorProfile.title}
                </p>
              </div>

              {creatorProfile.bio && (
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
                  {creatorProfile.bio}
                </p>
              )}

              {/* Tappable Contact Links Strip (Email, LinkedIn, Insta) */}
              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5 flex items-center justify-center md:justify-start gap-1">
                  <span>Connect & Official Contacts:</span>
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
                  {/* EMAIL: Tap opens mailto */}
                  <a
                    href={`mailto:${creatorProfile.email}`}
                    className="inline-flex items-center gap-2 bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    title={`Send email to ${creatorProfile.email}`}
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>Email: {creatorProfile.email}</span>
                  </a>

                  {/* LINKEDIN: Tap opens LinkedIn in new tab */}
                  <a
                    href={creatorProfile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    title="Connect on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 shrink-0" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>

                  {/* INSTAGRAM: Tap opens Instagram in new tab */}
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    title="Follow on Instagram"
                  >
                    <Instagram className="w-4 h-4 shrink-0" />
                    <span>Insta: @{instagramHandle}</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
              </div>

              {/* Privilege note */}
              <div className="pt-2 text-[10px] text-gray-400 flex items-center justify-center md:justify-start gap-1.5 flex-wrap">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  Official Founder Information • Profile picture and contact channels are verified and managed exclusively by Store Manager.
                </span>
                {isManager && (
                  <button
                    onClick={() => setEditCreatorModalOpen(true)}
                    className="text-[#FFB703] underline font-bold ml-1 cursor-pointer"
                  >
                    Edit your creator profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
