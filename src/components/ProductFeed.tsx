import React, { useMemo } from 'react';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  Zap,
  Tag,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export const ProductFeed: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  } = useApp();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = p.title.toLowerCase().includes(q);
        const inBrand = p.brand.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inCat = p.category.toLowerCase().includes(q);
        if (!inTitle && !inBrand && !inDesc && !inCat) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => b.discount - a.discount);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [filteredProducts, sortBy]);

  const currentCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div id="trending-section" className="max-w-7xl mx-auto px-4 py-2 mb-8">
      {/* Header matching screenshot: Trending in Bharat with View All */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-xl font-black text-gray-900 flex items-center gap-1.5">
            <span className="text-orange-500 text-lg">🔥</span>
            <span>Trending in Bharat</span>
          </h2>
          <span className="text-[11px] bg-orange-100 text-[#FF7A00] font-bold px-2 py-0.5 rounded-full">
            {sortedProducts.length} Items
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-gray-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setSortBy('popular')}
              className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                sortBy === 'popular'
                  ? 'bg-white text-[#FF7A00] font-bold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setSortBy('price-low')}
              className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                sortBy === 'price-low'
                  ? 'bg-white text-[#FF7A00] font-bold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Price: Low
            </button>
            <button
              onClick={() => setSortBy('discount')}
              className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                sortBy === 'discount'
                  ? 'bg-white text-[#FF7A00] font-bold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Discount
            </button>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
            }}
            className="text-xs font-bold text-gray-600 hover:text-[#FF7A00] flex items-center gap-0.5 transition cursor-pointer"
          >
            <span>View All</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {searchQuery && (
        <div className="mb-3 text-xs text-gray-600 bg-white p-2.5 rounded-lg border border-gray-200 flex items-center justify-between">
          <span>
            Search results for: "<strong className="text-gray-900">{searchQuery}</strong>"
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#FF7A00] font-bold hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Products Grid - 6 columns on lg screen matching screenshot */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-500 space-y-3">
          <Search className="w-10 h-10 mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-gray-800">No products found!</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try resetting your search query or choosing another category from the top bar.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold px-4 py-2 rounded-lg transition cursor-pointer shadow-sm"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
