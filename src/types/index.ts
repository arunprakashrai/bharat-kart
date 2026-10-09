export type UserRole = 'user' | 'employee' | 'manager';

export interface User {
  id: string;
  name: string;
  emailOrId: string;
  phone?: string;
  role: 'user';
  createdAt: string;
  avatar?: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  password: string;
  department: string;
  createdAt: string;
  active: boolean;
  avatar?: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  ratingCount: number;
  image: string;
  images?: string[];
  video?: string;
  description: string;
  brand: string;
  stock: number;
  inStock: boolean;
  featured?: boolean;
  assured?: boolean;
  badgeText?: string;
  specifications: Record<string, string>;
  addedBy?: string; // employee or manager
  addedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  displayName?: string;
  mapUrl?: string;
}

export interface Address {
  fullName: string;
  phone: string;
  pincode: string;
  houseNo: string;
  area: string;
  city: string;
  state: string;
  landmark?: string;
  location?: LocationCoordinates;
}

export interface TrackingEvent {
  id: string;
  status: 'Placed' | 'Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  timestamp: string;
  updatedBy: string;
  updatedByRole: 'manager' | 'employee' | 'system' | 'user';
  updatedByDept?: string;
  note?: string;
  location?: string;
  courierName?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: Address;
  items: CartItem[];
  totalAmount: number;
  discountAmount: number;
  deliveryFee: number;
  finalAmount: number;
  paymentMethod: 'COD' | 'ONLINE_UPI';
  paymentStatus: 'PAID' | 'PENDING';
  transactionId?: string;
  orderStatus: 'Placed' | 'Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  notes?: string;
  trackingHistory?: TrackingEvent[];
  courierName?: string;
  trackingNumber?: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  lastUpdatedBy?: string;
  lastUpdatedByRole?: 'manager' | 'employee' | 'system' | 'user';
  lastUpdatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  nameHindi?: string;
  icon: string;
  image?: string;
  description?: string;
  subText?: string;
}

export interface CreatorProfile {
  name: string;
  title: string;
  email: string;
  linkedin: string;
  instagram: string;
  photoUrl: string;
  bio?: string;
}

export type BannerActionType = 'category' | 'cart' | 'checkout' | 'contact' | 'url';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  highlight?: string;
  badge: string;
  badgeColor?: string;
  tag?: string;
  buttonText: string;
  buttonActionType: BannerActionType;
  buttonActionValue?: string;
  bgGradient: string;
  bgImage?: string;
  active: boolean;
  order: number;
}

export interface PromoStripOffer {
  id: string;
  title: string;
  discountText: string;
  couponCode: string;
  primaryButtonText: string;
  primaryButtonActionType: BannerActionType;
  primaryButtonActionValue?: string;
  secondaryButtonText: string;
  secondaryButtonActionType: BannerActionType;
  secondaryButtonActionValue?: string;
  bgGradient?: string;
  active: boolean;
}

export type PendingAction =
  | { type: 'add_to_cart'; product: Product; quantity?: number; openCart?: boolean }
  | { type: 'buy_now'; product: Product; quantity?: number }
  | { type: 'toggle_wishlist'; productId: string }
  | { type: 'open_cart' }
  | { type: 'open_checkout' }
  | { type: 'open_track_order'; orderNumber?: string }
  | { type: 'write_review'; product: Product }
  | { type: 'open_wishlist' };

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userRole?: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface PaymentSettings {
  upiId: string;
  payeeName: string;
  merchantName: string;
  enableUpi: boolean;
  enableCod: boolean;
  enableCardNetBanking: boolean;
  customQrImageUrl?: string;
  updatedAt?: string;
}


