import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, Employee, User, CartItem, Order, Address, TrackingEvent, Category, CreatorProfile, HeroSlide, PromoStripOffer, PendingAction, ProductReview, PaymentSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_EMPLOYEES, MANAGER_CREDENTIALS, INITIAL_ORDERS, INITIAL_CATEGORIES, INITIAL_CREATOR_PROFILE, INITIAL_HERO_SLIDES, INITIAL_PROMO_STRIP, INITIAL_REVIEWS, INITIAL_PAYMENT_SETTINGS } from '../data/initialData';
import { sendOtpEmail } from '../services/emailService';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Auth state
  currentUser: {
    id: string;
    name: string;
    emailOrId: string;
    role: 'guest' | 'user' | 'employee' | 'manager';
    phone?: string;
    telegram?: string;
    avatar?: string;
  } | null;
  updateProfileAvatar: (avatarUrl: string) => void;
  loginUser: (emailOrId: string, password: string) => { success: boolean; message: string };
  signupUser: (name: string, emailOrId: string, phone: string, password: string) => { success: boolean; message: string };
  loginWithGoogle: (googleAccount?: { name: string; email: string }) => void;
  loginEmployee: (employeeId: string, password: string) => { success: boolean; message: string };
  loginManager: (userId: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  sendPasswordResetOtp: (email: string) => Promise<{ success: boolean; message: string; otp?: string }>;
  verifyResetOtp: (email: string, otp: string) => { success: boolean; message: string };
  resetPasswordAndLogin: (email: string, otp: string, newPassword: string) => { success: boolean; message: string };

  // Catalog
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'addedAt'>) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Employees (Manager only)
  employees: Employee[];
  addEmployee: (empData: Omit<Employee, 'id' | 'createdAt'>) => { success: boolean; message: string };
  removeEmployee: (id: string) => void;
  toggleEmployeeStatus: (id: string) => void;

  // Shopping Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartMrpTotal: number;
  cartSavings: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    address: Address;
    paymentMethod: 'COD' | 'ONLINE_UPI';
    transactionId?: string;
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  updateOrderStatusWithTracking: (
    orderId: string,
    updateData: {
      status: Order['orderStatus'];
      note?: string;
      location?: string;
      courierName?: string;
      trackingNumber?: string;
      estimatedDelivery?: string;
      updaterName: string;
      updaterRole: 'manager' | 'employee';
      updaterDept?: string;
    }
  ) => void;
  deleteOrder: (orderId: string) => void;

  // Categories Management (Manager rights)
  categories: Category[];
  addCategory: (categoryData: { name: string; nameHindi?: string; icon: string; description?: string }) => { success: boolean; message: string; category?: Category };
  deleteCategory: (categoryId: string) => { success: boolean; message: string };

  // Creator Profile (Updated by Manager only)
  creatorProfile: CreatorProfile;
  updateCreatorProfile: (profile: Partial<CreatorProfile>) => { success: boolean; message: string };
  editCreatorModalOpen: boolean;
  setEditCreatorModalOpen: (open: boolean) => void;
  addCategoryModalOpen: boolean;
  setAddCategoryModalOpen: (open: boolean) => void;

  // Banner Advertisements & Promo Strip (Manager rights only)
  heroSlides: HeroSlide[];
  addHeroSlide: (slide: Omit<HeroSlide, 'id' | 'order'>) => { success: boolean; message: string; slide?: HeroSlide };
  updateHeroSlide: (id: string, slideData: Partial<HeroSlide>) => { success: boolean; message: string };
  deleteHeroSlide: (id: string) => { success: boolean; message: string };
  toggleHeroSlideActive: (id: string) => void;
  reorderHeroSlides: (newOrderedSlides: HeroSlide[]) => void;
  moveHeroSlide: (id: string, direction: 'up' | 'down') => void;
  promoStrip: PromoStripOffer;
  updatePromoStrip: (promoData: Partial<PromoStripOffer>) => { success: boolean; message: string };
  bannerEditorModalOpen: boolean;
  setBannerEditorModalOpen: (open: boolean) => void;
  editingHeroSlide: HeroSlide | null;
  setEditingHeroSlide: (slide: HeroSlide | null) => void;
  promoEditorModalOpen: boolean;
  setPromoEditorModalOpen: (open: boolean) => void;

  // Payment System Settings (Manager rights only)
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (settings: Partial<PaymentSettings>) => { success: boolean; message: string };

  // Filter & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;

  // Active UI Views & Modals
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalDefaultTab: 'user' | 'employee' | 'manager';
  setAuthModalDefaultTab: (tab: 'user' | 'employee' | 'manager') => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  contactModalOpen: boolean;
  setContactModalOpen: (open: boolean) => void;
  profileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;
  trackOrderModalOpen: boolean;
  setTrackOrderModalOpen: (open: boolean) => void;
  trackingOrderNumber: string;
  setTrackingOrderNumber: (orderNum: string) => void;
  orderToUpdateStatus: Order | null;
  setOrderToUpdateStatus: (order: Order | null) => void;
  currentView: 'shop' | 'manager-dashboard' | 'employee-dashboard' | 'my-orders';
  setCurrentView: (view: 'shop' | 'manager-dashboard' | 'employee-dashboard' | 'my-orders') => void;

  // Notification Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Pending Action Authentication Interceptor (Seamless Resume)
  pendingAction: PendingAction | null;
  setPendingAction: (action: PendingAction | null) => void;
  requireAuth: (action: PendingAction, customToastMessage?: string) => boolean;
  executePendingAction: (userOverride?: AppContextType['currentUser']) => void;

  // Reviews System
  reviews: ProductReview[];
  addProductReview: (reviewData: Omit<ProductReview, 'id' | 'createdAt' | 'verifiedPurchase'>) => void;
  getProductReviews: (productId: string) => ProductReview[];
  reviewModalProduct: Product | null;
  setReviewModalProduct: (product: Product | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'bharatkart_users_db_v1';
const EMPLOYEES_STORAGE_KEY = 'bharatkart_employees_db_v1';
const PRODUCTS_STORAGE_KEY = 'bharatkart_products_db_v1';
const CATEGORIES_STORAGE_KEY = 'bharatkart_categories_db_v1';
const CREATOR_PROFILE_STORAGE_KEY = 'bharatkart_creator_profile_v1';
const HERO_SLIDES_STORAGE_KEY = 'bharatkart_hero_slides_v1';
const PROMO_STRIP_STORAGE_KEY = 'bharatkart_promo_strip_v1';
const PAYMENT_SETTINGS_STORAGE_KEY = 'bharatkart_payment_settings_v1';
const REVIEWS_STORAGE_KEY = 'bharatkart_reviews_db_v1';
const PENDING_ACTION_STORAGE_KEY = 'bharatkart_pending_action_v1';
const ORDERS_STORAGE_KEY = 'bharatkart_orders_db_v1';
const SESSION_STORAGE_KEY = 'bharatkart_session_v1';
export const MY_ORDER_IDS_KEY = 'bharatkart_my_placed_order_ids_v1';

export const getUserStorageKey = (prefix: string, user: AppContextType['currentUser']): string => {
  if (!user) {
    return `${prefix}_guest`;
  }
  const role = user.role || 'user';
  const rawId = (user.emailOrId || user.id || 'anonymous').toLowerCase().trim();
  const cleanId = rawId.replace(/[^a-z0-9@._-]/g, '_');
  return `${prefix}_${role}_${cleanId}`;
};

export const getCartStorageKey = (user: AppContextType['currentUser']): string => {
  return getUserStorageKey('bharatkart_cart', user);
};

export const getWishlistStorageKey = (user: AppContextType['currentUser']): string => {
  return getUserStorageKey('bharatkart_wishlist', user);
};

export const loadCartFromStorage = (user: AppContextType['currentUser']): CartItem[] => {
  try {
    const key = getCartStorageKey(user);
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load isolated cart from storage', err);
  }
  return [];
};

export const saveCartToStorage = (user: AppContextType['currentUser'], items: CartItem[]) => {
  try {
    const key = getCartStorageKey(user);
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save isolated cart to storage', err);
  }
};

export const loadWishlistFromStorage = (user: AppContextType['currentUser']): string[] => {
  try {
    const key = getWishlistStorageKey(user);
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load isolated wishlist from storage', err);
  }
  return [];
};

export const saveWishlistToStorage = (user: AppContextType['currentUser'], items: string[]) => {
  try {
    const key = getWishlistStorageKey(user);
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save isolated wishlist to storage', err);
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Session State
  const [currentUser, setCurrentUser] = useState<AppContextType['currentUser']>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Registered Users DB
  const [usersDb, setUsersDb] = useState<{ [emailOrId: string]: { password: string; name: string; phone?: string; id: string } }>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed default sample user
    return {
      'customer@gmail.com': {
        id: 'usr-demo',
        password: 'User@123',
        name: 'Rahul Sharma',
        phone: '9876543210',
      },
    };
  });

  // Save usersDb to localStorage
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersDb));
  }, [usersDb]);

  // Employees DB
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_EMPLOYEES;
  });

  useEffect(() => {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  // Products DB
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  // Categories DB (Manager rights to add / delete categories)
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const addCategory = (categoryData: { name: string; nameHindi?: string; icon: string; description?: string }) => {
    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Permission Denied: Only Store Manager Arun Prakash can add categories.', 'error');
      return { success: false, message: 'Only Manager can add categories' };
    }

    const trimmedName = categoryData.name.trim();
    if (!trimmedName) {
      showToast('Category name cannot be empty.', 'error');
      return { success: false, message: 'Category name required' };
    }

    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
    const exists = categories.some((c) => c.id === slug || c.name.toLowerCase() === trimmedName.toLowerCase());
    const finalId = exists ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const newCategory: Category = {
      id: finalId,
      name: trimmedName,
      nameHindi: categoryData.nameHindi?.trim() || trimmedName,
      icon: categoryData.icon || 'Tag',
      description: categoryData.description?.trim(),
    };

    setCategories((prev) => [...prev, newCategory]);
    showToast(`Category "${newCategory.name}" added successfully by Store Manager!`);
    return { success: true, message: 'Category created successfully', category: newCategory };
  };

  const deleteCategory = (categoryId: string) => {
    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Permission Denied: Only Store Manager Arun Prakash can delete categories.', 'error');
      return { success: false, message: 'Only Manager can delete categories' };
    }

    if (categoryId === 'all') {
      showToast('Cannot delete root "All Categories" filter.', 'error');
      return { success: false, message: 'Cannot delete default category' };
    }

    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    if (selectedCategory === categoryId) {
      setSelectedCategory('all');
    }
    showToast('Category deleted successfully.');
    return { success: true, message: 'Category deleted' };
  };

  // Creator Profile State (Created by Arun Prakash, modifiable only by Manager)
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile>(() => {
    try {
      const saved = localStorage.getItem(CREATOR_PROFILE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CREATOR_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem(CREATOR_PROFILE_STORAGE_KEY, JSON.stringify(creatorProfile));
  }, [creatorProfile]);

  const updateCreatorProfile = (newProfile: Partial<CreatorProfile>) => {
    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Access Denied: Only Store Manager Arun Prakash has permission to update creator profile.', 'error');
      return { success: false, message: 'Only Manager can update creator profile' };
    }

    setCreatorProfile((prev) => ({
      ...prev,
      ...newProfile,
    }));
    showToast('Founder & Creator profile updated successfully!');
    return { success: true, message: 'Creator profile updated' };
  };

  const [editCreatorModalOpen, setEditCreatorModalOpen] = useState(false);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);

  // Banner Advertisements & Promo Strip (Manager rights only)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    try {
      const saved = localStorage.getItem(HERO_SLIDES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_HERO_SLIDES;
  });

  useEffect(() => {
    localStorage.setItem(HERO_SLIDES_STORAGE_KEY, JSON.stringify(heroSlides));
  }, [heroSlides]);

  const [promoStrip, setPromoStrip] = useState<PromoStripOffer>(() => {
    try {
      const saved = localStorage.getItem(PROMO_STRIP_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PROMO_STRIP;
  });

  useEffect(() => {
    localStorage.setItem(PROMO_STRIP_STORAGE_KEY, JSON.stringify(promoStrip));
  }, [promoStrip]);

  const [bannerEditorModalOpen, setBannerEditorModalOpen] = useState(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState<HeroSlide | null>(null);
  const [promoEditorModalOpen, setPromoEditorModalOpen] = useState(false);

  const addHeroSlide = (slideData: Omit<HeroSlide, 'id' | 'order'>) => {
    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Permission Denied: Only Store Manager Arun Prakash can add banner advertisements.', 'error');
      return { success: false, message: 'Only Manager can add banner slides' };
    }

    const newSlide: HeroSlide = {
      ...slideData,
      id: `slide-${Date.now()}`,
      order: heroSlides.length + 1,
    };

    setHeroSlides((prev) => [...prev, newSlide]);
    showToast(`Hero banner "${newSlide.title}" created successfully!`);
    return { success: true, message: 'Hero slide created', slide: newSlide };
  };

  const updateHeroSlide = (id: string, slideData: Partial<HeroSlide>) => {
    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Permission Denied: Only Store Manager Arun Prakash can edit banner advertisements.', 'error');
      return { success: false, message: 'Only Manager can update banner slides' };
    }

    setHeroSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...slideData } : s))
    );
    showToast('Banner advertisement updated successfully!');
    return { success: true, message: 'Hero slide updated' };
  };

  const deleteHeroSlide = (id: string) => {
    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Permission Denied: Only Store Manager Arun Prakash can delete banner advertisements.', 'error');
      return { success: false, message: 'Only Manager can delete banner slides' };
    }

    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
    showToast('Banner slide deleted successfully.');
    return { success: true, message: 'Hero slide deleted' };
  };

  const toggleHeroSlideActive = (id: string) => {
    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Permission Denied: Only Store Manager can toggle banner visibility.', 'error');
      return;
    }

    setHeroSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
    showToast('Banner status updated.');
  };

  const reorderHeroSlides = (newOrderedSlides: HeroSlide[]) => {
    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Permission Denied: Only Store Manager can reorder banners.', 'error');
      return;
    }

    const reindexed = newOrderedSlides.map((slide, idx) => ({
      ...slide,
      order: idx + 1,
    }));
    setHeroSlides(reindexed);
    showToast('Banner order saved successfully.');
  };

  const moveHeroSlide = (id: string, direction: 'up' | 'down') => {
    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Permission Denied: Only Store Manager can reorder banners.', 'error');
      return;
    }

    setHeroSlides((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, item);
      return copy.map((slide, i) => ({ ...slide, order: i + 1 }));
    });
    showToast('Banner order updated.');
  };

  const updatePromoStrip = (promoData: Partial<PromoStripOffer>) => {
    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Permission Denied: Only Store Manager Arun Prakash can edit promotional offers.', 'error');
      return { success: false, message: 'Only Manager can update promo offer' };
    }

    setPromoStrip((prev) => ({
      ...prev,
      ...promoData,
    }));
    showToast('Promotional offer strip updated successfully!');
    return { success: true, message: 'Promo strip updated' };
  };

  // Payment System Settings (Manager rights only)
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    try {
      const saved = localStorage.getItem(PAYMENT_SETTINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PAYMENT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(PAYMENT_SETTINGS_STORAGE_KEY, JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  const updatePaymentSettings = (settingsData: Partial<PaymentSettings>) => {
    if (!currentUser || currentUser.role !== 'manager') {
      showToast('Permission Denied: Only Store Manager Arun Prakash can configure payment settings.', 'error');
      return { success: false, message: 'Only Manager can configure payment settings' };
    }

    setPaymentSettings((prev) => ({
      ...prev,
      ...settingsData,
      updatedAt: new Date().toISOString(),
    }));
    showToast('Store payment system settings updated successfully!');
    return { success: true, message: 'Payment settings saved' };
  };

  // Keep a ref to currentUser for synchronous cart/wishlist persistence
  const currentUserRef = useRef<AppContextType['currentUser']>(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Track the active user storage key loaded in React state
  const loadedCartUserKeyRef = useRef<string>(getCartStorageKey(currentUser));

  // Isolated Shopping Cart State - initialized from active user session storage
  const [cart, setCart] = useState<CartItem[]>(() => loadCartFromStorage(currentUser));

  // Isolated Wishlist State - initialized from active user session storage
  const [wishlist, setWishlist] = useState<string[]>(() => loadWishlistFromStorage(currentUser));

  // Switch cart and wishlist cleanly when user session changes (login, logout, account switch)
  useEffect(() => {
    const activeKey = getCartStorageKey(currentUser);
    if (loadedCartUserKeyRef.current !== activeKey) {
      loadedCartUserKeyRef.current = activeKey;
      const isolatedCart = loadCartFromStorage(currentUser);
      setCart(isolatedCart);
      const isolatedWishlist = loadWishlistFromStorage(currentUser);
      setWishlist(isolatedWishlist);
    }
  }, [currentUser]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState<'user' | 'employee' | 'manager'>('user');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [trackOrderModalOpen, setTrackOrderModalOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('');
  const [orderToUpdateStatus, setOrderToUpdateStatus] = useState<Order | null>(null);
  const [currentView, setCurrentView] = useState<'shop' | 'manager-dashboard' | 'employee-dashboard' | 'my-orders'>('shop');

  // Pending Action state (Seamless Resume after login/signup)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(() => {
    try {
      const saved = sessionStorage.getItem(PENDING_ACTION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (pendingAction) {
      sessionStorage.setItem(PENDING_ACTION_STORAGE_KEY, JSON.stringify(pendingAction));
    } else {
      sessionStorage.removeItem(PENDING_ACTION_STORAGE_KEY);
    }
  }, [pendingAction]);

  // Product Reviews DB
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const [reviewModalProduct, setReviewModalProduct] = useState<Product | null>(null);

  // Require Auth Helper (Interception & Prompt)
  const requireAuth = (action: PendingAction, customToastMessage?: string): boolean => {
    if (currentUser) {
      return true;
    }
    setPendingAction(action);
    setAuthModalDefaultTab('user');
    setAuthModalOpen(true);
    showToast(customToastMessage || 'Please log in or create an account to continue.', 'info');
    return false;
  };

  // Seamless Resume: execute attempted action after login
  const executePendingAction = (userOverride?: AppContextType['currentUser']) => {
    const activeUser = userOverride || currentUser;
    if (!activeUser) return;

    let action = pendingAction;
    if (!action) {
      try {
        const saved = sessionStorage.getItem(PENDING_ACTION_STORAGE_KEY);
        if (saved) action = JSON.parse(saved);
      } catch {}
    }
    if (!action) return;

    setPendingAction(null);
    sessionStorage.removeItem(PENDING_ACTION_STORAGE_KEY);

    setTimeout(() => {
      switch (action!.type) {
        case 'add_to_cart': {
          const prod = action!.product;
          const qty = action!.quantity || 1;
          const baseCart = loadCartFromStorage(activeUser);
          const existing = baseCart.find((item) => item.product.id === prod.id);
          const updated = existing
            ? baseCart.map((item) =>
                item.product.id === prod.id
                  ? { ...item, quantity: item.quantity + qty }
                  : item
              )
            : [...baseCart, { product: prod, quantity: qty }];
          saveCartToStorage(activeUser, updated);
          setCart(updated);
          if (action!.openCart) {
            setCartOpen(true);
          }
          showToast(`Added "${prod.title.slice(0, 30)}..." to your cart!`);
          break;
        }
        case 'buy_now': {
          const prod = action!.product;
          const qty = action!.quantity || 1;
          const baseCart = loadCartFromStorage(activeUser);
          const existing = baseCart.find((item) => item.product.id === prod.id);
          const updated = existing
            ? baseCart.map((item) =>
                item.product.id === prod.id
                  ? { ...item, quantity: item.quantity + qty }
                  : item
              )
            : [...baseCart, { product: prod, quantity: qty }];
          saveCartToStorage(activeUser, updated);
          setCart(updated);
          setCartOpen(false);
          setCheckoutOpen(true);
          showToast(`Direct Checkout initialized for "${prod.title.slice(0, 25)}..."!`);
          break;
        }
        case 'toggle_wishlist': {
          const pId = action!.productId;
          const baseWishlist = loadWishlistFromStorage(activeUser);
          const updated = baseWishlist.includes(pId)
            ? baseWishlist.filter((id) => id !== pId)
            : [...baseWishlist, pId];
          saveWishlistToStorage(activeUser, updated);
          setWishlist(updated);
          showToast(baseWishlist.includes(pId) ? 'Removed from wishlist.' : 'Saved to wishlist!');
          break;
        }
        case 'open_cart': {
          setCartOpen(true);
          break;
        }
        case 'open_checkout': {
          setCheckoutOpen(true);
          break;
        }
        case 'open_track_order': {
          setTrackOrderModalOpen(true);
          if (action!.orderNumber) {
            setTrackingOrderNumber(action!.orderNumber);
          }
          break;
        }
        case 'write_review': {
          setSelectedProductForDetail(action!.product);
          setReviewModalProduct(action!.product);
          break;
        }
        case 'open_wishlist': {
          setCurrentView('shop');
          break;
        }
        default:
          break;
      }
    }, 350);
  };

  const addProductReview = (reviewData: Omit<ProductReview, 'id' | 'createdAt' | 'verifiedPurchase'>) => {
    if (!currentUser) {
      requireAuth({ type: 'write_review', product: reviewModalProduct || products[0] });
      return;
    }

    const newRev: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      verifiedPurchase: true,
      userName: currentUser.name || reviewData.userName,
      userRole: currentUser.role,
    };

    setReviews((prev) => [newRev, ...prev]);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === reviewData.productId
          ? {
              ...p,
              ratingCount: (p.ratingCount || 0) + 1,
            }
          : p
      )
    );
    showToast(`Thank you, ${currentUser.name}! Your verified review has been published.`);
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  // Sync session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [currentUser]);

  // Auth Methods
  const signupUser = (name: string, emailOrId: string, phone: string, password: string) => {
    const cleanId = emailOrId.trim().toLowerCase();
    if (usersDb[cleanId]) {
      return { success: false, message: 'This User ID / Email is already registered! Please log in.' };
    }
    const newId = 'usr-' + Date.now();
    const updatedUsers = {
      ...usersDb,
      [cleanId]: {
        id: newId,
        password,
        name: name.trim(),
        phone: phone.trim(),
      },
    };
    setUsersDb(updatedUsers);
    const sessionUser = {
      id: newId,
      name: name.trim(),
      emailOrId: cleanId,
      phone: phone.trim(),
      role: 'user' as const,
    };
    setCurrentUser(sessionUser);
    currentUserRef.current = sessionUser;
    loadedCartUserKeyRef.current = getCartStorageKey(sessionUser);
    const isolatedCart = loadCartFromStorage(sessionUser);
    setCart(isolatedCart);
    const isolatedWishlist = loadWishlistFromStorage(sessionUser);
    setWishlist(isolatedWishlist);
    executePendingAction(sessionUser);
    showToast(`Welcome to Bharat Kart, ${name}! Your account has been saved successfully.`);
    return { success: true, message: 'Registration successful! Signed in.' };
  };

  const loginUser = (emailOrId: string, password: string) => {
    const cleanId = emailOrId.trim().toLowerCase();
    const record = usersDb[cleanId];
    if (!record) {
      return { success: false, message: 'Account not found! Please check your User ID / Email or Sign Up first.' };
    }
    if (record.password !== password) {
      return { success: false, message: 'Wrong password! Please check and try again.' };
    }
    const sessionUser = {
      id: record.id,
      name: record.name,
      emailOrId: cleanId,
      phone: record.phone,
      role: 'user' as const,
    };
    setCurrentUser(sessionUser);
    currentUserRef.current = sessionUser;
    loadedCartUserKeyRef.current = getCartStorageKey(sessionUser);
    const isolatedCart = loadCartFromStorage(sessionUser);
    setCart(isolatedCart);
    const isolatedWishlist = loadWishlistFromStorage(sessionUser);
    setWishlist(isolatedWishlist);
    executePendingAction(sessionUser);
    showToast(`Welcome back, ${record.name}!`);
    return { success: true, message: 'Login successful!' };
  };

  const loginWithGoogle = (googleAccount?: { name: string; email: string }) => {
    const rawEmail = googleAccount?.email?.trim();
    if (!rawEmail) {
      showToast('Please provide a valid Google email address');
      return;
    }
    const cleanId = rawEmail.toLowerCase();
    const name = googleAccount?.name?.trim() || cleanId.split('@')[0] || 'Customer';
    const id = 'usr-google-' + Date.now();

    // Auto-save user in DB if not exists
    if (!usersDb[cleanId]) {
      setUsersDb((prev) => ({
        ...prev,
        [cleanId]: {
          id,
          password: 'google_oauth_verified',
          name,
        },
      }));
    }

    const sessionUser = {
      id,
      name,
      emailOrId: cleanId,
      role: 'user' as const,
    };
    setCurrentUser(sessionUser);
    currentUserRef.current = sessionUser;
    loadedCartUserKeyRef.current = getCartStorageKey(sessionUser);
    const isolatedCart = loadCartFromStorage(sessionUser);
    setCart(isolatedCart);
    const isolatedWishlist = loadWishlistFromStorage(sessionUser);
    setWishlist(isolatedWishlist);
    executePendingAction(sessionUser);
    showToast(`Signed in with Google as ${name}!`);
  };

  const updateProfileAvatar = (avatarUrl: string) => {
    if (!currentUser) return;
    const cleanAvatar = avatarUrl.trim();
    const updatedUser = { ...currentUser, avatar: cleanAvatar };
    setCurrentUser(updatedUser);

    if (currentUser.role === 'manager') {
      localStorage.setItem('bharatkart_manager_avatar_v1', cleanAvatar);
    } else if (currentUser.role === 'employee') {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === currentUser.id || e.employeeId.toLowerCase() === currentUser.emailOrId.toLowerCase()
            ? { ...e, avatar: cleanAvatar }
            : e
        )
      );
    } else if (currentUser.role === 'user') {
      const cleanId = currentUser.emailOrId.toLowerCase();
      if (usersDb[cleanId]) {
        setUsersDb((prev) => ({
          ...prev,
          [cleanId]: { ...prev[cleanId], avatar: cleanAvatar },
        }));
      }
    }

    showToast('Profile picture updated successfully!');
  };

  const loginEmployee = (employeeId: string, password: string) => {
    const cleanEmpId = employeeId.trim().toLowerCase();
    const emp = employees.find((e) => e.employeeId.toLowerCase() === cleanEmpId);
    if (!emp) {
      return { success: false, message: 'Invalid Employee ID! Only accounts created by the Manager can login.' };
    }
    if (!emp.active) {
      return { success: false, message: 'This employee account has been deactivated by Manager.' };
    }
    if (emp.password !== password) {
      return { success: false, message: 'Incorrect Employee Password! Please verify with your Manager.' };
    }
    const sessionEmp = {
      id: emp.id,
      name: emp.name,
      emailOrId: emp.employeeId,
      role: 'employee' as const,
      avatar: emp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    };
    setCurrentUser(sessionEmp);
    currentUserRef.current = sessionEmp;
    loadedCartUserKeyRef.current = getCartStorageKey(sessionEmp);
    const isolatedCart = loadCartFromStorage(sessionEmp);
    setCart(isolatedCart);
    const isolatedWishlist = loadWishlistFromStorage(sessionEmp);
    setWishlist(isolatedWishlist);
    setCurrentView('employee-dashboard');
    showToast(`Welcome, ${emp.name} (Employee Portal)!`);
    return { success: true, message: 'Employee login successful!' };
  };

  const loginManager = (userId: string, password: string) => {
    const cleanId = userId.trim();
    // STRICT REQUIREMENT: Only arun.prakash.45 and Arun@0999
    if (cleanId !== MANAGER_CREDENTIALS.userId) {
      return {
        success: false,
        message: `Unauthorized! Only the authorized Manager (${MANAGER_CREDENTIALS.userId}) can login to this portal.`,
      };
    }
    if (password !== MANAGER_CREDENTIALS.password) {
      return { success: false, message: 'Wrong Manager Password! Please enter valid credentials.' };
    }

    const savedMgrAvatar = localStorage.getItem('bharatkart_manager_avatar_v1');
    const sessionManager = {
      id: 'mgr-arun',
      name: MANAGER_CREDENTIALS.name,
      emailOrId: MANAGER_CREDENTIALS.userId,
      role: 'manager' as const,
      telegram: MANAGER_CREDENTIALS.telegram,
      avatar: savedMgrAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    };
    setCurrentUser(sessionManager);
    currentUserRef.current = sessionManager;
    loadedCartUserKeyRef.current = getCartStorageKey(sessionManager);
    const isolatedCart = loadCartFromStorage(sessionManager);
    setCart(isolatedCart);
    const isolatedWishlist = loadWishlistFromStorage(sessionManager);
    setWishlist(isolatedWishlist);
    setCurrentView('manager-dashboard');
    showToast(`Welcome Arun Prakash! Manager Portal unlocked.`);
    return { success: true, message: 'Manager login successful!' };
  };

  const logout = () => {
    setCurrentUser(null);
    currentUserRef.current = null;
    loadedCartUserKeyRef.current = getCartStorageKey(null);
    const guestCart = loadCartFromStorage(null);
    setCart(guestCart);
    const guestWishlist = loadWishlistFromStorage(null);
    setWishlist(guestWishlist);
    setCurrentView('shop');

    // Explicitly wipe session storage and any temporary auth form buffers
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem('bharatkart_auth_temp');
      localStorage.removeItem('bharatkart_login_buffer');
      localStorage.removeItem('bharatkart_manager_buffer');
      localStorage.removeItem('bharatkart_employee_buffer');
      sessionStorage.clear();
    } catch {}

    showToast(`Logged out successfully. Have a great day!`, 'info');
  };

  // Password Recovery via Email OTP
  const [resetOtpRecord, setResetOtpRecord] = useState<{ email: string; otp: string; expiresAt: number } | null>(null);

  const sendPasswordResetOtp = async (email: string): Promise<{ success: boolean; message: string; otp?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Please enter your registered email address.' };
    }
    const record = usersDb[cleanEmail];
    if (!record) {
      return { success: false, message: 'No account found with this email.' };
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setResetOtpRecord({
      email: cleanEmail,
      otp: generatedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Real Email Delivery via EmailJS
    const emailResult = await sendOtpEmail(cleanEmail, record.name, generatedOtp);
    if (!emailResult.success) {
      showToast('Failed to send email. Please check your network or try again.', 'error');
      return {
        success: false,
        message: 'Failed to send email. Please check your network or try again.',
      };
    }

    showToast('OTP sent successfully to your registered email address.', 'success');
    return {
      success: true,
      message: 'OTP sent successfully to your registered email address.',
      otp: generatedOtp,
    };
  };

  const verifyResetOtp = (email: string, otp: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      return { success: false, message: 'Please enter the 6-digit OTP.' };
    }
    if (!resetOtpRecord || resetOtpRecord.email !== cleanEmail) {
      return { success: false, message: 'No active OTP found for this email. Please request a new OTP.' };
    }
    if (Date.now() > resetOtpRecord.expiresAt) {
      return { success: false, message: 'OTP has expired! Please click "Resend OTP".' };
    }
    if (resetOtpRecord.otp !== cleanOtp) {
      return { success: false, message: 'Incorrect OTP! Please check the 6-digit code and try again.' };
    }
    return { success: true, message: 'OTP verified successfully!' };
  };

  const resetPasswordAndLogin = (email: string, otp: string, newPassword: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const record = usersDb[cleanEmail];
    if (!record) {
      return { success: false, message: 'No account found with this email.' };
    }
    const otpVerification = verifyResetOtp(cleanEmail, otp);
    if (!otpVerification.success) {
      return otpVerification;
    }
    if (newPassword.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    // Update password in usersDb and persist to localStorage
    const updatedUsersDb = {
      ...usersDb,
      [cleanEmail]: {
        ...record,
        password: newPassword,
      },
    };
    setUsersDb(updatedUsersDb);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsersDb));

    // Clear reset OTP state
    setResetOtpRecord(null);

    // Auto-login customer into updated account
    const sessionUser = {
      id: record.id,
      name: record.name,
      emailOrId: cleanEmail,
      phone: record.phone,
      role: 'user' as const,
    };
    setCurrentUser(sessionUser);
    currentUserRef.current = sessionUser;
    loadedCartUserKeyRef.current = getCartStorageKey(sessionUser);
    const isolatedCart = loadCartFromStorage(sessionUser);
    setCart(isolatedCart);
    const isolatedWishlist = loadWishlistFromStorage(sessionUser);
    setWishlist(isolatedWishlist);
    executePendingAction(sessionUser);

    showToast('Password reset successful! You are now logged in.', 'success');
    return { success: true, message: 'Password reset successful!' };
  };

  // Product Catalog Management
  const addProduct = (productData: Omit<Product, 'id' | 'addedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      addedAt: new Date().toISOString().split('T')[0],
      addedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'System',
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.title}" added to Bharat Kart catalog!`);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...productData } : item))
    );
    showToast('Product updated successfully!');
  };

  const deleteProduct = (id: string) => {
    const item = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also remove from cart and update user storage
    setCart((prev) => {
      const updated = prev.filter((c) => c.product.id !== id);
      saveCartToStorage(currentUserRef.current, updated);
      return updated;
    });
    showToast(`Product "${item?.title || id}" removed.`, 'info');
  };

  // Employee Management (Manager Only)
  const addEmployee = (empData: Omit<Employee, 'id' | 'createdAt'>) => {
    const cleanId = empData.employeeId.trim().toLowerCase();
    if (employees.some((e) => e.employeeId.toLowerCase() === cleanId)) {
      return { success: false, message: 'An employee with this ID already exists!' };
    }
    const newEmp: Employee = {
      ...empData,
      id: 'emp-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEmployees((prev) => [...prev, newEmp]);
    showToast(`Employee "${newEmp.name}" (${newEmp.employeeId}) created successfully!`);
    return { success: true, message: 'Employee added successfully!' };
  };

  const removeEmployee = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    showToast(`Employee ID "${emp?.employeeId || id}" deleted.`, 'info');
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e))
    );
    showToast('Employee status updated.');
  };

  // Cart Operations (Strictly isolated by user session)
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const updated = existing
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prev, { product, quantity }];
      saveCartToStorage(currentUserRef.current, updated);
      return updated;
    });
    showToast(`Added "${product.title.slice(0, 30)}..." to your cart!`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveCartToStorage(currentUserRef.current, updated);
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      saveCartToStorage(currentUserRef.current, updated);
      return updated;
    });
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    saveCartToStorage(currentUserRef.current, []);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartMrpTotal = cart.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const cartSavings = cartMrpTotal - cartTotal;

  // Wishlist (Strictly isolated by user session)
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const isPresent = prev.includes(productId);
      const updated = isPresent
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      saveWishlistToStorage(currentUserRef.current, updated);
      if (isPresent) {
        showToast('Removed from wishlist.', 'info');
      } else {
        showToast('Saved to wishlist!');
      }
      return updated;
    });
  };

  // Order Operations
  const createOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    address: Address;
    paymentMethod: 'COD' | 'ONLINE_UPI';
    transactionId?: string;
    notes?: string;
  }) => {
    const orderNumber = 'BK-' + Math.floor(100000 + Math.random() * 900000);
    const nowIso = new Date().toISOString();
    const initialTracking: TrackingEvent = {
      id: 'trk-' + Date.now(),
      status: 'Placed',
      timestamp: nowIso,
      updatedBy: orderData.customerName || 'Customer',
      updatedByRole: 'user',
      location: `${orderData.address.city}, ${orderData.address.state}`,
      note: `Order placed by customer via Bharat Kart. Confirmation sent to Store Manager Email ${MANAGER_CREDENTIALS.email}.`,
    };

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      userId: currentUser?.id,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      address: orderData.address,
      items: [...cart],
      totalAmount: cartTotal,
      discountAmount: cartSavings,
      deliveryFee: 0, // Free Delivery
      finalAmount: cartTotal,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'ONLINE_UPI' ? 'PAID' : 'PENDING',
      transactionId: orderData.transactionId,
      orderStatus: 'Placed',
      createdAt: nowIso,
      notes: orderData.notes,
      currentLocation: `${orderData.address.city}, ${orderData.address.state}`,
      lastUpdatedBy: orderData.customerName || 'Customer',
      lastUpdatedByRole: 'user',
      lastUpdatedAt: nowIso,
      trackingHistory: [initialTracking],
    };

    setOrders((prev) => [newOrder, ...prev]);

    try {
      const prevIdsStr = localStorage.getItem(MY_ORDER_IDS_KEY) || '[]';
      const prevIds: string[] = JSON.parse(prevIdsStr);
      if (!prevIds.includes(newOrder.id)) {
        localStorage.setItem(MY_ORDER_IDS_KEY, JSON.stringify([newOrder.id, ...prevIds]));
      }
    } catch {}

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    const updaterName = currentUser?.name || 'Bharat Kart Staff';
    const updaterRole = currentUser?.role === 'manager' ? 'manager' : 'employee';
    updateOrderStatusWithTracking(orderId, {
      status,
      updaterName,
      updaterRole,
      note: `Order status shifted to ${status}.`,
    });
  };

  const updateOrderStatusWithTracking = (
    orderId: string,
    updateData: {
      status: Order['orderStatus'];
      note?: string;
      location?: string;
      courierName?: string;
      trackingNumber?: string;
      estimatedDelivery?: string;
      updaterName: string;
      updaterRole: 'manager' | 'employee';
      updaterDept?: string;
    }
  ) => {
    const nowIso = new Date().toISOString();
    const newEvent: TrackingEvent = {
      id: 'trk-' + Date.now() + Math.random().toString().slice(2, 5),
      status: updateData.status,
      timestamp: nowIso,
      updatedBy: updateData.updaterName,
      updatedByRole: updateData.updaterRole,
      updatedByDept: updateData.updaterDept,
      note: updateData.note,
      location: updateData.location,
      courierName: updateData.courierName,
      trackingNumber: updateData.trackingNumber,
      estimatedDelivery: updateData.estimatedDelivery,
    };

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const currentHist = o.trackingHistory || [];
        return {
          ...o,
          orderStatus: updateData.status,
          courierName: updateData.courierName || o.courierName,
          trackingNumber: updateData.trackingNumber || o.trackingNumber,
          currentLocation: updateData.location || o.currentLocation,
          estimatedDelivery: updateData.estimatedDelivery || o.estimatedDelivery,
          lastUpdatedBy: updateData.updaterName,
          lastUpdatedByRole: updateData.updaterRole,
          lastUpdatedAt: nowIso,
          trackingHistory: [newEvent, ...currentHist],
        };
      })
    );

    showToast(`Order status updated to "${updateData.status}" by ${updateData.updaterName}!`);
  };

  const deleteOrder = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order #${ord?.orderNumber || orderId} deleted permanently.`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        updateProfileAvatar,
        loginUser,
        signupUser,
        loginWithGoogle,
        loginEmployee,
        loginManager,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        employees,
        addEmployee,
        removeEmployee,
        toggleEmployeeStatus,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartMrpTotal,
        cartSavings,
        wishlist,
        toggleWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        updateOrderStatusWithTracking,
        deleteOrder,
        categories,
        addCategory,
        deleteCategory,
        creatorProfile,
        updateCreatorProfile,
        editCreatorModalOpen,
        setEditCreatorModalOpen,
        addCategoryModalOpen,
        setAddCategoryModalOpen,
        heroSlides,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        toggleHeroSlideActive,
        reorderHeroSlides,
        moveHeroSlide,
        promoStrip,
        updatePromoStrip,
        bannerEditorModalOpen,
        setBannerEditorModalOpen,
        editingHeroSlide,
        setEditingHeroSlide,
        promoEditorModalOpen,
        setPromoEditorModalOpen,
        paymentSettings,
        updatePaymentSettings,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        authModalOpen,
        setAuthModalOpen,
        authModalDefaultTab,
        setAuthModalDefaultTab,
        cartOpen,
        setCartOpen,
        checkoutOpen,
        setCheckoutOpen,
        selectedProductForDetail,
        setSelectedProductForDetail,
        contactModalOpen,
        setContactModalOpen,
        profileModalOpen,
        setProfileModalOpen,
        trackOrderModalOpen,
        setTrackOrderModalOpen,
        trackingOrderNumber,
        setTrackingOrderNumber,
        orderToUpdateStatus,
        setOrderToUpdateStatus,
        currentView,
        setCurrentView,
        toasts,
        showToast,
        removeToast,
        pendingAction,
        setPendingAction,
        requireAuth,
        executePendingAction,
        reviews,
        addProductReview,
        getProductReviews,
        reviewModalProduct,
        setReviewModalProduct,
        sendPasswordResetOtp,
        verifyResetOtp,
        resetPasswordAndLogin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
