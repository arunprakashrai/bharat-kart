import React, { useState, useEffect } from 'react';
import {
  X,
  Truck,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  User,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  Package,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, TrackingEvent } from '../types';

export const TrackOrderModal: React.FC = () => {
  const {
    trackOrderModalOpen,
    setTrackOrderModalOpen,
    trackingOrderNumber,
    setTrackingOrderNumber,
    orders,
    showToast,
  } = useApp();

  const [inputQuery, setInputQuery] = useState(trackingOrderNumber || '');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedAWB, setCopiedAWB] = useState(false);

  // Sync with trackingOrderNumber or default to latest order
  useEffect(() => {
    if (trackingOrderNumber) {
      setInputQuery(trackingOrderNumber);
      const found = orders.find(
        (o) => o.orderNumber.toLowerCase() === trackingOrderNumber.trim().toLowerCase()
      );
      if (found) setSelectedOrder(found);
    } else if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0]);
      setInputQuery(orders[0].orderNumber);
    }
  }, [trackingOrderNumber, orders]);

  if (!trackOrderModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputQuery.trim().toLowerCase();
    if (!clean) return;

    const match = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === clean ||
        o.orderNumber.toLowerCase().includes(clean) ||
        o.customerPhone.toLowerCase().includes(clean) ||
        o.customerEmail.toLowerCase().includes(clean) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(clean))
    );

    if (match) {
      setSelectedOrder(match);
      showToast(`Found Order #${match.orderNumber}!`);
    } else {
      showToast('No matching order found. Please check your order ID or mobile number.', 'error');
    }
  };

  const handleCopyAWB = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedAWB(true);
    showToast(`Copied AWB Tracking Number: ${num}`);
    setTimeout(() => setCopiedAWB(false), 2000);
  };

  const STAGES: Array<Order['orderStatus']> = [
    'Placed',
    'Confirmed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const getStageIndex = (status: Order['orderStatus']) => {
    const idx = STAGES.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const currentStageIndex = selectedOrder ? getStageIndex(selectedOrder.orderStatus) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col relative my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#071A33] text-white p-4 sm:p-5 flex items-center justify-between shadow-xs border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow-inner">
              <Truck className="w-5 h-5 text-[#FFB703]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Track Your Order Live</h3>
                <span className="bg-[#138808] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  Real-time GPS & Audit Trail
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                Track status updates verified directly by Store Manager & Staff
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setTrackOrderModalOpen(false);
              setTrackingOrderNumber('');
            }}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Enter Order Number (e.g. BK-847291) or Phone..."
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Track</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Order Chips */}
          {orders.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] text-gray-400 shrink-0 font-medium">Recent Orders:</span>
              {orders.slice(0, 4).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setSelectedOrder(o);
                    setInputQuery(o.orderNumber);
                  }}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition shrink-0 cursor-pointer ${
                    selectedOrder?.id === o.id
                      ? 'bg-[#071A33] text-[#FFB703] border-[#071A33] font-bold'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  #{o.orderNumber} ({o.orderStatus})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-5">
          {selectedOrder ? (
            <>
              {/* STATUS PROGRESS BAR (5 STEPS) */}
              <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/70 to-blue-50/70 rounded-2xl p-4 sm:p-5 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                      Current Milestone
                    </span>
                    <h4 className="text-base font-black text-gray-900 flex items-center gap-2">
                      <span>{selectedOrder.orderStatus}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                        {currentStageIndex + 1} of 5
                      </span>
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block">Est. Delivery</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg inline-block">
                      {selectedOrder.estimatedDelivery || 'Within 2-3 business days'}
                    </span>
                  </div>
                </div>

                {/* Stepper bar */}
                <div className="relative pt-2 pb-1">
                  <div className="absolute top-5 left-4 right-4 h-1 bg-gray-200 -translate-y-1/2 z-0">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{
                        width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="relative z-10 flex justify-between">
                    {STAGES.map((st, idx) => {
                      const isCompleted = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      return (
                        <div key={st} className="flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                              isCurrent
                                ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110'
                                : isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] mt-1.5 font-bold text-center max-w-[65px] leading-tight ${
                              isCurrent
                                ? 'text-blue-700'
                                : isCompleted
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            }`}
                          >
                            {st}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* COURIER & AWB INFO CARD */}
              <div className="bg-white border border-gray-200 rounded-xl p-3.5 text-xs grid grid-cols-2 sm:grid-cols-3 gap-3 shadow-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Courier Partner</span>
                  <span className="font-bold text-gray-900">
                    {selectedOrder.courierName || 'BlueDart Express'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 block text-[10px]">AWB Tracking No.</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-blue-700">
                    <span>{selectedOrder.trackingNumber || 'BD-78923410'}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyAWB(selectedOrder.trackingNumber || 'BD-78923410')
                      }
                      className="text-gray-400 hover:text-blue-600 p-0.5"
                      title="Copy AWB number"
                    >
                      {copiedAWB ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 block text-[10px]">Current Location</span>
                  <span className="font-semibold text-gray-800 line-clamp-1">
                    {selectedOrder.currentLocation || `${selectedOrder.address.city} Hub`}
                  </span>
                </div>
              </div>

              {/* AUDIT TRAIL: UPDATES BY MANAGER & EMPLOYEE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Real-time Tracking Audit Trail</span>
                  </h4>
                  <span className="text-[10px] text-gray-500">
                    Updated by Manager / Staff
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0 ? (
                    selectedOrder.trackingHistory.map((tr, idx) => {
                      const isManager = tr.updatedByRole === 'manager';
                      const isEmployee = tr.updatedByRole === 'employee';
                      return (
                        <div
                          key={tr.id || idx}
                          className="bg-gray-50/80 hover:bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs transition"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-xs">
                                {tr.status}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                  isManager
                                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                    : isEmployee
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                    : 'bg-blue-100 text-blue-900'
                                }`}
                              >
                                {isManager ? '👑 Store Manager' : isEmployee ? '💼 Store Staff' : '👤 Customer'}
                                <span>: {tr.updatedBy}</span>
                              </span>
                            </div>

                            <span className="text-[10px] text-gray-400">
                              {new Date(tr.timestamp).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <p className="text-gray-700 text-xs leading-relaxed">
                            {tr.note || `Status milestone recorded as ${tr.status}.`}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-gray-500 pt-1 border-t border-gray-200/60">
                            {tr.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-rose-500" />
                                <span>{tr.location}</span>
                              </span>
                            )}
                            {tr.courierName && (
                              <span className="flex items-center gap-1">
                                <Truck className="w-3 h-3 text-blue-500" />
                                <span>{tr.courierName}</span>
                              </span>
                            )}
                            {tr.trackingNumber && (
                              <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                AWB: {tr.trackingNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600">
                      Order placed and queued for dispatch verification.
                    </div>
                  )}
                </div>
              </div>

              {/* DELIVERY ADDRESS & OPENSTREETMAP PIN */}
              <div className="bg-white border border-gray-200 rounded-xl p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>Delivery Address & Pinned Map Location</span>
                  </h4>
                  {selectedOrder.address.location && (
                    <a
                      href={
                        selectedOrder.address.location.mapUrl ||
                        `https://www.openstreetmap.org/?mlat=${selectedOrder.address.location.latitude}&mlon=${selectedOrder.address.location.longitude}#map=17/${selectedOrder.address.location.latitude}/${selectedOrder.address.location.longitude}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>View OpenStreetMap ↗</span>
                    </a>
                  )}
                </div>

                <p className="text-gray-700 leading-snug">
                  {selectedOrder.address.houseNo}, {selectedOrder.address.area},{' '}
                  {selectedOrder.address.city}, {selectedOrder.address.state} -{' '}
                  {selectedOrder.address.pincode}
                </p>

                {selectedOrder.address.location && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>GPS Pinned Coordinates:</span>
                      <span className="font-mono font-bold">
                        {selectedOrder.address.location.latitude.toFixed(5)},{' '}
                        {selectedOrder.address.location.longitude.toFixed(5)}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700">Verified Pin</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-10 space-y-3">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-700">No Order Selected</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Please enter a valid Order Number (e.g. BK-847291) or customer phone number in the search bar above to track real-time delivery status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
