import React, { useState, useEffect } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  User,
  ShieldCheck,
  Calendar,
  FileText,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, TrackingEvent } from '../types';

export const OrderStatusUpdateModal: React.FC = () => {
  const {
    orderToUpdateStatus,
    setOrderToUpdateStatus,
    currentUser,
    updateOrderStatusWithTracking,
    showToast,
  } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<Order['orderStatus']>('Placed');
  const [courierName, setCourierName] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  useEffect(() => {
    if (orderToUpdateStatus) {
      setSelectedStatus(orderToUpdateStatus.orderStatus);
      setCourierName(orderToUpdateStatus.courierName || 'BlueDart Express');
      setTrackingNumber(
        orderToUpdateStatus.trackingNumber ||
          'AWB-' + Math.floor(10000000 + Math.random() * 90000000)
      );
      setLocation(
        orderToUpdateStatus.currentLocation ||
          `${orderToUpdateStatus.address.city} Sorting & Logistics Hub`
      );
      setEstimatedDelivery(
        orderToUpdateStatus.estimatedDelivery || 'Within 2-3 business days'
      );
      setNote(
        `Order status updated to ${orderToUpdateStatus.orderStatus} by ${currentUser?.name || 'Staff'}.`
      );
    }
  }, [orderToUpdateStatus, currentUser]);

  if (!orderToUpdateStatus) return null;

  const updaterRole = currentUser?.role === 'manager' ? 'manager' : 'employee';
  const updaterName = currentUser?.name || (updaterRole === 'manager' ? 'Arun Prakash' : 'Priya Verma');
  const updaterDept =
    updaterRole === 'manager'
      ? 'Store Administration & Operations'
      : 'Order Processing & Logistics';

  const handleStatusChange = (status: Order['orderStatus']) => {
    setSelectedStatus(status);
    if (status === 'Confirmed') {
      setNote('Order verified and items packed securely in warehouse.');
      setLocation('Arun Bookstores Central Fulfillment Center, New Delhi');
    } else if (status === 'Shipped') {
      setNote(`Handed over to ${courierName} for express transit.`);
      setLocation('Main Air Cargo & Logistics Sorting Hub');
    } else if (status === 'Out for Delivery') {
      setNote('Package out with local delivery executive for doorstep delivery today.');
      setLocation(`${orderToUpdateStatus.address.city} Local Delivery Hub`);
    } else if (status === 'Delivered') {
      setNote('Package successfully delivered to customer doorstep.');
      setLocation(`${orderToUpdateStatus.address.houseNo}, ${orderToUpdateStatus.address.city}`);
    } else {
      setNote('Order received and waiting for processing.');
      setLocation('Central Processing Queue');
    }
  };

  const handleGenerateAWB = () => {
    const prefixes: Record<string, string> = {
      'BlueDart Express': 'BD',
      'Delhivery Surface Express': 'DLV',
      'Ekart Logistics': 'EKT',
      'DTDC Courier': 'DT',
      'India Post Speed Post': 'IP',
      'Bharat Direct Express': 'BK',
    };
    const prefix = prefixes[courierName] || 'AWB';
    const num = Math.floor(10000000 + Math.random() * 90000000);
    setTrackingNumber(`${prefix}-${num}`);
    showToast(`Generated new tracking AWB: ${prefix}-${num}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrderStatusWithTracking(orderToUpdateStatus.id, {
      status: selectedStatus,
      note: note.trim() || `Status updated to ${selectedStatus}.`,
      location: location.trim() || `${orderToUpdateStatus.address.city} Hub`,
      courierName: courierName.trim(),
      trackingNumber: trackingNumber.trim(),
      estimatedDelivery: estimatedDelivery.trim(),
      updaterName,
      updaterRole,
      updaterDept,
    });
    setOrderToUpdateStatus(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col relative my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#071A33] text-white p-4 sm:p-5 flex items-center justify-between shadow-xs border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#FFB703]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Update Order Status & Tracking</h3>
                <span className="bg-[#FFB703] text-[#071A33] font-mono text-[11px] font-black px-2 py-0.5 rounded shadow-xs">
                  #{orderToUpdateStatus.orderNumber}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                Staff fulfillment portal • Changes are instantly visible to the customer
              </p>
            </div>
          </div>

          <button
            onClick={() => setOrderToUpdateStatus(null)}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-4">
          {/* Staff identity banner */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {updaterName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-blue-950">
                  Updating as: {updaterName}
                </p>
                <p className="text-[11px] text-blue-800">
                  Role: <span className="capitalize font-semibold">{updaterRole}</span> • Dept: {updaterDept}
                </p>
              </div>
            </div>
            <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded text-[11px]">
              {updaterRole === 'manager' ? '👑 Manager Admin' : '💼 Employee Portal'}
            </span>
          </div>

          {/* Customer & Order Summary Snippet */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>
              <span className="text-gray-400 block text-[10px]">Customer Name</span>
              <span className="font-bold text-gray-900">{orderToUpdateStatus.customerName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Contact</span>
              <span className="font-semibold text-gray-800">{orderToUpdateStatus.customerPhone || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Total Amount</span>
              <span className="font-black text-gray-900">₹{orderToUpdateStatus.finalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="col-span-2 sm:col-span-3 border-t border-gray-200 pt-1.5 text-gray-600 flex items-center justify-between">
              <span>
                Delivery Address: {orderToUpdateStatus.address.houseNo}, {orderToUpdateStatus.address.city}
              </span>
              {orderToUpdateStatus.address.location && (
                <a
                  href={orderToUpdateStatus.address.location.mapUrl || `https://www.openstreetmap.org/?mlat=${orderToUpdateStatus.address.location.latitude}&mlon=${orderToUpdateStatus.address.location.longitude}#map=17/${orderToUpdateStatus.address.location.latitude}/${orderToUpdateStatus.address.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2"
                >
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>OSM Pin ↗</span>
                </a>
              )}
            </div>
          </div>

          {/* STATUS SELECTOR (5 STAGES) */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">
              Select New Order Milestone Status *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(
                [
                  { id: 'Placed', label: '1. Placed', color: 'border-amber-400 bg-amber-50 text-amber-900' },
                  { id: 'Confirmed', label: '2. Confirmed', color: 'border-blue-400 bg-blue-50 text-blue-900' },
                  { id: 'Shipped', label: '3. Shipped', color: 'border-purple-400 bg-purple-50 text-purple-900' },
                  { id: 'Out for Delivery', label: '4. Out for Delivery', color: 'border-orange-400 bg-orange-50 text-orange-900' },
                  { id: 'Delivered', label: '5. Delivered', color: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
                ] as const
              ).map((st) => {
                const isActive = selectedStatus === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleStatusChange(st.id)}
                    className={`p-2.5 rounded-xl border-2 text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center ${
                      isActive
                        ? `${st.color} shadow-sm ring-2 ring-blue-500 ring-offset-1`
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span>{st.label}</span>
                    {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LOGISTICS & COURIER DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Courier / Delivery Partner
              </label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="BlueDart Express">BlueDart Express (Air Cargo)</option>
                <option value="Delhivery Surface Express">Delhivery Surface Express</option>
                <option value="Ekart Logistics">Ekart Logistics (Flipkart Network)</option>
                <option value="DTDC Courier">DTDC Express Courier</option>
                <option value="India Post Speed Post">India Post Speed Post</option>
                <option value="Bharat Direct Express">Bharat Direct Express (Same Day)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700">
                  AWB / Tracking Number
                </label>
                <button
                  type="button"
                  onClick={handleGenerateAWB}
                  className="text-[10px] text-blue-600 hover:underline font-semibold"
                >
                  Generate New AWB
                </button>
              </div>
              <input
                type="text"
                required
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. BD-78923410"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
              />
            </div>
          </div>

          {/* CHECKPOINT LOCATION & ESTIMATED DELIVERY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Current Hub / Checkpoint Location *
              </label>
              <div className="relative">
                <Navigation className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Delhi Central Sorting Hub, Okhla"
                  className="w-full text-xs pl-8 pr-2.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Estimated Delivery Timeline
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  placeholder="e.g. Tomorrow by 6:00 PM or 09 Oct 2026"
                  className="w-full text-xs pl-8 pr-2.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* MILESTONE NOTE / MESSAGE TO CUSTOMER */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tracking Milestone Note (Visible to Customer)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Package inspected, verified by department, and dispatched with tamper-proof bag."
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PREVIOUS TRACKING HISTORY TRAIL AUDIT */}
          {orderToUpdateStatus.trackingHistory && orderToUpdateStatus.trackingHistory.length > 0 && (
            <div className="pt-2 border-t border-gray-200">
              <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Existing Tracking History ({orderToUpdateStatus.trackingHistory.length} Milestones)</span>
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {orderToUpdateStatus.trackingHistory.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-[11px] flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900">{tr.status}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-blue-700 font-medium">
                          {tr.updatedBy} ({tr.updatedByRole})
                        </span>
                      </div>
                      <p className="text-gray-600 text-[10px] mt-0.5">{tr.note}</p>
                      {tr.location && (
                        <p className="text-gray-400 text-[10px] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-gray-400" />
                          <span>{tr.location}</span>
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {new Date(tr.timestamp).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-2">
            <button
              type="submit"
              className="w-full bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Publish Live Tracking Update</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
