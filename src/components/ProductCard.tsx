import React from 'react';
import { Star, Heart, ShoppingCart, Zap, CheckCircle2, Play } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    setSelectedProductForDetail,
    setCartOpen,
    setCheckoutOpen,
    requireAuth,
  } = useApp();

  const isWishlisted = wishlist.includes(product.id);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!requireAuth({ type: 'buy_now', product })) return;
    addToCart(product, 1);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!requireAuth({ type: 'add_to_cart', product, quantity: 1, openCart: true })) return;
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!requireAuth({ type: 'toggle_wishlist', productId: product.id })) return;
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => setSelectedProductForDetail(product)}
      className="group bg-white rounded-xl border border-gray-200 hover:border-[#FF7A00]/70 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
        {product.discount > 0 && (
          <span className="bg-[#138808] text-white text-[10px] font-black px-2 py-0.5 rounded-sm shadow-xs uppercase tracking-wider">
            {product.discount}% off
          </span>
        )}
        {product.category === 'books' && (
          <span className="bg-[#071A33] text-[#FFB703] text-[9px] font-bold px-1.5 py-0.5 rounded-xs shadow-xs border border-white/20">
            Arun Bookstores
          </span>
        )}
        {product.video && (
          <span className="bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs shadow-xs flex items-center gap-0.5">
            <Play className="w-2.5 h-2.5 fill-white text-white" />
            Video
          </span>
        )}
      </div>

      {/* Wishlist toggle button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-xs hover:bg-white text-gray-400 hover:text-red-500 shadow-sm transition cursor-pointer"
        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        />
      </button>

      {/* Product Image */}
      <div className="w-full h-44 sm:h-48 bg-gray-50/50 flex items-center justify-center p-3 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>

      {/* Details Container */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white border-t border-gray-100">
        <div>
          {/* Brand & Assured */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 truncate">
              {product.brand}
            </span>
            {product.assured && (
              <span className="flex items-center gap-0.5 text-[9px] text-[#071A33] font-bold bg-[#FFF9E6] border border-[#FFB703] px-1.5 py-0.5 rounded">
                <CheckCircle2 className="w-2.5 h-2.5 text-[#138808]" />
                Assured
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#FF7A00] transition-colors mb-1.5">
            {product.title}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-1 bg-[#138808] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-[#FFB703] text-[#FFB703]" />
            </div>
            <span className="text-[10px] text-gray-400">
              ({product.ratingCount.toLocaleString()})
            </span>
          </div>

          {/* Pricing Section */}
          <div className="flex items-baseline gap-2 flex-wrap mb-1">
            <span className="text-base sm:text-lg font-black text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-xs font-bold text-[#138808]">
                {product.discount}% off
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Add to Cart (Saffron) and Buy Now (Deep Navy + Gold) */}
        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-gray-100">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1 bg-[#FF7A00] hover:bg-[#E86F00] text-white text-xs font-bold py-2 px-2 rounded-lg shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-1 bg-[#071A33] hover:bg-[#0E284D] text-[#FFB703] text-xs font-bold py-2 px-2 rounded-lg shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#FFB703]" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
