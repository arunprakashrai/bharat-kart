import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Banknote,
  Smartphone,
  ExternalLink,
  MessageCircle,
  Mail,
  Copy,
  Check,
  ArrowRight,
  ShoppingBag,
  Clock,
  Sparkles,
  MapPin,
  Lock,
  Unlock,
  Pencil,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, Address, LocationCoordinates } from '../types';
import { MANAGER_CREDENTIALS } from '../data/initialData';
import { OrderLocationPicker } from './OrderLocationPicker';

const SAVED_ADDRESS_STORAGE_PREFIX = 'bharatkart_user_saved_address_';

export const getSavedAddressKey = (user: ReturnType<typeof useApp>['currentUser']): string => {
  if (!user) return `${SAVED_ADDRESS_STORAGE_PREFIX}guest`;
  const role = user.role || 'user';
  const id = (user.emailOrId || user.id || 'anonymous').toLowerCase().trim().replace(/[^a-z0-9@._-]/g, '_');
  return `${SAVED_ADDRESS_STORAGE_PREFIX}${role}_${id}`;
};

export const loadSavedAddress = (user: ReturnType<typeof useApp>['currentUser']): Address | null => {
  try {
    const key = getSavedAddressKey(user);
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {}
  return null;
};

export const persistSavedAddress = (user: ReturnType<typeof useApp>['currentUser'], addr: Address) => {
  try {
    const key = getSavedAddressKey(user);
    localStorage.setItem(key, JSON.stringify(addr));
  } catch {}
};

export const CheckoutModal: React.FC = () => {
  const {
    checkoutOpen,
    setCheckoutOpen,
    cart,
    cartTotal,
    cartMrpTotal,
    cartSavings,
    currentUser,
    createOrder,
    showToast,
    paymentSettings,
  } = useApp();

  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');

  // Customer Contact Fields - Start completely fresh with no pre-filled values
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Address fields - Clean and empty so user enters all their own details
  const [pincode, setPincode] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [landmark, setLandmark] = useState('');
  const [saveForFuture, setSaveForFuture] = useState(false);

  // Map Location state (OpenStreetMap) - undefined until user pins their location
  const [location, setLocation] = useState<LocationCoordinates | undefined>(undefined);

  // When checkout opens: ensure NOTHING is pre-filled beforehand.
  // Every user / individual is required to enter all their own details on their own!
  useEffect(() => {
    if (checkoutOpen) {
      setFullName('');
      setPhone('');
      setEmail('');
      setPincode('');
      setHouseNo('');
      setArea('');
      setCity('');
      setState('');
      setLandmark('');
      setLocation(undefined);
      setStep('address');
    }
  }, [checkoutOpen]);

  const savedAddressOnAccount = loadSavedAddress(currentUser);

  const handleApplySavedAddress = () => {
    if (savedAddressOnAccount) {
      setFullName(savedAddressOnAccount.fullName || '');
      setPhone(savedAddressOnAccount.phone || '');
      setEmail(currentUser?.emailOrId || '');
      setPincode(savedAddressOnAccount.pincode || '');
      setHouseNo(savedAddressOnAccount.houseNo || '');
      setArea(savedAddressOnAccount.area || '');
      setCity(savedAddressOnAccount.city || '');
      setState(savedAddressOnAccount.state || '');
      setLandmark(savedAddressOnAccount.landmark || '');
      if (savedAddressOnAccount.location) setLocation(savedAddressOnAccount.location);
      showToast('Loaded your previously saved address.', 'info');
    }
  };

  const handleClearForm = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setPincode('');
    setHouseNo('');
    setArea('');
    setCity('');
    setState('');
    setLandmark('');
    setLocation(undefined);
    showToast('All fields reset. Please enter your own details.', 'info');
  };

  // Payment method (auto-select active enabled option)
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE_UPI' | 'COD'>(() => {
    if (!paymentSettings.enableUpi && paymentSettings.enableCod) return 'COD';
    return 'ONLINE_UPI';
  });

  useEffect(() => {
    if (!paymentSettings.enableUpi && paymentSettings.enableCod) {
      setPaymentMethod('COD');
    } else if (!paymentSettings.enableCod && paymentSettings.enableUpi) {
      setPaymentMethod('ONLINE_UPI');
    }
  }, [paymentSettings.enableUpi, paymentSettings.enableCod]);

  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  // Placed order
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const targetManagerEmail = MANAGER_CREDENTIALS.email || 'arunbookstores123@gmail.com';
  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!checkoutOpen) return null;

  const totalAmount = cartTotal;
  const activeUpiId = paymentSettings?.upiId?.trim() || MANAGER_CREDENTIALS.upiId;
  const activePayeeName = paymentSettings?.payeeName?.trim() || 'Arun Prakash';
  const activeMerchantName = paymentSettings?.merchantName?.trim() || 'Bharat Kart Official';

  // Standard UPI URI format: upi://pay?pa={upiId}&pn={payeeName}&am={amount}&cu=INR&tn={transactionNote}
  const upiDeepLink = `upi://pay?pa=${activeUpiId}&pn=${encodeURIComponent(
    activePayeeName
  )}&am=${totalAmount}&cu=INR&tn=BharatKart_Order_${Date.now().toString().slice(-6)}`;

  // Dynamic vector QR Code URL from reliable qrserver service
  const dynamicQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    upiDeepLink
  )}&bgcolor=ffffff&color=111827&margin=1`;

  // Use custom uploaded QR image if manager configured one, or fallback to dynamic vector QR
  const activeQrCodeUrl = paymentSettings?.customQrImageUrl || dynamicQrCodeUrl;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(activeUpiId);
    setCopiedUpi(true);
    showToast(`Copied UPI ID: ${activeUpiId}`);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleLocationSelect = (
    loc: LocationCoordinates,
    details?: {
      city?: string;
      state?: string;
      pincode?: string;
      area?: string;
      houseNo?: string;
    }
  ) => {
    setLocation(loc);
    if (details) {
      if (details.city) setCity(details.city);
      if (details.state) setState(details.state);
      if (details.pincode) setPincode(details.pincode);
      if (details.area) setArea(details.area);
      if (details.houseNo && !houseNo.trim()) setHouseNo(details.houseNo);
    }
    showToast('📍 Delivery location pinned on map!');
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Please enter your full name!', 'error');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      showToast('Please enter a valid 10-digit mobile number!', 'error');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address!', 'error');
      return;
    }
    if (!pincode.trim() || pincode.trim().length < 6) {
      showToast('Please enter a valid 6-digit delivery pincode!', 'error');
      return;
    }
    if (!houseNo.trim()) {
      showToast('Please enter Flat / House No. and building details!', 'error');
      return;
    }
    if (!area.trim()) {
      showToast('Please enter Area, Street or Locality!', 'error');
      return;
    }
    if (!city.trim() || !state.trim()) {
      showToast('Please enter City and State!', 'error');
      return;
    }
    if (!location) {
      showToast('Please select your delivery location on the map before continuing!', 'error');
      return;
    }

    if (saveForFuture) {
      const currentAddress: Address = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        pincode: pincode.trim(),
        houseNo: houseNo.trim(),
        area: area.trim(),
        city: city.trim(),
        state: state.trim(),
        landmark: landmark.trim() || undefined,
        location,
      };
      persistSavedAddress(currentUser, currentAddress);
    }
    setStep('payment');
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2874f0', '#ffe500', '#fb641b', '#10b981'],
      });
    } catch {}
  };

  // Email Order Dispatch format
  const getRawEmailSubject = (order: Order) => {
    return `🛍️ New Bharat Kart Order #${order.orderNumber} - ₹${order.finalAmount.toLocaleString('en-IN')} - ${order.customerName}`;
  };

  const getRawEmailBody = (order: Order) => {
    const itemsText = order.items
      .map(
        (it, idx) =>
          `  ${idx + 1}. ${it.product.title.slice(0, 50)} x ${it.quantity} = ₹${(
            it.product.price * it.quantity
          ).toLocaleString('en-IN')}`
      )
      .join('\n');

    const mapLocationText = order.address.location
      ? `GPS Delivery Map Link (OpenStreetMap):\n${order.address.location.mapUrl || `https://www.openstreetmap.org/?mlat=${order.address.location.latitude}&mlon=${order.address.location.longitude}#map=17/${order.address.location.latitude}/${order.address.location.longitude}`}\n📍 Coordinates: Lat ${order.address.location.latitude}, Lon ${order.address.location.longitude}\n`
      : 'Map Location: Not specified\n';

    return (
      `Dear Store Manager (${targetManagerEmail}),\n\n` +
      `A new verified customer order has been placed on Bharat Kart!\n\n` +
      `==================================================\n` +
      `📦 ORDER SUMMARY\n` +
      `==================================================\n` +
      `Order ID: #${order.orderNumber}\n` +
      `Order Date: ${new Date(order.createdAt).toLocaleString('en-IN')}\n` +
      `Order Status: ${order.orderStatus}\n` +
      `Total Payable: ₹${order.finalAmount.toLocaleString('en-IN')}\n` +
      `Payment Method: ${order.paymentMethod === 'ONLINE_UPI' ? `Online UPI (Credited to ${activeUpiId})` : 'Cash on Delivery (COD)'}\n` +
      `Transaction Ref / UTR: ${order.transactionId || 'COD Verified'}\n\n` +
      `==================================================\n` +
      `👤 CUSTOMER CONTACT\n` +
      `==================================================\n` +
      `Customer Name: ${order.customerName}\n` +
      `Customer Phone: ${order.customerPhone || 'Not provided'}\n` +
      `Customer Email: ${order.customerEmail || 'Not provided'}\n\n` +
      `==================================================\n` +
      `📍 DELIVERY ADDRESS\n` +
      `==================================================\n` +
      `${order.address.houseNo}, ${order.address.area}\n` +
      `${order.address.city}, ${order.address.state} - ${order.address.pincode}\n` +
      (order.address.landmark ? `Landmark: ${order.address.landmark}\n` : '') +
      `\n` +
      mapLocationText +
      `\n` +
      `==================================================\n` +
      `🛒 ORDERED ITEMS (${order.items.length})\n` +
      `==================================================\n` +
      `${itemsText}\n\n` +
      `==================================================\n` +
      `Dispatched to Store Manager Email: ${targetManagerEmail}\n` +
      `Bharat Kart Order Fulfillment System\n`
    );
  };

  const getEmailMailtoUrl = (order: Order) => {
    const subject = getRawEmailSubject(order);
    const body = getRawEmailBody(order);
    return `mailto:${targetManagerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyEmailContent = (order: Order) => {
    const raw = getRawEmailBody(order);
    navigator.clipboard?.writeText(raw);
    setCopiedMsg(true);
    showToast('Order details copied to clipboard! You can paste into email or store records.');
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  const handleConfirmOrder = () => {
    const addressObj: Address = {
      fullName,
      phone,
      pincode,
      houseNo,
      area,
      city,
      state,
      landmark: landmark.trim() || undefined,
      location,
    };

    if (paymentMethod === 'ONLINE_UPI') {
      setIsVerifyingPayment(true);
      // Simulate quick secure gateway verification
      setTimeout(() => {
        setIsVerifyingPayment(false);
        const order = createOrder({
          customerName: fullName,
          customerPhone: phone,
          customerEmail: email,
          address: addressObj,
          paymentMethod: 'ONLINE_UPI',
          transactionId: utrNumber.trim() || 'UPI-' + Date.now().toString().slice(-8),
        });
        setPlacedOrder(order);
        setStep('success');
        triggerCelebration();
        showToast(`Order #${order.orderNumber} placed & notification sent to ${targetManagerEmail}!`);
      }, 1000);
    } else {
      // Cash on Delivery
      const order = createOrder({
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email,
        address: addressObj,
        paymentMethod: 'COD',
      });
      setPlacedOrder(order);
      setStep('success');
      triggerCelebration();
      showToast(`Order #${order.orderNumber} placed & notification sent to ${targetManagerEmail}!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#071A33] text-white p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black italic tracking-tight">BharatKart Checkout</span>
              <span className="bg-[#FFB703] text-[#071A33] text-[10px] font-black px-2 py-0.5 rounded">
                100% Secure
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5">
              {step === 'address' && 'Step 1 of 2: Shipping & Delivery Address'}
              {step === 'payment' && 'Step 2 of 2: Payment Option (UPI or COD)'}
              {step === 'success' && 'Order Successfully Placed!'}
            </p>
          </div>

          {step !== 'success' && (
            <button
              onClick={() => setCheckoutOpen(false)}
              className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1">
          {/* STEP 1: ADDRESS */}
          {step === 'address' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="bg-amber-50/90 border border-amber-200 rounded-lg p-3 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Self-Entry Required:</strong> Please enter all your own details below. Nothing is pre-filled before checkout.
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  {savedAddressOnAccount && (
                    <button
                      type="button"
                      onClick={handleApplySavedAddress}
                      className="text-xs text-blue-700 hover:text-blue-900 font-semibold px-2.5 py-1 rounded border border-blue-300 bg-white hover:bg-blue-50 transition cursor-pointer"
                    >
                      Use Saved Address
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2.5 py-1 rounded border border-rose-200 bg-white hover:bg-rose-50 transition cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Customer Account & Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mobile Number / Contact *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Delivery Pincode *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="6-digit pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium font-mono"
                  />
                </div>
              </div>

              {/* Delivery Address Details */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Flat, House No., Building, Apartment *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 101, Sunshine Apartments, Tower 3"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Area, Street, Sector, Village *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5th Cross, Koramangala 4th Block"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karnataka"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Metro Station Gate 2 / Opposite City Hospital"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* INTERACTIVE MAP LOCATION PICKER (OpenStreetMap) */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Pin Exact Delivery Location on Map *</span>
                  </label>
                  {location ? (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      ✓ Location Pinned
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                      Tap map or search to pin
                    </span>
                  )}
                </div>
                <OrderLocationPicker
                  currentLocation={location}
                  onLocationSelect={handleLocationSelect}
                  required={true}
                />
              </div>

              {/* Optional save address checkbox */}
              <div className="flex items-center gap-2 pt-1 text-xs text-gray-700">
                <input
                  type="checkbox"
                  id="saveAddressCheckbox"
                  checked={saveForFuture}
                  onChange={(e) => setSaveForFuture(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="saveAddressCheckbox" className="cursor-pointer select-none">
                  Save this address to my account for future orders
                </label>
              </div>

              {/* STORE ORDER PRICING & DISCOUNT BREAKDOWN (Strictly Non-Editable) */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/20 rounded-xl p-3.5 border border-gray-200 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-gray-200/80 pb-2">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-gray-900">Store Order Price Breakdown</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-emerald-700" />
                    Store-Verified Pricing
                  </span>
                </div>

                <div className="space-y-1.5 pt-1 text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Items Total MRP ({cart.reduce((s, i) => s + i.quantity, 0)} items):</span>
                    <span className="font-semibold text-gray-800 font-mono">₹{cartMrpTotal.toLocaleString('en-IN')}</span>
                  </div>
                  {cartSavings > 0 && (
                    <div className="flex justify-between items-center text-emerald-700">
                      <span>Bharat Kart Store Discount:</span>
                      <span className="font-bold font-mono">-₹{cartSavings.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Standard Express Delivery:</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-200 pt-2 text-sm">
                    <span className="font-bold text-gray-900">Total Payable Amount:</span>
                    <span className="font-black text-gray-900 font-mono text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 italic pt-0.5">
                  * Order pricing, quantities, and discount rates are calculated server-side and protected against client alteration.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold text-xs py-3 rounded-lg shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Payment Options</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT (ONLINE UPI QR or COD) */}
          {step === 'payment' && (
            <div className="space-y-4">
              {/* Confirmed Delivery Address (Locked for Confirmation) */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs flex items-start justify-between shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-800 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Delivering To (Locked & Confirmed):</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{fullName} • {phone} • {email}</p>
                  <p className="text-gray-600 text-[11px] leading-relaxed">
                    {houseNo}, {area}, {city}, {state} - {pincode}
                    {landmark ? ` (Landmark: ${landmark})` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="text-[#FF7A00] font-semibold text-xs hover:underline flex items-center gap-1 cursor-pointer shrink-0 mt-0.5 ml-2"
                >
                  <Unlock className="w-3 h-3" />
                  <span>Edit Address</span>
                </button>
              </div>

              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Choose Payment Method:
              </p>

              {/* Option 1: Online Pay via UPI */}
              {paymentSettings.enableUpi && (
                <div
                  onClick={() => setPaymentMethod('ONLINE_UPI')}
                  className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                    paymentMethod === 'ONLINE_UPI'
                      ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                        {paymentMethod === 'ONLINE_UPI' && (
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-blue-600" />
                          Online Pay (Scan QR / Auto-fill UPI)
                        </p>
                        <p className="text-xs text-gray-500">
                          GPay, PhonePe, Paytm, BHIM • Auto-fill cart amount ₹
                          {totalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Fastest
                    </span>
                  </div>

                  {/* Expanded UPI Details */}
                  {paymentMethod === 'ONLINE_UPI' && (
                    <div className="mt-4 pt-4 border-t border-blue-200/60">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        {/* Dynamic or Custom Standee QR Code */}
                        <div className="flex flex-col items-center bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
                          <div className="relative p-1 bg-white rounded-lg border-2 border-blue-500/40">
                            <img
                              src={activeQrCodeUrl}
                              alt="Bharat Kart UPI QR Code"
                              className="w-44 h-44 object-contain rounded"
                            />
                            {!paymentSettings.customQrImageUrl && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-9 h-9 rounded-full bg-white shadow-md border border-blue-500 flex items-center justify-center">
                                  <span className="text-[8px] font-black text-blue-700 italic">BK</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <p className="text-[11px] font-bold text-gray-700 mt-2 text-center font-mono">
                            Scan to Pay ₹{totalAmount.toLocaleString('en-IN')}
                          </p>
                          <span className="text-[9px] text-gray-500 font-medium">
                            Account: {activePayeeName}
                          </span>
                          {paymentSettings.customQrImageUrl && (
                            <span className="text-[9px] text-emerald-700 font-semibold mt-0.5">
                              ✓ Verified Store Standee QR
                            </span>
                          )}
                        </div>

                        {/* Deep Link & Auto-fill actions */}
                        <div className="space-y-3">
                          {/* Store Receiving UPI Account (Strictly Non-Editable) */}
                          <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-gray-700 font-bold flex items-center gap-1 text-[11px]">
                                <Lock className="w-3 h-3 text-blue-600" />
                                <span>Store Receiving Account (Verified)</span>
                              </p>
                              <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                                Manager Protected
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] text-gray-500 block mb-0.5">Receiving UPI ID:</span>
                              <div className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200 font-mono font-bold text-blue-900">
                                <span className="select-all text-xs">{activeUpiId}</span>
                                <button
                                  type="button"
                                  onClick={handleCopyUpi}
                                  className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 font-sans cursor-pointer font-semibold"
                                >
                                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-gray-100">
                              <div>
                                <span className="text-gray-500 block text-[10px]">Store Payee:</span>
                                <span className="font-semibold text-gray-800 block truncate">{activePayeeName}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block text-[10px]">Merchant Name:</span>
                                <span className="font-semibold text-gray-800 block truncate">{activeMerchantName}</span>
                              </div>
                            </div>

                            <p className="text-[10px] text-gray-400 italic">
                              * Store payment parameters are non-editable during checkout and managed solely by Store Manager Arun Prakash via Manager Portal.
                            </p>
                          </div>

                          {/* Direct Deep link for Mobile Phones */}
                          <a
                            href={upiDeepLink}
                            className="w-full flex items-center justify-center gap-2 bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs py-2.5 px-3 rounded-lg shadow-sm transition"
                          >
                            <Smartphone className="w-4 h-4" />
                            <span>Pay via UPI App (Auto-fills ₹{totalAmount})</span>
                          </a>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                              Customer Transaction Ref / UTR No. (Optional):
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 429381928391"
                              value={utrNumber}
                              onChange={(e) => setUtrNumber(e.target.value)}
                              className="w-full text-xs p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Option 2: Cash on Delivery */}
              {paymentSettings.enableCod && (
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                        {paymentMethod === 'COD' && (
                          <div className="w-2 h-2 rounded-full bg-emerald-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          Cash on Delivery (COD)
                        </p>
                        <p className="text-xs text-gray-500">
                          Pay cash or UPI to delivery agent at your doorstep
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded">
                      Doorstep Pay
                    </span>
                  </div>
                </div>
              )}

              {!paymentSettings.enableUpi && !paymentSettings.enableCod && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900">
                  Payment systems are currently being updated by Store Manager Arun Prakash. Please contact support or retry in a few moments.
                </div>
              )}

              {/* Price summary & Breakdown (Strictly Non-Editable) */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/20 p-3 rounded-lg border border-gray-200 text-xs space-y-1.5">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Cart Items ({cart.reduce((s, i) => s + i.quantity, 0)}) MRP Total:</span>
                  <span className="font-semibold text-gray-800 font-mono">₹{cartMrpTotal.toLocaleString('en-IN')}</span>
                </div>
                {cartSavings > 0 && (
                  <div className="flex justify-between items-center text-emerald-700">
                    <span>Store Discount Savings:</span>
                    <span className="font-bold font-mono">-₹{cartSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-600">
                  <span>Express Delivery Fee:</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-1.5 flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 font-semibold">Total Amount Payable: </span>
                    <span className="font-black text-gray-900 text-base font-mono">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-emerald-700" />
                    Verified Total
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                disabled={isVerifyingPayment}
                onClick={handleConfirmOrder}
                className={`w-full ${
                  paymentMethod === 'ONLINE_UPI'
                    ? 'bg-[#FF7A00] hover:bg-[#E86F00]'
                    : 'bg-[#138808] hover:bg-[#0F6E06]'
                } text-white font-bold text-sm py-3.5 rounded-lg shadow-lg transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer`}
              >
                {isVerifyingPayment ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment Verification...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'ONLINE_UPI'
                        ? `Verify & Place Order (₹${totalAmount.toLocaleString('en-IN')})`
                        : `Confirm Cash on Delivery Order`}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 3: ORDER SUCCESS */}
          {step === 'success' && placedOrder && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Order Confirmed
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                  Thank You, {placedOrder.customerName}!
                </h3>
                <p className="text-xs text-gray-500">
                  Your order has been recorded in Bharat Kart system.
                </p>
              </div>

              {/* Key Order Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Order Number:</span>
                  <span className="font-mono font-bold text-gray-900">
                    {placedOrder.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Mode:</span>
                  <span className="font-semibold text-gray-900">
                    {placedOrder.paymentMethod === 'ONLINE_UPI'
                      ? `Online UPI (${activeUpiId}) - PAID`
                      : 'Cash on Delivery (Pending)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Paid:</span>
                  <span className="font-bold text-gray-900 text-sm">
                    ₹{placedOrder.finalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-gray-500">Deliver To:</span>
                  <span className="font-medium text-gray-800 text-right max-w-[240px] truncate">
                    {placedOrder.address.houseNo}, {placedOrder.address.city} (
                    {placedOrder.address.pincode})
                  </span>
                </div>
                {placedOrder.address.location && (
                  <div className="flex justify-between border-t border-gray-200 pt-2 items-center text-xs">
                    <span className="text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      Map Location:
                    </span>
                    <a
                      href={
                        placedOrder.address.location.mapUrl ||
                        `https://www.openstreetmap.org/?mlat=${placedOrder.address.location.latitude}&mlon=${placedOrder.address.location.longitude}#map=17/${placedOrder.address.location.latitude}/${placedOrder.address.location.longitude}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>
                        Lat {placedOrder.address.location.latitude.toFixed(4)}, Lon{' '}
                        {placedOrder.address.location.longitude.toFixed(4)}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* EMAIL ACTION BUTTON & RELIABLE DISPATCH */}
              <div className="bg-orange-50/60 border-2 border-[#FF7A00] rounded-xl p-4 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#FF7A00]" />
                    <span>Email Order Dispatch to Manager</span>
                  </p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Sent to {targetManagerEmail}
                  </span>
                </div>

                <p className="text-[11px] text-gray-700 leading-relaxed">
                  All order details, customer contact, and exact OpenStreetMap GPS location link have been dispatched to
                  Store Manager Email (<strong>{targetManagerEmail}</strong>). You can also view or send directly from your email app:
                </p>

                {/* Primary Direct Mailto Link */}
                <a
                  href={getEmailMailtoUrl(placedOrder)}
                  className="w-full bg-[#FF7A00] hover:bg-[#E86F00] text-white font-black text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-98 text-center cursor-pointer"
                >
                  <Mail className="w-5 h-5 text-white" />
                  <span>Send / Open in Email Client ({targetManagerEmail})</span>
                </a>

                {/* Secondary options: Copy Email Content & Direct Mail link */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyEmailContent(placedOrder)}
                    className="bg-white border border-orange-200 hover:bg-orange-50 text-gray-900 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedMsg ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#FF7A00]" />}
                    <span>{copiedMsg ? 'Copied to Clipboard!' : 'Copy Email Receipt'}</span>
                  </button>

                  <a
                    href={`mailto:${targetManagerEmail}`}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                    <span>Open Mailbox</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-orange-200/80 text-[11px] flex items-center justify-between">
                  <span className="text-gray-600">Store Manager Inbox:</span>
                  <span className="font-mono font-bold text-gray-900">{targetManagerEmail}</span>
                </div>
              </div>

              {/* WHERE DOES YOUR ORDER GO BREAKDOWN */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2.5">
                <p className="font-bold text-[#071A33] flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#138808]" />
                  📍 Exactly Where Your Order Goes:
                </p>
                <div className="space-y-2 text-[11px] text-gray-700">
                  <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[#FF7A00] font-bold">1.</span>
                    <div>
                      <strong className="text-gray-900">Store Manager Email:</strong> Dispatched directly to{' '}
                      <span className="font-semibold text-blue-900">{targetManagerEmail}</span> with customer
                      details, exact map delivery coordinates, and ordered item breakdown.
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[#071A33] font-bold">2.</span>
                    <div>
                      <strong className="text-gray-900">Arun's Manager Portal:</strong> Recorded instantly
                      in the Manager Dashboard (<code className="text-blue-700 font-mono">arun.prakash.45</code>)
                      under <em>"Customer Orders"</em> for processing and fulfillment.
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-blue-100">
                    <span className="text-purple-600 font-bold">3.</span>
                    <div>
                      <strong className="text-gray-900">Payment Account:</strong>{' '}
                      {placedOrder.paymentMethod === 'ONLINE_UPI'
                        ? `Online payment credited to account UPI: ${activeUpiId}.`
                        : 'Cash on Delivery collected by delivery agent at your doorstep.'}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-blue-100">
                    <span className="text-amber-600 font-bold">4.</span>
                    <div>
                      <strong className="text-gray-900">Customer "My Orders" Tab:</strong> Available in
                      top navigation under your account to track delivery progress anytime.
                    </div>
                  </div>
                </div>
              </div>

              {/* Close / Continue button */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutOpen(false);
                    setStep('address');
                  }}
                  className="flex-1 bg-gray-900 hover:bg-black text-white text-xs font-bold py-3 rounded-lg transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
