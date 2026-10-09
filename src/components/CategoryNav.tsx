import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Grid,
  BookOpen,
  Smartphone,
  Laptop,
  Shirt,
  Home,
  ShoppingBag,
  Plus,
  Tag,
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
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Grid: <Grid className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5 text-amber-600" />,
  Smartphone: <Smartphone className="w-5 h-5 text-blue-600" />,
  Laptop: <Laptop className="w-5 h-5 text-indigo-600" />,
  Shirt: <Shirt className="w-5 h-5 text-rose-500" />,
  Home: <Home className="w-5 h-5 text-emerald-600" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5 text-orange-500" />,
  Tag: <Tag className="w-5 h-5 text-purple-600" />,
  Sparkles: <Sparkles className="w-5 h-5 text-yellow-500" />,
  Watch: <Watch className="w-5 h-5 text-blue-500" />,
  Heart: <Heart className="w-5 h-5 text-rose-500" />,
  Coffee: <Coffee className="w-5 h-5 text-amber-700" />,
  Gift: <Gift className="w-5 h-5 text-red-500" />,
  Trophy: <Trophy className="w-5 h-5 text-yellow-600" />,
  Layers: <Layers className="w-5 h-5 text-teal-600" />,
  Camera: <Camera className="w-5 h-5 text-sky-600" />,
  Music: <Music className="w-5 h-5 text-indigo-500" />,
  Headphones: <Headphones className="w-5 h-5 text-violet-500" />,
  Compass: <Compass className="w-5 h-5 text-cyan-600" />,
  Flame: <Flame className="w-5 h-5 text-orange-600" />,
};

export const CategoryNav: React.FC = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    setCurrentView,
    currentUser,
    setAddCategoryModalOpen,
  } = useApp();

  const isManager = currentUser?.role === 'manager';

  return (
    <div className="bg-white border-b border-gray-200 shadow-xs relative z-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 overflow-x-auto whitespace-nowrap scrollbar-hide no-scrollbar py-2 sm:py-2.5">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-max justify-start md:justify-center">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentView('shop');
                }}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all group cursor-pointer shrink-0 select-none ${
                  isSelected
                    ? 'text-[#FF7A00] font-bold bg-orange-50 shadow-xs ring-1 ring-[#FF7A00]'
                    : 'text-gray-700 hover:text-[#FF7A00] hover:bg-gray-50'
                }`}
              >
                <div
                  className={`p-1.5 rounded-full transition-transform group-hover:scale-110 ${
                    isSelected ? 'bg-orange-100' : 'bg-gray-100 group-hover:bg-orange-50'
                  }`}
                >
                  {iconMap[cat.icon] || <Tag className="w-5 h-5 text-gray-600" />}
                </div>
                <div className="text-center leading-tight">
                  <span className="text-xs font-semibold block whitespace-nowrap">{cat.name}</span>
                  {cat.subText && (
                    <span className="text-[10px] text-gray-400 font-normal hidden sm:block whitespace-nowrap">
                      {cat.subText}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Quick Manager Add Category Action */}
          {isManager && (
            <button
              onClick={() => setAddCategoryModalOpen(true)}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-[#FFB703] bg-amber-50/60 hover:bg-amber-100 text-[#071A33] transition group cursor-pointer shrink-0 select-none"
              title="Manager Only: Add new store category"
            >
              <div className="p-1.5 rounded-full bg-[#FFB703] text-[#071A33] transition-transform group-hover:scale-110">
                <Plus className="w-5 h-5" />
              </div>
              <div className="text-center leading-tight">
                <span className="text-xs font-bold text-amber-900 block whitespace-nowrap">+ Add Category</span>
                <span className="text-[9px] text-amber-700 font-semibold hidden sm:block whitespace-nowrap">Manager Only</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
