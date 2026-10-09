import React, { useState } from 'react';
import {
  Package,
  Plus,
  Eye,
  CheckCircle,
  Briefcase,
  Layers,
  Sparkles,
  Edit,
  XCircle,
  Upload,
  Image as ImageIcon,
  Camera,
  Video,
  Play,
  Trash2,
  Film,
  Truck,
  MapPin,
  Mail,
  Search,
  Clock,
  ExternalLink,
  Calendar,
  Navigation,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Order } from '../types';
import { MANAGER_CREDENTIALS } from '../data/initialData';

export const EmployeePortal: React.FC = () => {
  const {
    currentUser,
    setCurrentView,
    products,
    addProduct,
    updateProduct,
    categories,
    showToast,
    setProfileModalOpen,
    orders,
    setOrderToUpdateStatus,
    setTrackOrderModalOpen,
    setTrackingOrderNumber,
  } = useApp();

  // Tab state: 'orders' or 'products'
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Add Product Form State
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategory, setProdCategory] = useState('books');
  const [prodPrice, setProdPrice] = useState('');
  const [prodMrp, setProdMrp] = useState('');
  const [prodBrand, setProdBrand] = useState('Bharat Kart');
  const [prodImage, setProdImage] = useState(
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80'
  );
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodVideo, setProdVideo] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodStock, setProdStock] = useState('25');
  const [specAuthor, setSpecAuthor] = useState('');
  const [specWarranty, setSpecWarranty] = useState('');

  // Editing state for pre-added items
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editMrp, setEditMrp] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editVideo, setEditVideo] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStock, setEditStock] = useState('');

  const sampleImages = [
    { label: 'Books', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Exam Guide', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80' },
    { label: 'Smartphone', url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80' },
    { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
    { label: 'Clothing', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleStartEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditTitle(p.title);
    setEditCategory(p.category);
    setEditPrice(p.price.toString());
    setEditMrp(p.mrp.toString());
    setEditBrand(p.brand);
    setEditImage(p.image);
    setEditImages(p.images || []);
    setEditVideo(p.video || '');
    setEditDescription(p.description);
    setEditStock(p.stock.toString());
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const priceNum = parseFloat(editPrice) || editingProduct.price;
    const mrpNum = parseFloat(editMrp) || editingProduct.mrp;
    const discount = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;

    updateProduct(editingProduct.id, {
      title: editTitle.trim(),
      category: editCategory,
      price: priceNum,
      mrp: mrpNum,
      discount,
      brand: editBrand.trim(),
      image: editImage.trim(),
      images: editImages,
      video: editVideo.trim() || undefined,
      description: editDescription.trim(),
      stock: parseInt(editStock) || editingProduct.stock,
    });

    setEditingProduct(null);
  };

  // Primary image upload
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP, etc.)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file too large! Please choose an image under 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        if (isEdit) {
          setEditImage(dataUrl);
        } else {
          setProdImage(dataUrl);
        }
        showToast('Product photo uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Multiple additional images upload
  const handleMultipleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          if (isEdit) {
            setEditImages((prev) => [...prev, dataUrl]);
          } else {
            setProdImages((prev) => [...prev, dataUrl]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
    showToast(`Added ${files.length} multiple photo(s)!`);
  };

  const removeUploadedImage = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setProdImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Video file upload
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast('Please select a valid video file (MP4, WebM)', 'error');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      showToast('Video file size exceeds 25MB limit. Please use a smaller video or paste video URL.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        if (isEdit) {
          setEditVideo(dataUrl);
        } else {
          setProdVideo(dataUrl);
        }
        showToast('Product video attached successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodPrice || !prodMrp) {
      showToast('Please fill in required fields (Title, Price, MRP)', 'error');
      return;
    }

    const priceNum = parseFloat(prodPrice);
    const mrpNum = parseFloat(prodMrp);
    const discount = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;

    const specs: Record<string, string> = {
      'Condition': 'Brand New, Sealed Box',
      'Listed By': `Employee: ${currentUser?.name || 'Staff'}`,
    };
    if (specAuthor) specs['Author / Model'] = specAuthor;
    if (specWarranty) specs['Warranty'] = specWarranty;

    addProduct({
      title: prodTitle.trim(),
      category: prodCategory,
      price: priceNum,
      mrp: mrpNum,
      discount,
      rating: 4.7,
      ratingCount: 1,
      image: prodImage.trim(),
      images: prodImages,
      video: prodVideo.trim() || undefined,
      description: prodDescription.trim() || 'Quality verified product on Bharat Kart.',
      brand: prodBrand.trim() || 'Bharat Kart',
      stock: parseInt(prodStock) || 20,
      inStock: true,
      assured: true,
      specifications: specs,
      addedBy: currentUser ? `${currentUser.name} (${currentUser.emailOrId})` : 'Employee',
    });

    // Reset
    setProdTitle('');
    setProdPrice('');
    setProdMrp('');
    setProdDescription('');
    setProdImages([]);
    setProdVideo('');
    setSpecAuthor('');
    setSpecWarranty('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Employee Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Employee Avatar with Camera Button */}
          <div className="relative group shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-emerald-300 shadow-md bg-emerald-950 flex items-center justify-center">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={currentUser?.name || 'Employee'}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setProfileModalOpen(true)}
              className="absolute -bottom-1 -right-1 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 p-1.5 rounded-full shadow-lg transition transform hover:scale-110"
              title="Upload Employee Profile Picture"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="bg-emerald-300 text-emerald-950 text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                Employee Portal
              </span>
              <span className="text-xs text-emerald-200">
                Staff ID: {currentUser?.emailOrId}
              </span>
              <button
                onClick={() => setProfileModalOpen(true)}
                className="text-[11px] text-emerald-200 hover:text-white underline font-semibold flex items-center gap-1"
              >
                <Camera className="w-3 h-3" />
                <span>Upload Profile Picture</span>
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Welcome, {currentUser?.name}!
            </h1>
            <p className="text-xs text-emerald-100 mt-0.5 max-w-xl">
              You are logged in as an authorized employee. Use this portal to add new products with photos, multiple images, videos, title, price, or edit pre-added products anytime.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('shop')}
          className="bg-white/15 hover:bg-white/25 text-white font-semibold text-xs px-4 py-2.5 rounded-lg border border-white/20 transition backdrop-blur-xs flex items-center gap-1.5"
        >
          <Eye className="w-4 h-4" />
          <span>View Public Store</span>
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 mb-6 bg-white p-2 rounded-2xl border border-gray-200 shadow-xs">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Customer Orders Placed by Users</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'orders'
                ? 'bg-emerald-900 text-emerald-100'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === 'products'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products Catalog & Inventory</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'products'
                ? 'bg-emerald-900 text-emerald-100'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {products.length}
          </span>
        </button>
      </div>

      {/* TAB 1: CUSTOMER ORDERS & LIVE TRACKING UPDATES */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Top Order Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[11px] text-gray-500 block">Total Orders</span>
              <span className="text-2xl font-black text-gray-900">{orders.length}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs bg-amber-50/30">
              <span className="text-[11px] text-amber-700 block">Placed / Pending</span>
              <span className="text-2xl font-black text-amber-900">
                {orders.filter((o) => o.orderStatus === 'Placed').length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-xs bg-purple-50/30">
              <span className="text-[11px] text-purple-700 block">In Transit / Shipped</span>
              <span className="text-2xl font-black text-purple-900">
                {
                  orders.filter(
                    (o) => o.orderStatus === 'Shipped' || o.orderStatus === 'Out for Delivery'
                  ).length
                }
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs bg-emerald-50/30">
              <span className="text-[11px] text-emerald-700 block">Delivered</span>
              <span className="text-2xl font-black text-emerald-900">
                {orders.filter((o) => o.orderStatus === 'Delivered').length}
              </span>
            </div>
          </div>

          {/* Orders Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search by Order #, Customer, Phone..."
                className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
              {(
                [
                  { id: 'all', label: 'All Status' },
                  { id: 'Placed', label: 'Placed' },
                  { id: 'Confirmed', label: 'Confirmed' },
                  { id: 'Shipped', label: 'Shipped' },
                  { id: 'Out for Delivery', label: 'Out for Delivery' },
                  { id: 'Delivered', label: 'Delivered' },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  onClick={() => setOrderStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition shrink-0 cursor-pointer ${
                    orderStatusFilter === st.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {orders.filter((o) => {
            const matchesSearch =
              o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
              o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
              o.customerPhone.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
              (o.trackingNumber &&
                o.trackingNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()));
            const matchesStatus =
              orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
            return matchesSearch && matchesStatus;
          }).length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-200">
              <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-gray-800">No Orders Found</h3>
              <p className="text-xs text-gray-500 mt-1">
                No orders match your filter criteria. Try clearing search keywords.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders
                .filter((o) => {
                  const matchesSearch =
                    o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                    o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                    o.customerPhone.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                    (o.trackingNumber &&
                      o.trackingNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()));
                  const matchesStatus =
                    orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
                  return matchesSearch && matchesStatus;
                })
                .map((ord) => {
                  const statusColors: Record<Order['orderStatus'], string> = {
                    Placed: 'bg-amber-100 text-amber-900 border-amber-200',
                    Confirmed: 'bg-blue-100 text-blue-900 border-blue-200',
                    Shipped: 'bg-purple-100 text-purple-900 border-purple-200',
                    'Out for Delivery': 'bg-orange-100 text-orange-900 border-orange-200',
                    Delivered: 'bg-emerald-100 text-emerald-900 border-emerald-200',
                  };

                  return (
                    <div
                      key={ord.id}
                      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
                    >
                      {/* Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-gray-900">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full border ${
                              statusColors[ord.orderStatus]
                            }`}
                          >
                            Status: {ord.orderStatus}
                          </span>

                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                              ord.paymentMethod === 'ONLINE_UPI'
                                ? 'bg-purple-50 text-purple-700'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {ord.paymentMethod === 'ONLINE_UPI' ? 'Paid via UPI' : 'COD'}
                          </span>
                        </div>
                      </div>

                      {/* Main Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Customer & Address */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                              Ordered by User:
                            </span>
                            <span className="font-bold text-gray-900 text-sm">{ord.customerName}</span>
                          </div>
                          <p className="text-gray-600">📞 Phone: {ord.customerPhone}</p>
                          <p className="text-gray-600">✉️ Email: {ord.customerEmail}</p>
                          <span className="inline-block text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-1.5 py-0.5 rounded border border-emerald-200">
                            {ord.userId ? `Customer ID: ${ord.userId}` : 'Guest User Order'}
                          </span>
                          <p className="text-gray-500 pt-1 leading-snug">
                            {ord.address.houseNo}, {ord.address.area}, {ord.address.city} (
                            {ord.address.pincode})
                          </p>

                          {ord.address.location && (
                            <div className="pt-1.5 flex items-center gap-1.5 text-blue-700">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <a
                                href={
                                  ord.address.location.mapUrl ||
                                  `https://www.openstreetmap.org/?mlat=${ord.address.location.latitude}&mlon=${ord.address.location.longitude}#map=17/${ord.address.location.latitude}/${ord.address.location.longitude}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
                              >
                                <span>
                                  Lat {ord.address.location.latitude.toFixed(4)}, Lon{' '}
                                  {ord.address.location.longitude.toFixed(4)} (OpenStreetMap ↗)
                                </span>
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Items ordered */}
                        <div>
                          <p className="font-bold text-gray-700 mb-1.5 uppercase text-[10px] tracking-wider">
                            Ordered Items ({ord.items.length})
                          </p>
                          <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                            {ord.items.map((it) => (
                              <div
                                key={it.product.id}
                                className="flex items-center justify-between text-gray-700 bg-gray-50 p-1.5 rounded"
                              >
                                <span className="truncate max-w-[160px] font-medium">
                                  {it.product.title}
                                </span>
                                <span className="font-bold shrink-0">
                                  x{it.quantity} (₹{it.product.price * it.quantity})
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 pt-1 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-gray-500">Total Amount:</span>
                            <span className="font-black text-gray-900 text-sm">
                              ₹{ord.finalAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Live Tracking Status & Last Updater */}
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2">
                          <p className="font-bold text-gray-800 text-xs flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Live Tracking Details</span>
                          </p>

                          <div className="space-y-1 text-[11px] text-gray-600">
                            <div>
                              <span className="text-gray-400">Courier: </span>
                              <span className="font-semibold text-gray-800">
                                {ord.courierName || 'BlueDart Express'}
                              </span>
                            </div>

                            {ord.trackingNumber && (
                              <div>
                                <span className="text-gray-400">AWB: </span>
                                <span className="font-mono font-bold text-blue-700">
                                  {ord.trackingNumber}
                                </span>
                              </div>
                            )}

                            {ord.currentLocation && (
                              <div className="flex items-start gap-1">
                                <Navigation className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
                                <span className="truncate">{ord.currentLocation}</span>
                              </div>
                            )}

                            {ord.lastUpdatedBy && (
                              <div className="pt-1 border-t border-gray-200/70 text-[10px]">
                                <span className="text-gray-400">Last updated by: </span>
                                <span className="font-bold text-emerald-800">
                                  {ord.lastUpdatedBy}
                                </span>
                                {ord.lastUpdatedByRole && (
                                  <span className="text-gray-500">
                                    {' '}
                                    ({ord.lastUpdatedByRole === 'manager' ? 'Manager' : 'Employee'})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setOrderToUpdateStatus(ord)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-98"
                          >
                            <Truck className="w-3.5 h-3.5 text-yellow-300" />
                            <span>Update Order Status & Tracking</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setTrackingOrderNumber(ord.orderNumber);
                              setTrackOrderModalOpen(true);
                            }}
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-xs py-2 px-3 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Search className="w-3.5 h-3.5 text-blue-600" />
                            <span>Track Live Timeline</span>
                          </button>
                        </div>

                        <a
                          href={`mailto:${MANAGER_CREDENTIALS.email}?subject=${encodeURIComponent(
                            `📦 BHARAT KART ORDER UPDATE #${ord.orderNumber} - ${ord.orderStatus}`
                          )}&body=${encodeURIComponent(
                            `Order: #${ord.orderNumber}\n` +
                            `Customer: ${ord.customerName} (${ord.customerPhone})\n` +
                            `Status: ${ord.orderStatus}\n` +
                            `Address: ${ord.address.houseNo}, ${ord.address.city}\n` +
                            (ord.courierName ? `Courier: ${ord.courierName} (AWB: ${ord.trackingNumber})\n` : '') +
                            `Total: ₹${ord.finalAmount}\n`
                          )}`}
                          className="bg-[#FF7A00] hover:bg-[#E86F00] text-white text-xs font-bold py-2 px-3 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                          title="Send update to store manager email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email Manager</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Add Product Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <Package className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-gray-900">Add New Product to Store</h2>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modern Physics Guide Class 12 or Bluetooth Earbuds"
                value={prodTitle}
                onChange={(e) => setProdTitle(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg bg-white"
                >
                  {categories
                    .filter((c) => c.id !== 'all')
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} {cat.nameHindi ? `(${cat.nameHindi})` : ''}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Arun Bookstores / Samsung"
                  value={prodBrand}
                  onChange={(e) => setProdBrand(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="399"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  MRP Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="699"
                  value={prodMrp}
                  onChange={(e) => setProdMrp(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={prodStock}
                  onChange={(e) => setProdStock(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* 1. Primary Photo Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                Primary Product Photo *
              </label>

              {/* Upload from Device box */}
              <div className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 rounded-xl p-3 bg-emerald-50/40 text-center transition">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="p-2 rounded-full bg-emerald-100 text-emerald-700">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <label className="cursor-pointer font-bold text-emerald-700 hover:text-emerald-900 underline">
                      <span>Click to Upload Photo from Device / Camera</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileUpload(e, false)}
                      />
                    </label>
                    <p className="text-[10px] text-gray-400 mt-0.5">Supports JPG, PNG, WEBP (up to 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Image Preview & URL input */}
              <div className="flex items-center gap-2">
                <div className="w-14 h-14 rounded-lg border border-gray-200 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  {prodImage ? (
                    <img src={prodImage} alt="Preview" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="url"
                    required
                    placeholder="Or paste Image URL here"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] text-gray-400">Presets:</span>
                {sampleImages.map((s) => (
                  <button
                    type="button"
                    key={s.label}
                    onClick={() => setProdImage(s.url)}
                    className="text-[10px] bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-800 px-2 py-0.5 rounded transition"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Multiple Additional Images Upload */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Add Multiple Additional Photos</span>
                  <span className="text-[10px] text-gray-400">({prodImages.length} added)</span>
                </label>
                <label className="cursor-pointer bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow-2xs">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Select Multiple</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleMultipleImagesUpload(e, false)}
                  />
                </label>
              </div>

              {prodImages.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {prodImages.map((img, idx) => (
                    <div key={idx} className="relative w-14 h-14 rounded-lg border border-gray-300 bg-white p-1 overflow-hidden group">
                      <img src={img} alt={`Additional ${idx + 1}`} className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(idx, false)}
                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 italic">No extra photos added yet. You can attach multiple angles.</p>
              )}
            </div>

            {/* 3. Product Video Upload or URL */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-purple-600" />
                <span>Add Product Video (Video / Demo Reel)</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <label className="cursor-pointer bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 text-xs font-bold px-3 py-2 rounded-lg transition flex items-center justify-center gap-1.5 shrink-0 shadow-2xs">
                  <Film className="w-3.5 h-3.5" />
                  <span>Upload Video from Device</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleVideoFileUpload(e, false)}
                  />
                </label>
                <input
                  type="url"
                  placeholder="Or paste Video URL (MP4 or YouTube embed)"
                  value={prodVideo}
                  onChange={(e) => setProdVideo(e.target.value)}
                  className="flex-1 text-xs p-2 border border-gray-300 rounded-lg bg-white"
                />
              </div>

              {prodVideo && (
                <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded-lg text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Play className="w-4 h-4 text-purple-700 shrink-0" />
                    <span className="truncate text-purple-900 font-medium">Video Attached</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProdVideo('')}
                    className="text-red-500 hover:text-red-700 text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Author / Model / Edition
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2026 Edition"
                  value={specAuthor}
                  onChange={(e) => setSpecAuthor(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Warranty / Guarantee
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 Year Brand Warranty"
                  value={specWarranty}
                  onChange={(e) => setSpecWarranty(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Product Details & Description
              </label>
              <textarea
                rows={3}
                placeholder="Enter details, bullet points, features..."
                value={prodDescription}
                onChange={(e) => setProdDescription(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-lg shadow transition flex items-center justify-center gap-2 active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Product to Bharat Kart</span>
            </button>
          </form>
        </div>

        {/* Live Catalog Preview & Editing */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Pre-added Products Catalog</h3>
              <span className="text-xs text-gray-400">{products.length} Items</span>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-300 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-12 h-12 object-contain bg-white rounded border border-gray-200 p-1 shrink-0"
                    />
                    <div className="min-w-0 text-xs">
                      <p className="font-semibold text-gray-800 truncate max-w-[170px] sm:max-w-xs">{p.title}</p>
                      <p className="text-[10px] text-gray-400 capitalize">{p.category} • {p.brand}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-gray-900">₹{p.price}</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">{p.discount}% off</span>
                        <span className="text-[10px] text-gray-400">Stock: {p.stock}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {p.images && p.images.length > 0 && (
                          <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <Camera className="w-2.5 h-2.5" />
                            +{p.images.length} photos
                          </span>
                        )}
                        {p.video && (
                          <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <Play className="w-2.5 h-2.5" />
                            Video
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartEditProduct(p)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 shrink-0"
                    title="Edit pre-added product details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
            <p className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Direct Live Synchronization
            </p>
            <p className="text-[11px] text-gray-400">
              Products you add or edit are instantly updated across the entire Bharat Kart platform.
            </p>
          </div>
        </div>
      </div>
      )}

      {/* MODAL: EMPLOYEE EDIT PRE-ADDED PRODUCT (WITH MULTI-IMAGE & VIDEO) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                <Edit className="w-5 h-5 text-emerald-600" />
                <span>Edit Pre-added Item Details</span>
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg bg-white"
                  >
                    {categories
                      .filter((c) => c.id !== 'all')
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} {cat.nameHindi ? `(${cat.nameHindi})` : ''}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    MRP Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editMrp}
                    onChange={(e) => setEditMrp(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Primary Image Edit */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Primary Photo / Image *
                </label>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, true)}
                    />
                  </label>
                  <span className="text-[10px] text-gray-400">or enter URL</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-14 h-14 rounded-lg border border-gray-200 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    {editImage ? (
                      <img src={editImage} alt="Preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="Image URL"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Multiple Additional Photos Edit */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Additional Photos ({editImages.length})</span>
                  </label>
                  <label className="cursor-pointer bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow-2xs">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload More</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleMultipleImagesUpload(e, true)}
                    />
                  </label>
                </div>

                {editImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {editImages.map((img, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded-lg border border-gray-300 bg-white p-1 overflow-hidden group">
                        <img src={img} alt={`Additional ${idx + 1}`} className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(idx, true)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          title="Remove photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Edit */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-purple-600" />
                  <span>Product Video</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="cursor-pointer bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 text-xs font-bold px-3 py-2 rounded-lg transition flex items-center justify-center gap-1.5 shrink-0 shadow-2xs">
                    <Film className="w-3.5 h-3.5" />
                    <span>Upload Video File</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleVideoFileUpload(e, true)}
                    />
                  </label>
                  <input
                    type="url"
                    placeholder="Or Video URL"
                    value={editVideo}
                    onChange={(e) => setEditVideo(e.target.value)}
                    className="flex-1 text-xs p-2 border border-gray-300 rounded-lg bg-white"
                  />
                </div>
                {editVideo && (
                  <div className="mt-1 flex items-center justify-between text-xs bg-purple-50 p-2 rounded border border-purple-200">
                    <span className="text-purple-900 font-semibold truncate">Video Attached</span>
                    <button
                      type="button"
                      onClick={() => setEditVideo('')}
                      className="text-red-500 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description & Details
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-lg shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
