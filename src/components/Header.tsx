import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  LogOut,
  Package,
  Layers,
  Sparkles,
  ChevronDown,
  X,
  MessageCircle,
  HelpCircle,
  Camera,
  Truck,
  ShoppingBag,
  Menu,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MANAGER_CREDENTIALS } from '../data/initialData';

export const Header: React.FC = () => {
  const {
    currentUser,
    logout,
    cart,
    orders,
    setCartOpen,
    wishlist,
    searchQuery,
    setSearchQuery,
    setAuthModalOpen,
    setAuthModalDefaultTab,
    setContactModalOpen,
    setProfileModalOpen,
    setTrackOrderModalOpen,
    currentView,
    setCurrentView,
    showToast,
    requireAuth,
  } = useApp();

  const [pincode, setPincode] = useState('110001');
  const [showPincodePrompt, setShowPincodePrompt] = useState(false);
  const [newPincodeInput, setNewPincodeInput] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPincodeInput.trim().length === 6) {
      setPincode(newPincodeInput.trim());
      setShowPincodePrompt(false);
      setNewPincodeInput('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#071A33] text-white shadow-md border-b border-white/10">
        {/* Top micro-bar for Contact & Quick Info (Desktop only: hidden on screens < 768px) */}
        <div className="hidden md:block bg-[#040E1B] text-xs py-1.5 px-4 text-gray-300 border-b border-white/5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-gray-200">
                <span className="inline-block w-2 h-2 rounded-full bg-[#138808] animate-pulse"></span>
                India's Trusted Shopping Hub • 100% Genuine Products
              </span>
              <span className="text-gray-600">|</span>
              <a
                href={`mailto:${MANAGER_CREDENTIALS.email}`}
                className="flex items-center gap-1.5 text-[#FFB703] hover:text-white transition font-medium"
              >
                <Mail className="w-3.5 h-3.5" />
                Manager Email: {MANAGER_CREDENTIALS.email}
              </a>
              <span className="text-gray-600">|</span>
              <button
                onClick={() => setContactModalOpen(true)}
                className="flex items-center gap-1.5 text-gray-300 hover:text-white transition cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#FF7A00]" />
                Help & Support
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (!requireAuth({ type: 'open_track_order' })) return;
                  setTrackOrderModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-[#FFB703] hover:text-white transition font-bold cursor-pointer"
                title="Track Order Status in Real-time"
              >
                <Truck className="w-3.5 h-3.5 text-[#FF7A00]" />
                <span>Track Order</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Flipkart / Amazon Style Navigation Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6">
            {/* Left: Mobile Hamburger ☰ + Brand Logo */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden text-white hover:text-[#FFB703] p-1.5 -ml-1 rounded-lg hover:bg-white/10 transition cursor-pointer shrink-0"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div
                onClick={() => setCurrentView('shop')}
                className="cursor-pointer flex flex-col group select-none shrink-0"
              >
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight italic font-sans flex items-center">
                    <span className="text-white">Bharat</span>
                    <span className="text-[#FFB703] ml-0.5">Kart</span>
                  </span>
                  <span className="text-[10px] sm:text-xs bg-[#FFB703] text-[#071A33] font-black px-1 sm:px-1.5 py-0.5 rounded shadow-sm">
                    Plus
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[10px] text-white/80 italic -mt-1 group-hover:text-[#FFB703] transition">
                  <span>Explore</span>
                  <span className="text-[#FFB703] font-bold">Plus</span>
                  <Sparkles className="w-2.5 h-2.5 text-[#FFB703]" />
                  <span className="hidden md:inline font-normal text-white/70">
                    • Arun Bookstores Partner
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Location Selector (Desktop only) */}
            <div className="hidden lg:flex items-center gap-1 text-xs text-gray-300 hover:text-white cursor-pointer relative shrink-0">
              <button
                onClick={() => setShowPincodePrompt(!showPincodePrompt)}
                className="flex items-center gap-1 py-1 px-2 rounded hover:bg-white/10 transition text-left cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#FF7A00] shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 leading-none">Deliver to</p>
                  <p className="font-semibold text-white leading-tight">PIN: {pincode}</p>
                </div>
              </button>

              {showPincodePrompt && (
                <div className="absolute top-10 left-0 bg-white text-gray-800 p-3 rounded-lg shadow-xl w-60 z-50 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Change Delivery Pincode</p>
                  <form onSubmit={handlePincodeSubmit} className="flex gap-1.5">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 110001"
                      value={newPincodeInput}
                      onChange={(e) => setNewPincodeInput(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-[#FF7A00]"
                    />
                    <button
                      type="submit"
                      className="bg-[#FF7A00] hover:bg-[#E86F00] text-white text-xs px-3 py-1.5 rounded font-semibold cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Desktop Search Bar (hidden on mobile < md, shown in row 2 on mobile) */}
            <div className="hidden md:flex flex-1 max-w-2xl relative">
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  placeholder="Search for products, books, mobiles, electronics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-gray-900 placeholder-gray-500 text-sm py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00] shadow-sm font-medium"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <Search className="w-4 h-4 text-[#FF7A00] absolute right-3 pointer-events-none" />
                )}
              </div>
            </div>

            {/* User Account / Login & Management Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0">
              {/* Account / Login Button */}
              {!currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      setAuthModalDefaultTab('user');
                      setAuthModalOpen(true);
                    }}
                    className="bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold text-xs sm:text-sm px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-lg shadow-sm transition flex items-center gap-1 cursor-pointer active:scale-98"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden xs:inline sm:inline">Login</span>
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1 sm:gap-1.5 bg-white/10 hover:bg-white/20 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition border border-white/15 cursor-pointer"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden bg-[#FFB703] text-[#071A33] font-bold flex items-center justify-center text-xs shrink-0 border border-white/40">
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        currentUser.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-[10px] text-gray-300 capitalize leading-none">
                        {currentUser.role}
                      </p>
                      <p className="text-xs font-bold leading-tight truncate max-w-[110px]">
                        {currentUser.name}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
                  </button>

                  {/* User Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      onMouseLeave={() => setUserDropdownOpen(false)}
                      className="absolute right-0 top-11 w-60 bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-100 py-2 z-50 text-sm animate-in fade-in"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 border border-blue-300 shrink-0">
                            {currentUser.avatar ? (
                              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-blue-800">
                                {currentUser.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate leading-snug">{currentUser.name}</p>
                            <p className="text-xs text-gray-500 truncate">{currentUser.emailOrId}</p>
                          </div>
                        </div>
                        <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-50 text-[#FF7A00]">
                          {currentUser.role === 'manager'
                            ? '👑 Store Manager'
                            : currentUser.role === 'employee'
                            ? '💼 Store Employee'
                            : '🛍️ Customer'}
                        </span>
                      </div>

                      {/* Upload Profile Picture Option */}
                      <button
                        onClick={() => {
                          setProfileModalOpen(true);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-orange-50 text-[#071A33] font-semibold flex items-center gap-2 text-xs transition cursor-pointer"
                      >
                        <Camera className="w-4 h-4 text-[#FF7A00]" />
                        <span>Upload Profile Picture</span>
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>

                      {/* Manager exclusive portal link */}
                      {currentUser.role === 'manager' && (
                        <>
                          <button
                            onClick={() => {
                              setCurrentView('manager-dashboard');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-amber-50 text-[#071A33] font-bold flex items-center gap-2 cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#FFB703]" />
                            Manager Portal (Arun)
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView('shop');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 cursor-pointer"
                          >
                            <Layers className="w-4 h-4 text-gray-500" />
                            View Shopping Store
                          </button>
                        </>
                      )}

                      {/* Employee portal link */}
                      {currentUser.role === 'employee' && (
                        <>
                          <button
                            onClick={() => {
                              setCurrentView('employee-dashboard');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-[#138808] font-bold flex items-center gap-2 cursor-pointer"
                          >
                            <Package className="w-4 h-4 text-[#138808]" />
                            Employee Portal (Add Products)
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView('shop');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 cursor-pointer"
                          >
                            <Layers className="w-4 h-4 text-gray-500" />
                            View Shopping Store
                          </button>
                        </>
                      )}

                      {/* Manager Store Orders shortcut */}
                      {currentUser.role === 'manager' && (
                        <button
                          onClick={() => {
                            setCurrentView('manager-dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-amber-50 text-[#071A33] font-bold flex items-center justify-between text-xs transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-[#FFB703]" />
                            <span>Customer Orders (Store)</span>
                          </div>
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.5 rounded">
                            {orders.length}
                          </span>
                        </button>
                      )}

                      {/* Employee Customer Orders shortcut */}
                      {currentUser.role === 'employee' && (
                        <button
                          onClick={() => {
                            setCurrentView('employee-dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-[#138808] font-bold flex items-center justify-between text-xs transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-[#138808]" />
                            <span>Customer Orders & Tracking</span>
                          </div>
                          <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-1.5 py-0.5 rounded">
                            {orders.length}
                          </span>
                        </button>
                      )}

                      {/* Personal Purchases / Orders */}
                      <button
                        onClick={() => {
                          setCurrentView('my-orders');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 text-xs cursor-pointer"
                      >
                        <Package className="w-4 h-4 text-gray-500" />
                        <span>{currentUser.role === 'user' ? 'My Orders' : 'My Personal Purchases'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (!requireAuth({ type: 'open_track_order' })) return;
                          setTrackOrderModalOpen(true);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-orange-50 text-[#FF7A00] flex items-center gap-2 font-semibold cursor-pointer"
                      >
                        <Truck className="w-4 h-4 text-[#FF7A00]" />
                        Track Order Live
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Role Portal Shortcut Badge when logged in (desktop only) */}
              {currentUser?.role === 'manager' && currentView !== 'manager-dashboard' && (
                <button
                  onClick={() => setCurrentView('manager-dashboard')}
                  className="hidden md:flex items-center gap-1 bg-[#FFB703] hover:bg-[#EBA802] text-[#071A33] font-bold text-xs px-2.5 py-1.5 rounded shadow transition cursor-pointer"
                  title="Go to Manager Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Manager Portal
                </button>
              )}

              {currentUser?.role === 'employee' && currentView !== 'employee-dashboard' && (
                <button
                  onClick={() => setCurrentView('employee-dashboard')}
                  className="hidden md:flex items-center gap-1 bg-[#138808] hover:bg-[#107507] text-white font-bold text-xs px-2.5 py-1.5 rounded shadow transition cursor-pointer"
                  title="Go to Employee Portal"
                >
                  <Package className="w-3.5 h-3.5" />
                  Employee Portal
                </button>
              )}

              {/* Wishlist Link (Desktop) */}
              <button
                onClick={() => {
                  if (!requireAuth({ type: 'open_wishlist' })) return;
                  if (wishlist.length === 0) {
                    showToast('Your Wishlist is currently empty. Click the heart icon on any product to save it here!');
                  } else {
                    setCurrentView('shop');
                  }
                }}
                className="relative p-2 text-white hover:text-[#FFB703] transition hidden sm:flex items-center cursor-pointer"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 bg-[#FF7A00] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Track Order Button (Desktop only: hidden on mobile < 768px) */}
              <button
                onClick={() => {
                  if (!requireAuth({ type: 'open_track_order' })) return;
                  setTrackOrderModalOpen(true);
                }}
                className="hidden md:flex items-center gap-1.5 bg-[#FFB703] hover:bg-yellow-400 text-[#071A33] font-bold text-xs px-3 py-2 rounded-lg shadow-sm transition cursor-pointer"
                title="Track any order in real time"
              >
                <Truck className="w-4 h-4 text-[#071A33]" />
                <span>Track Order</span>
              </button>

              {/* Cart Button with Badge */}
              <button
                onClick={() => {
                  if (!requireAuth({ type: 'open_cart' })) return;
                  setCartOpen(true);
                }}
                className="flex items-center gap-1.5 sm:gap-2 bg-[#FF7A00] hover:bg-[#E86F00] text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition relative shadow-sm cursor-pointer"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-[#FFB703] text-[#071A33] text-[10px] sm:text-xs font-black rounded-full min-w-4 sm:min-w-5 h-4 sm:h-5 px-1 flex items-center justify-center shadow-md">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline">Cart</span>
              </button>
            </div>
          </div>

          {/* Mobile Search Row (< md) */}
          <div className="md:hidden pt-2 pb-0.5">
            <div className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Search books, mobiles, electronics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-gray-900 placeholder-gray-500 text-xs py-2 pl-3.5 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00] shadow-sm font-medium"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Search className="w-3.5 h-3.5 text-[#FF7A00] absolute right-3 pointer-events-none" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer (☰ Menu) */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <div className="fixed top-0 bottom-0 left-0 w-[285px] max-w-[85vw] bg-[#071A33] text-white z-50 flex flex-col shadow-2xl overflow-y-auto border-r border-white/10 animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="p-4 bg-[#040E1B] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black italic tracking-tight">
                  Bharat<span className="text-[#FFB703]">Kart</span>
                </span>
                <span className="bg-[#FFB703] text-[#071A33] text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                  Plus
                </span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card in Drawer */}
            <div className="p-4 bg-white/5 border-b border-white/10">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#FFB703] text-[#071A33] font-bold flex items-center justify-center text-sm shrink-0 border border-white/30">
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        currentUser.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{currentUser.emailOrId}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30">
                      {currentUser.role === 'manager' ? '👑 Store Manager' : currentUser.role === 'employee' ? '💼 Employee' : '🛍️ Customer'}
                    </span>
                    <button
                      onClick={() => {
                        setProfileModalOpen(true);
                        setMobileDrawerOpen(false);
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 mx-auto flex items-center justify-center text-gray-300">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Welcome to Bharat Kart!</p>
                    <p className="text-[11px] text-gray-400">Sign in to track orders & save items</p>
                  </div>
                  <button
                    onClick={() => {
                      setAuthModalDefaultTab('user');
                      setAuthModalOpen(true);
                      setMobileDrawerOpen(false);
                    }}
                    className="w-full bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold text-xs py-2 rounded-lg shadow transition cursor-pointer"
                  >
                    Login / Create Account
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Links */}
            <div className="flex-1 p-3 space-y-1 text-xs font-semibold">
              <button
                onClick={() => {
                  setCurrentView('shop');
                  setMobileDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#FFB703]" />
                <span>Shop Catalog</span>
              </button>

              <button
                onClick={() => {
                  if (!requireAuth({ type: 'open_track_order' })) return;
                  setTrackOrderModalOpen(true);
                  setMobileDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/10 text-[#FFB703] font-bold transition cursor-pointer"
              >
                <Truck className="w-4 h-4 text-[#FF7A00]" />
                <span>Track Order (Live Status)</span>
              </button>

              <button
                onClick={() => {
                  setContactModalOpen(true);
                  setMobileDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Help & Customer Support</span>
              </button>

              <a
                href={`mailto:${MANAGER_CREDENTIALS.email}`}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition cursor-pointer"
              >
                <Mail className="w-4 h-4 text-sky-400" />
                <span className="truncate">Manager Email: {MANAGER_CREDENTIALS.email}</span>
              </a>

              {currentUser && (
                <button
                  onClick={() => {
                    setCurrentView('my-orders');
                    setMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition cursor-pointer"
                >
                  <Package className="w-4 h-4 text-purple-400" />
                  <span>My Orders ({orders.length})</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (!requireAuth({ type: 'open_wishlist' })) return;
                  setCurrentView('shop');
                  setMobileDrawerOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Wishlist</span>
                </div>
                {wishlist.length > 0 && (
                  <span className="bg-[#FF7A00] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Delivery PIN in Drawer */}
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 my-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-[#FF7A00]" />
                    <span>Deliver to: PIN {pincode}</span>
                  </div>
                  <button
                    onClick={() => setShowPincodePrompt(!showPincodePrompt)}
                    className="text-[11px] text-[#FFB703] hover:underline cursor-pointer font-bold"
                  >
                    Change
                  </button>
                </div>
                {showPincodePrompt && (
                  <form onSubmit={handlePincodeSubmit} className="flex gap-1.5 mt-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6-digit PIN"
                      value={newPincodeInput}
                      onChange={(e) => setNewPincodeInput(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-xs bg-white text-gray-900 border border-gray-300 rounded px-2 py-1"
                    />
                    <button type="submit" className="bg-[#FF7A00] text-white text-xs px-2.5 py-1 rounded font-bold cursor-pointer">
                      Set
                    </button>
                  </form>
                )}
              </div>

              {/* Role Portals inside Drawer */}
              {currentUser?.role === 'manager' && (
                <div className="pt-2 border-t border-white/10 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-[#FFB703] px-2">Manager Control</p>
                  <button
                    onClick={() => {
                      setCurrentView('manager-dashboard');
                      setMobileDrawerOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-amber-500/10 text-[#FFB703] font-bold hover:bg-amber-500/20 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#FFB703]" />
                    <span>Manager Dashboard</span>
                  </button>
                </div>
              )}

              {currentUser?.role === 'employee' && (
                <div className="pt-2 border-t border-white/10 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-emerald-400 px-2">Employee Tools</p>
                  <button
                    onClick={() => {
                      setCurrentView('employee-dashboard');
                      setMobileDrawerOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500/20 transition cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span>Employee Portal</span>
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {currentUser && (
              <div className="p-3 border-t border-white/10 bg-[#040E1B]">
                <button
                  onClick={() => {
                    logout();
                    setMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-rose-400 hover:text-rose-300 font-bold text-xs py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (< md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#071A33] border-t border-white/10 text-white flex items-center justify-around py-1.5 px-1 shadow-2xl">
        <button
          onClick={() => setCurrentView('shop')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded transition cursor-pointer ${
            currentView === 'shop' ? 'text-[#FFB703]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Shop</span>
        </button>

        <button
          onClick={() => {
            if (!requireAuth({ type: 'open_track_order' })) return;
            setTrackOrderModalOpen(true);
          }}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded text-gray-400 hover:text-[#FFB703] transition cursor-pointer"
        >
          <Truck className="w-5 h-5 text-[#FFB703]" />
          <span className="text-[10px] font-semibold text-[#FFB703]">Track</span>
        </button>

        <button
          onClick={() => setContactModalOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded text-gray-400 hover:text-white transition cursor-pointer"
        >
          <HelpCircle className="w-5 h-5 text-[#FF7A00]" />
          <span className="text-[10px] font-semibold">Help</span>
        </button>

        <button
          onClick={() => {
            if (!requireAuth({ type: 'open_cart' })) return;
            setCartOpen(true);
          }}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded text-gray-400 hover:text-white transition cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#FF7A00] text-white text-[9px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">Cart</span>
        </button>

        <button
          onClick={() => {
            if (!currentUser) {
              setAuthModalDefaultTab('user');
              setAuthModalOpen(true);
            } else {
              setMobileDrawerOpen(true);
            }
          }}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded text-gray-400 hover:text-white transition cursor-pointer"
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] font-semibold truncate max-w-[55px]">
            {currentUser ? currentUser.name.split(' ')[0] : 'Account'}
          </span>
        </button>
      </nav>
    </>
  );
};
