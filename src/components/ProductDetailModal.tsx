import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  ShoppingCart,
  Zap,
  Heart,
  QrCode,
  Tag,
  Share2,
  Check,
  Play,
  Film,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  MessageSquarePlus,
  Send,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { MANAGER_CREDENTIALS } from '../data/initialData';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    setCartOpen,
    setCheckoutOpen,
    showToast,
    requireAuth,
    currentUser,
    reviews,
    addProductReview,
    getProductReviews,
    reviewModalProduct,
    setReviewModalProduct,
  } = useApp();
  const [selectedQty, setSelectedQty] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Auto-open review form if user attempted to write a review and just logged in
  useEffect(() => {
    if (reviewModalProduct && reviewModalProduct.id === product.id) {
      setShowReviewForm(true);
      setReviewModalProduct(null);
    }
  }, [reviewModalProduct, product.id, setReviewModalProduct]);

  // Combine primary image and additional multiple images
  const allImages = React.useMemo(() => {
    const list = [product.image];
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [product.image, product.images]);

  // Selected view: either a number index of allImages or 'video'
  const [activeMedia, setActiveMedia] = useState<number | 'video'>(0);

  const isWishlisted = wishlist.includes(product.id);
  const productReviews = getProductReviews(product.id);

  const handleAddToCart = () => {
    if (!requireAuth({ type: 'add_to_cart', product, quantity: selectedQty, openCart: true })) return;
    addToCart(product, selectedQty);
    setCartOpen(true);
  };

  const handleBuyNow = () => {
    if (!requireAuth({ type: 'buy_now', product, quantity: selectedQty })) return;
    addToCart(product, selectedQty);
    onClose();
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleWishlistToggle = () => {
    if (!requireAuth({ type: 'toggle_wishlist', productId: product.id })) return;
    toggleWishlist(product.id);
  };

  const handleWriteReviewClick = () => {
    if (!requireAuth({ type: 'write_review', product })) return;
    setShowReviewForm(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please write a short review or feedback comment.', 'error');
      return;
    }
    addProductReview({
      productId: product.id,
      rating: reviewRating,
      comment: reviewComment.trim(),
      userName: currentUser?.name || 'Customer',
    });
    setReviewComment('');
    setShowReviewForm(false);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    showToast('Product link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const nextImage = () => {
    if (activeMedia === 'video') {
      setActiveMedia(0);
    } else {
      setActiveMedia((prev) => (Number(prev) + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (activeMedia === 'video') {
      setActiveMedia(allImages.length - 1);
    } else {
      setActiveMedia((prev) => (Number(prev) - 1 + allImages.length) % allImages.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col my-auto border border-gray-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-4 sm:p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Media & Gallery Column */}
            <div className="md:col-span-5 flex flex-col items-center">
              {/* Main Media Viewer */}
              <div className="w-full h-72 sm:h-80 bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-center relative overflow-hidden group">
                {activeMedia === 'video' && product.video ? (
                  <div className="w-full h-full flex items-center justify-center bg-black rounded">
                    {product.video.includes('youtube.com') || product.video.includes('youtu.be') ? (
                      <iframe
                        src={product.video.replace('watch?v=', 'embed/')}
                        title="Product Video"
                        className="w-full h-full rounded"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={product.video}
                        controls
                        autoPlay
                        className="w-full h-full object-contain rounded"
                      >
                        Your browser does not support video playback.
                      </video>
                    )}
                  </div>
                ) : (
                  <img
                    src={allImages[typeof activeMedia === 'number' ? activeMedia : 0] || product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                )}

                {/* Left/Right carousel arrows if multiple images */}
                {allImages.length > 1 && activeMedia !== 'video' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow transition"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow transition"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md text-gray-400 hover:text-red-500 transition z-10 cursor-pointer"
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  />
                </button>
              </div>

              {/* Thumbnails Strip (Multiple Images & Video) */}
              <div className="w-full flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar justify-start sm:justify-center">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMedia(idx)}
                    className={`w-12 h-12 rounded-lg border-2 p-0.5 bg-white shrink-0 overflow-hidden transition ${
                      activeMedia === idx ? 'border-[#2874f0] ring-1 ring-blue-400' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    title={`Photo ${idx + 1}`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}

                {/* Video thumbnail button if product has video */}
                {product.video && (
                  <button
                    type="button"
                    onClick={() => setActiveMedia('video')}
                    className={`h-12 px-2.5 rounded-lg border-2 bg-slate-900 text-white shrink-0 flex items-center gap-1 transition ${
                      activeMedia === 'video'
                        ? 'border-yellow-400 ring-1 ring-yellow-400 text-yellow-300'
                        : 'border-gray-700 hover:border-gray-500 text-gray-200'
                    }`}
                    title="Watch Product Video"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[10px] font-bold">Video</span>
                  </button>
                )}
              </div>

              {/* Action Buttons under image */}
              <div className="grid grid-cols-2 gap-3 w-full mt-3">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold py-3 px-4 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 bg-[#071A33] hover:bg-[#0E284D] text-[#FFB703] font-bold py-3 px-4 rounded-xl shadow-md transition active:scale-95 border border-[#071A33] cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#FFB703]" />
                  <span>Buy Now</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 hover:text-blue-600 transition"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Share Product'}</span>
                </button>
                <span>•</span>
                <span className="text-emerald-700 font-medium">In Stock ({product.stock} units)</span>
              </div>
            </div>

            {/* Right Details Column */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                    {product.brand}
                  </span>
                  {product.category === 'books' && (
                    <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                      Arun Bookstores Official
                    </span>
                  )}
                  {product.assured && (
                    <span className="text-xs bg-[#FFF9E6] text-[#071A33] font-bold px-2 py-0.5 rounded border border-[#FFB703] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#138808]" />
                      BharatKart Assured
                    </span>
                  )}
                </div>

                <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-2">
                  {product.title}
                </h1>

                {/* Ratings */}
                <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-100 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-[#138808] text-white text-xs font-bold px-2 py-0.5 rounded">
                      <span>{product.rating}</span>
                      <Star className="w-3 h-3 fill-[#FFB703] text-[#FFB703]" />
                    </div>
                    <span className="text-xs text-gray-500">
                      {product.ratingCount.toLocaleString()} Ratings & Reviews
                    </span>
                    <span className="text-xs text-[#138808] font-medium hidden sm:inline">
                      • Verified Purchases
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleWriteReviewClick}
                    className="text-xs font-bold text-[#071A33] hover:text-[#FF7A00] bg-gray-100 hover:bg-orange-50 px-2.5 py-1.5 rounded-lg border border-gray-200 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5 text-[#FF7A00]" />
                    <span>Rate & Write Review</span>
                  </button>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-gray-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.mrp > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.mrp.toLocaleString('en-IN')}
                      </span>
                    )}
                    {product.discount > 0 && (
                      <span className="text-base font-bold text-[#138808]">
                        {product.discount}% off
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Inclusive of all taxes • Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Available Offers */}
                <div className="bg-[#EBF7EB] border border-[#138808]/40 rounded-lg p-3 mb-4 space-y-2">
                  <p className="text-xs font-bold text-[#138808] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#138808]" />
                    Available Bank & UPI Offers
                  </p>
                  <div className="text-xs text-emerald-800 space-y-1 pl-4">
                    <p className="flex items-start gap-1">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Instant UPI Discount:</strong> Pay via QR code to{' '}
                        <code className="bg-white px-1 py-0.5 rounded text-emerald-950 font-mono font-bold">
                          {MANAGER_CREDENTIALS.upiId}
                        </code>{' '}
                        for instant ₹50-₹100 cashback!
                      </span>
                    </p>
                    <p className="flex items-start gap-1">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Cash on Delivery:</strong> Available across 19,000+ Indian pincodes.
                      </span>
                    </p>
                    <p className="flex items-start gap-1">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Direct Email Dispatch:</strong> Instant order notification sent to store manager{' '}
                        <strong>{MANAGER_CREDENTIALS.email}</strong>.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-center mb-4">
                  <div className="flex flex-col items-center text-gray-600">
                    <Truck className="w-5 h-5 text-blue-600 mb-1" />
                    <span className="text-[11px] font-semibold text-gray-800">Free Fast Delivery</span>
                    <span className="text-[9px] text-gray-400">Within 24-48 hours</span>
                  </div>
                  <div className="flex flex-col items-center text-gray-600">
                    <RotateCcw className="w-5 h-5 text-emerald-600 mb-1" />
                    <span className="text-[11px] font-semibold text-gray-800">7 Days Return</span>
                    <span className="text-[9px] text-gray-400">Hassle-free replacement</span>
                  </div>
                  <div className="flex flex-col items-center text-gray-600">
                    <ShieldCheck className="w-5 h-5 text-amber-600 mb-1" />
                    <span className="text-[11px] font-semibold text-gray-800">100% Genuine</span>
                    <span className="text-[9px] text-gray-400">Quality Verified</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                    Product Description
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Specifications */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                      Specifications & Details
                    </h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                      {Object.entries(product.specifications).map(([key, val], idx) => (
                        <div
                          key={key}
                          className={`flex p-2 ${
                            idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                          } border-b border-gray-100 last:border-0`}
                        >
                          <span className="w-1/3 text-gray-500 font-medium">{key}</span>
                          <span className="w-2/3 text-gray-800 font-semibold">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews & Feedback Section */}
                <div className="mb-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Customer Reviews & Ratings</span>
                      <span className="text-gray-400 font-normal">({productReviews.length})</span>
                    </h4>

                    {!showReviewForm && (
                      <button
                        type="button"
                        onClick={handleWriteReviewClick}
                        className="text-[11px] font-bold text-[#FF7A00] hover:underline cursor-pointer"
                      >
                        + Write a Review
                      </button>
                    )}
                  </div>

                  {/* Inline Review Writing Form */}
                  {showReviewForm && (
                    <form
                      onSubmit={handleSubmitReview}
                      className="bg-orange-50/50 border border-orange-200 rounded-xl p-3 mb-3 text-xs animate-in fade-in space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">
                          Review as: {currentUser?.name || 'Customer'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="text-gray-400 hover:text-gray-600 font-bold"
                        >
                          ✕
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Your Rating:
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <button
                              key={starVal}
                              type="button"
                              onClick={() => setReviewRating(starVal)}
                              className="p-1 hover:scale-110 transition cursor-pointer"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  starVal <= reviewRating
                                    ? 'fill-[#FFB703] text-[#FFB703]'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 font-bold text-gray-700">{reviewRating} / 5 Stars</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Your Detailed Feedback:
                        </label>
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience with this item (quality, packaging, delivery)..."
                          rows={2}
                          className="w-full p-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Submit Verified Review</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Reviews List */}
                  {productReviews.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {productReviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="bg-gray-50/70 border border-gray-200/80 rounded-lg p-2.5 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900">{rev.userName}</span>
                              {rev.verifiedPurchase && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                                  ✓ Verified Buyer
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5 bg-[#138808] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              <span>{rev.rating}</span>
                              <Star className="w-2.5 h-2.5 fill-[#FFB703] text-[#FFB703]" />
                            </div>
                          </div>
                          <p className="text-gray-700 leading-snug">{rev.comment}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-3 text-center text-xs text-gray-500">
                      No reviews posted yet. Be the first customer to leave a review!
                    </div>
                  )}
                </div>

                {/* Added By / Seller info */}
                <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-200 flex justify-between items-center">
                  <span>
                    Fulfilled by: <strong>Arun Bookstores & Bharat Kart Logistics</strong>
                  </span>
                  <span>Support: arunprakashiit@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
