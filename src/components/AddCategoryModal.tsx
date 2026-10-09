import React, { useState } from 'react';
import {
  X,
  Plus,
  Check,
  Tag,
  Grid,
  BookOpen,
  Smartphone,
  Laptop,
  Shirt,
  Home,
  ShoppingBag,
  Sparkles,
  Watch,
  Heart,
  Coffee,
  Gift,
  Trophy,
  Layers,
  Camera,
  Music,
  Headphones,
  Compass,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AVAILABLE_ICONS = [
  { name: 'Tag', component: Tag, label: 'Tag / General' },
  { name: 'BookOpen', component: BookOpen, label: 'Books' },
  { name: 'Smartphone', component: Smartphone, label: 'Mobiles' },
  { name: 'Laptop', component: Laptop, label: 'Electronics' },
  { name: 'Shirt', component: Shirt, label: 'Fashion' },
  { name: 'Home', component: Home, label: 'Home' },
  { name: 'ShoppingBag', component: ShoppingBag, label: 'Shopping' },
  { name: 'Sparkles', component: Sparkles, label: 'Specials' },
  { name: 'Watch', component: Watch, label: 'Accessories' },
  { name: 'Heart', component: Heart, label: 'Beauty & Health' },
  { name: 'Coffee', component: Coffee, label: 'Food & Pantry' },
  { name: 'Gift', component: Gift, label: 'Gifts & Toys' },
  { name: 'Trophy', component: Trophy, label: 'Sports & Fitness' },
  { name: 'Layers', component: Layers, label: 'Essentials' },
  { name: 'Camera', component: Camera, label: 'Photography' },
  { name: 'Music', component: Music, label: 'Musical' },
  { name: 'Headphones', component: Headphones, label: 'Audio' },
  { name: 'Compass', component: Compass, label: 'Travel & Outdoor' },
  { name: 'Flame', component: Flame, label: 'Trending Deals' },
];

export const AddCategoryModal: React.FC = () => {
  const {
    currentUser,
    addCategoryModalOpen,
    setAddCategoryModalOpen,
    addCategory,
    showToast,
  } = useApp();

  const [name, setName] = useState('');
  const [nameHindi, setNameHindi] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Tag');
  const [description, setDescription] = useState('');

  if (!addCategoryModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Permission Denied: Only Store Manager Arun Prakash can add categories.', 'error');
      return;
    }

    if (!name.trim()) {
      showToast('Please enter category name.', 'error');
      return;
    }

    const res = addCategory({
      name: name.trim(),
      nameHindi: nameHindi.trim() || name.trim(),
      icon: selectedIcon,
      description: description.trim(),
    });

    if (res.success) {
      setName('');
      setNameHindi('');
      setSelectedIcon('Tag');
      setDescription('');
      setAddCategoryModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 flex flex-col relative my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#071A33] text-white p-4 sm:p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Manager: Add Store Category</h3>
                <span className="bg-[#FFB703] text-[#071A33] text-[10px] font-black px-1.5 py-0.5 rounded">
                  Manager Right
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Expand store catalog with new taxonomy & browsing ribbon
              </p>
            </div>
          </div>

          <button
            onClick={() => setAddCategoryModalOpen(false)}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          {/* Privilege notice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2 text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              As Store Manager (Arun Prakash), categories added here appear immediately on the top category ribbon, shopping filter bar, and product addition forms.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Category Name (English) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sports & Fitness, Beauty & Care, Watches"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Hindi / Regional Subtitle (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. खेल व फिटनेस, सौंदर्य व व्यक्तिगत देखभाल"
              value={nameHindi}
              onChange={(e) => setNameHindi(e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[10px] text-gray-400 mt-0.5">Shown beneath category title in navigation ribbon</p>
          </div>

          {/* Icon Selector Grid */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Select Category Icon:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50/50">
              {AVAILABLE_ICONS.map((item) => {
                const IconComponent = item.component;
                const isSelected = selectedIcon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedIcon(item.name)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition border cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-[9px] font-medium truncate w-full text-center">
                      {item.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of products in this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setAddCategoryModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#138808] hover:bg-[#107507] text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Add Category Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
