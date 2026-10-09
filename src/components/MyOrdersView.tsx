import React, { useMemo } from 'react';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  MapPin,
  Truck,
  Search,
  ArrowRight,
  User,
} from 'lucide-react';
import { useApp, MY_ORDER_IDS_KEY } from '../context/AppContext';
import { MANAGER_CREDENTIALS } from '../data/initialData';

export const MyOrdersView: React.FC = () => {
  const {
    orders,
    currentUser,
    setCurrentView,
    showToast,
    setTrackOrderModalOpen,
    setTrackingOrderNumber,
    setAuthModalOpen,
    setAuthModalDefaultTab,
    requireAuth,
  } = useApp();

  // Read order IDs placed from this device/browser
  const localPlacedIds = useMemo(() => {
    try {
      const saved = localStorage.getItem(MY_ORDER_IDS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  // Filter orders strictly for the current logged-in identity or this browser session
  const displayOrders = useMemo(() => {
    if (!currentUser) {
      // Guest: ONLY show orders placed in this browser session
      return orders.filter((o) => localPlacedIds.includes(o.id));
    }

    if (currentUser.role === 'user') {
      // Customer: show orders linked to this account or placed in this browser
      return orders.filter(
        (o) =>
          (o.userId && o.userId === currentUser.id) ||
          (currentUser.emailOrId &&
            o.customerEmail.toLowerCase() === currentUser.emailOrId.toLowerCase()) ||
          localPlacedIds.includes(o.id)
      );
    }

    if (currentUser.role === 'manager') {
      // Store Manager: personal purchases ONLY
      // Customer orders are managed separately in the Manager Control Center
      return orders.filter(
        (o) =>
          o.userId === currentUser.id ||
          (o.customerEmail.toLowerCase() === currentUser.emailOrId.toLowerCase() &&
            o.customerName.toLowerCase().includes('arun'))
      );
    }

    if (currentUser.role === 'employee') {
      // Employee: personal purchases ONLY
      return orders.filter(
        (o) =>
          o.userId === currentUser.id ||
          (currentUser.emailOrId &&
            o.customerEmail.toLowerCase() === currentUser.emailOrId.toLowerCase())
      );
    }

    return [];
  }, [orders, currentUser, localPlacedIds]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Role Notice Banners when Manager or Employee visits My Orders */}
      {currentUser?.role === 'manager' && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-200 text-amber-900 rounded-lg shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                <span>👑 Store Manager View: Personal Purchases vs Customer Orders</span>
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                This page displays your personal shopping purchases ({displayOrders.length}).
                All store orders placed by users ({orders.length} total) are managed in the{' '}
                <strong>Manager Control Center</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('manager-dashboard')}
            className="bg-[#071A33] hover:bg-[#0E284D] text-[#FFB703] font-bold text-xs py-2 px-3.5 rounded-lg shadow-sm transition flex items-center gap-1.5 shrink-0 cursor-pointer border border-[#FFB703]/30"
          >
            <span>Manage User Orders ({orders.length}) →</span>
          </button>
        </div>
      )}

      {currentUser?.role === 'employee' && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-200 text-emerald-900 rounded-lg shrink-0">
              <Briefcase className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <span>💼 Staff Portal Notice: Personal Purchases vs User Orders</span>
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                This section shows your personal purchases ({displayOrders.length}).
                All customer orders placed by users ({orders.length} total) are available in the{' '}
                <strong>Employee Orders & Tracking Portal</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('employee-dashboard')}
            className="bg-[#138808] hover:bg-[#107507] text-white font-bold text-xs py-2 px-3.5 rounded-lg shadow-sm transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Open Employee Orders ({orders.length}) →</span>
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            {currentUser?.role === 'manager'
              ? `My Personal Purchases (${displayOrders.length})`
              : currentUser?.role === 'employee'
              ? `My Personal Purchases (${displayOrders.length})`
              : `My Orders (${displayOrders.length})`}
          </h1>
          <p className="text-xs text-gray-500">
            {currentUser?.role === 'manager' || currentUser?.role === 'employee'
              ? 'Personal orders placed by your account. Customer orders are managed in your staff portal.'
              : 'Track packages, review invoices, and view real-time delivery milestones'}
          </p>
        </div>

        <button
          onClick={() => setCurrentView('shop')}
          className="bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold text-xs px-4 py-2 rounded-lg transition cursor-pointer shadow-sm"
        >
          Continue Shopping
        </button>
      </div>

      {displayOrders.length === 0 ? (
        <div className="bg-white p-10 sm:p-14 rounded-2xl border border-gray-200 text-center text-gray-500 space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-orange-50 text-[#FF7A00] rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">
              {currentUser
                ? 'No personal orders found for this account'
                : 'No orders placed yet in this session'}
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto leading-relaxed">
              {currentUser
                ? "You haven't made any purchases with this account yet. Explore our top deals on Books, Mobiles, and Electronics!"
                : "You haven't placed an order yet in this session. If you already have an account, sign in to view your previous order history."}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            {!currentUser && (
              <button
                onClick={() => {
                  setAuthModalDefaultTab('user');
                  setAuthModalOpen(true);
                }}
                className="bg-[#071A33] hover:bg-[#0E284D] text-[#FFB703] font-bold text-xs py-2.5 px-5 rounded-lg transition shadow-sm cursor-pointer border border-[#FFB703]/30"
              >
                Sign In to View Past Orders
              </button>
            )}

            {currentUser?.role === 'manager' && (
              <button
                onClick={() => setCurrentView('manager-dashboard')}
                className="bg-[#071A33] hover:bg-[#0E284D] text-[#FFB703] font-bold text-xs py-2.5 px-5 rounded-lg transition shadow-sm cursor-pointer border border-[#FFB703]/30"
              >
                View Customer Store Orders ({orders.length}) →
              </button>
            )}

            {currentUser?.role === 'employee' && (
              <button
                onClick={() => setCurrentView('employee-dashboard')}
                className="bg-[#138808] hover:bg-[#107507] text-white font-bold text-xs py-2.5 px-5 rounded-lg transition shadow-sm cursor-pointer"
              >
                View Customer Orders Portal ({orders.length}) →
              </button>
            )}

            <button
              onClick={() => setCurrentView('shop')}
              className="bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold text-xs py-2.5 px-6 rounded-lg transition shadow-sm cursor-pointer"
            >
              Explore Deals
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-xs transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs sm:text-sm text-gray-900">
                    Order #{ord.orderNumber}
                  </span>
                  <span className="text-[11px] text-gray-400">•</span>
                  <span className="text-[11px] text-gray-500">
                    {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ord.paymentMethod === 'ONLINE_UPI'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {ord.paymentMethod === 'ONLINE_UPI' ? 'Paid via UPI' : 'Cash on Delivery'}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Status: {ord.orderStatus}
                  </span>
                </div>
              </div>

              {/* Items row */}
              <div className="divide-y divide-gray-100">
                {ord.items.map((it) => (
                  <div key={it.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={it.product.image}
                        alt={it.product.title}
                        className="w-12 h-12 object-contain bg-gray-50 p-1 rounded border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{it.product.title}</p>
                        <p className="text-[10px] text-gray-400 capitalize">{it.product.category}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900">
                        ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                      </p>
                      <span className="text-[10px] text-gray-500">Qty: {it.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 mt-2 text-xs">
                <div className="text-gray-600 space-y-1">
                  <div>
                    <span>Delivery Address: </span>
                    <span className="font-medium text-gray-800">
                      {ord.address.houseNo}, {ord.address.area}, {ord.address.city} ({ord.address.pincode})
                    </span>
                  </div>
                  {ord.address.location && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-700">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>Pinned Location: </span>
                      <a
                        href={
                          ord.address.location.mapUrl ||
                          `https://www.openstreetmap.org/?mlat=${ord.address.location.latitude}&mlon=${ord.address.location.longitude}#map=17/${ord.address.location.latitude}/${ord.address.location.longitude}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        <span>Lat {ord.address.location.latitude.toFixed(4)}, Lon {ord.address.location.longitude.toFixed(4)} (OpenStreetMap ↗)</span>
                      </a>
                    </div>
                  )}
                  {ord.lastUpdatedBy && (
                    <div className="text-[11px] text-gray-500 pt-0.5">
                      <span>Status updated by: </span>
                      <strong className="text-gray-800">{ord.lastUpdatedBy}</strong>
                      <span className="text-gray-400"> ({ord.lastUpdatedByRole === 'manager' ? 'Manager' : 'Staff'})</span>
                      {ord.currentLocation && <span> • Currently at {ord.currentLocation}</span>}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-right pr-2">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Total: </span>
                    <span className="text-base font-black text-gray-900">
                      ₹{ord.finalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!requireAuth({ type: 'open_track_order', orderNumber: ord.orderNumber })) return;
                      setTrackingOrderNumber(ord.orderNumber);
                      setTrackOrderModalOpen(true);
                    }}
                    className="bg-[#071A33] hover:bg-[#0E284D] active:scale-98 text-[#FFB703] px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer border border-[#FFB703]/30"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#FFB703]" />
                    <span>Track Order Live</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
