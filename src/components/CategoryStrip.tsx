import React from 'react';
import {
  Smartphone,
  Shirt,
  ShoppingBag,
  Home,
  BookOpen,
  Sparkles,
  Dumbbell,
  Gamepad2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CategoryStrip: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setCurrentView } = useApp();

  const categories = [
    {
      id: 'electronics',
      name: 'Electronics',
      sub: 'Mobiles, Laptops...',
      icon: <Smartphone className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      id: 'fashion',
      name: 'Fashion',
      sub: 'Men, Women, Kids...',
      icon: <Shirt className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50',
    },
    {
      id: 'grocery',
      name: 'Grocery',
      sub: 'Daily Needs...',
      icon: <ShoppingBag className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      id: 'home',
      name: 'Home & Living',
      sub: 'Furniture, Decor...',
      icon: <Home className="w-5 h-5 text-teal-600" />,
      bg: 'bg-teal-50',
    },
    {
      id: 'books',
      name: 'Books',
      sub: 'Books, Stationery...',
      icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
    },
    {
      id: 'beauty',
      name: 'Beauty & Health',
      sub: 'Skincare, Wellness...',
      icon: <Sparkles className="w-5 h-5 text-rose-500" />,
      bg: 'bg-rose-50',
    },
    {
      id: 'sports',
      name: 'Sports & Fitness',
      sub: 'Fitness, Outdoor...',
      icon: <Dumbbell className="w-5 h-5 text-cyan-600" />,
      bg: 'bg-cyan-50',
    },
    {
      id: 'toys',
      name: 'Toys & Games',
      sub: 'Kids, Games...',
      icon: <Gamepad2 className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(isSelected ? 'all' : cat.id);
                setCurrentView('shop');
                const el = document.getElementById('trending-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`bg-white rounded-xl border p-2.5 sm:p-3 text-center transition-all duration-200 flex flex-col items-center justify-center cursor-pointer shadow-2xs group hover:-translate-y-0.5 hover:shadow-sm ${
                isSelected
                  ? 'border-[#FF7A00] ring-2 ring-[#FF7A00]/20 bg-orange-50/20'
                  : 'border-gray-200 hover:border-orange-200'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full ${cat.bg} flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110`}
              >
                {cat.icon}
              </div>
              <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#FF7A00] transition-colors leading-tight line-clamp-1">
                {cat.name}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 leading-none">
                {cat.sub}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
