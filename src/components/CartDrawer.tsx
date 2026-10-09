import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    currentUser,
    cart,
    cartOpen,
    setCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    cartMrpTotal,
    cartSavings,
    setCheckoutOpen,
    requireAuth,
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  if (!cartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'BHARAT100') {
      if (cartTotal < 500) {
        setCouponError('Minimum order of ₹500 required for BHARAT100');
        return;
      }
      setCouponDiscount(100);
      setCouponApplied(true);
    } else if (code === 'FESTIVE50') {
      setCouponDiscount(50);
      setCouponApplied(true);
    } else if (code === 'ARUNBOOKS') {
      const discount = Math.min(150, Math.round(cartTotal * 0.1));
      setCouponDiscount(discount);
      setCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code. Try BHARAT100 or FESTIVE50');
    }
  };

  const finalPayable = Math.max(0, cartTotal - (couponApplied ? couponDiscount : 0));

  const handleProceedToCheckout = () => {
    if (!requireAuth({ type: 'open_checkout' })) return;
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#071A33] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FFB703]" />
            <div>
              <h2 className="text-base font-bold leading-tight">
                {currentUser ? `${currentUser.name}'s Cart` : 'My Shopping Cart'} ({cart.length})
              </h2>
              {currentUser && (
                <p className="text-[10px] text-gray-300 capitalize">
                  {currentUser.role === 'manager'
                    ? '👑 Manager Private Cart'
                    : currentUser.role === 'employee'
                    ? '💼 Staff Private Cart'
                    : '🛍️ Personal Account'}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items list or empty state */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-4">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1">Your cart is empty!</h3>
              <p className="text-xs text-gray-500 mb-4">
                Explore our catalog for the best deals on Electronics, Books, Fashion & more.
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="bg-[#FF7A00] hover:bg-[#E86F00] text-white text-xs font-bold py-2.5 px-6 rounded-lg transition cursor-pointer"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <>
              {/* Delivery banner */}
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded-lg flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Free Fast Delivery</strong> unlocked on your entire order!
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg relative"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 object-contain bg-white p-1 rounded border border-gray-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-gray-800 truncate leading-snug">
                        {item.product.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mb-1">{item.product.brand}</p>

                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-sm font-bold text-gray-900">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </span>
                        {item.product.mrp > item.product.price && (
                          <span className="text-[11px] text-gray-400 line-through">
                            ₹{item.product.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-emerald-600">
                          {item.product.discount}% off
                        </span>
                      </div>

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-300 rounded bg-white">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 text-gray-600 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 text-gray-600 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon section */}
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter promo (e.g. BHARAT100)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full text-xs p-2 pl-7 uppercase border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Tag className="w-3.5 h-3.5 text-blue-600 absolute left-2 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#2874f0] hover:bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded transition"
                  >
                    Apply
                  </button>
                </form>

                {couponApplied && (
                  <p className="text-[11px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Coupon applied! You saved ₹{couponDiscount}.
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 font-medium mt-1.5">{couponError}</p>
                )}
              </div>

              {/* Bill Details */}
              <div className="border border-gray-200 rounded-lg p-3 text-xs space-y-2 bg-gray-50/50">
                <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px] border-b border-gray-200 pb-1.5">
                  Price Details
                </h4>
                <div className="flex justify-between text-gray-600">
                  <span>Price ({cart.length} items)</span>
                  <span>₹{cartMrpTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>- ₹{cartSavings.toLocaleString('en-IN')}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span>- ₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="border-t border-dashed border-gray-300 pt-2 flex justify-between font-bold text-sm text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{finalPayable.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-bold text-right">
                  You will save ₹{(cartSavings + (couponApplied ? couponDiscount : 0)).toLocaleString('en-IN')} on this order!
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-200 shadow-lg flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Total Payable</p>
              <p className="text-lg font-black text-gray-900">
                ₹{finalPayable.toLocaleString('en-IN')}
              </p>
            </div>
            <button
              onClick={handleProceedToCheckout}
              className="flex-1 bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
