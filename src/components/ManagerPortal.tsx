import React, { useState } from 'react';
import {
  ShieldCheck,
  Package,
  Users,
  ShoppingBag,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  MessageCircle,
  Sparkles,
  Phone,
  Send,
  Mail,
  QrCode,
  Settings,
  Key,
  Copy,
  Check,
  AlertTriangle,
  Upload,
  Camera,
  Image as ImageIcon,
  Video,
  Play,
  MapPin,
  ExternalLink,
  Truck,
  Search,
  Tag,
  Layers,
  Megaphone,
  ArrowUp,
  ArrowDown,
  Edit3,
  CreditCard,
  Banknote,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MANAGER_CREDENTIALS } from '../data/initialData';
import { Product, Employee, Order } from '../types';

export const ManagerPortal: React.FC = () => {
  const {
    currentUser,
    setCurrentView,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    deleteCategory,
    setAddCategoryModalOpen,
    creatorProfile,
    setEditCreatorModalOpen,
    heroSlides,
    deleteHeroSlide,
    toggleHeroSlideActive,
    moveHeroSlide,
    setBannerEditorModalOpen,
    setEditingHeroSlide,
    promoStrip,
    setPromoEditorModalOpen,
    paymentSettings,
    updatePaymentSettings,
    employees,
    addEmployee,
    removeEmployee,
    toggleEmployeeStatus,
    orders,
    updateOrderStatus,
    deleteOrder,
    showToast,
    setProfileModalOpen,
    setOrderToUpdateStatus,
    setTrackOrderModalOpen,
    setTrackingOrderNumber,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'banners' | 'payments' | 'employees' | 'orders' | 'settings'>('products');

  // Payment System Settings form state (Store Manager only)
  const [upiIdInput, setUpiIdInput] = useState(paymentSettings.upiId);
  const [payeeNameInput, setPayeeNameInput] = useState(paymentSettings.payeeName);
  const [merchantNameInput, setMerchantNameInput] = useState(paymentSettings.merchantName);
  const [enableUpiInput, setEnableUpiInput] = useState(paymentSettings.enableUpi);
  const [enableCodInput, setEnableCodInput] = useState(paymentSettings.enableCod);
  const [enableCardInput, setEnableCardInput] = useState(paymentSettings.enableCardNetBanking);
  const [customQrImageInput, setCustomQrImageInput] = useState(paymentSettings.customQrImageUrl || '');
  const [copiedPreviewUpi, setCopiedPreviewUpi] = useState(false);

  // Sync inputs if paymentSettings changes in context
  React.useEffect(() => {
    setUpiIdInput(paymentSettings.upiId);
    setPayeeNameInput(paymentSettings.payeeName);
    setMerchantNameInput(paymentSettings.merchantName);
    setEnableUpiInput(paymentSettings.enableUpi);
    setEnableCodInput(paymentSettings.enableCod);
    setEnableCardInput(paymentSettings.enableCardNetBanking);
    setCustomQrImageInput(paymentSettings.customQrImageUrl || '');
  }, [paymentSettings]);

  // Product addition modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategory, setProdCategory] = useState('books');
  const [prodPrice, setProdPrice] = useState('');
  const [prodMrp, setProdMrp] = useState('');
  const [prodBrand, setProdBrand] = useState('Arun Bookstores');
  const [prodImage, setProdImage] = useState(
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80'
  );
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodVideo, setProdVideo] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodStock, setProdStock] = useState('50');

  // Product edit modal state
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

  // Order delete with warning state
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Employee creation state
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empId, setEmpId] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [empDepartment, setEmpDepartment] = useState('Inventory & Catalog');
  const [empError, setEmpError] = useState('');

  // Sample curated image presets for easy manager selection
  const sampleImages = [
    { label: 'Books', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Exam Guide', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80' },
    { label: 'Smartphone', url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80' },
    { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
    { label: 'Fashion Kurta', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Saree', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Mixer Grinder', url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80' },
  ];

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

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodPrice || !prodMrp) {
      showToast('Please fill in required fields (Title, Price, MRP)', 'error');
      return;
    }

    const priceNum = parseFloat(prodPrice);
    const mrpNum = parseFloat(prodMrp);
    const discount = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;

    addProduct({
      title: prodTitle.trim(),
      category: prodCategory,
      price: priceNum,
      mrp: mrpNum,
      discount,
      rating: 4.8,
      ratingCount: 1,
      image: prodImage.trim(),
      images: prodImages,
      video: prodVideo.trim() || undefined,
      description: prodDescription.trim() || 'High quality product curated by Bharat Kart & Arun Bookstores.',
      brand: prodBrand.trim() || 'Bharat Kart',
      stock: parseInt(prodStock) || 20,
      inStock: true,
      assured: true,
      specifications: {
        'Curated By': 'Arun Prakash (Manager)',
        'Condition': 'Brand New, 100% Genuine',
        'Fulfilled By': 'Bharat Kart Hub',
      },
    });

    // Reset form
    setProdTitle('');
    setProdPrice('');
    setProdMrp('');
    setProdDescription('');
    setProdImages([]);
    setProdVideo('');
    setShowAddProductModal(false);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setEmpError('');
    if (!empName.trim() || !empId.trim() || !empPassword.trim()) {
      setEmpError('Please fill in all employee fields!');
      return;
    }

    const cleanId = empId.trim().toLowerCase();
    const res = addEmployee({
      employeeId: cleanId,
      name: empName.trim(),
      password: empPassword.trim(),
      department: empDepartment,
      active: true,
    });

    if (res.success) {
      setEmpName('');
      setEmpId('');
      setEmpPassword('');
      setShowAddEmpModal(false);
    } else {
      setEmpError(res.message);
    }
  };

  const handleSavePaymentSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUpi = upiIdInput.trim();
    if (!cleanUpi || !cleanUpi.includes('@')) {
      showToast('Please enter a valid UPI ID format (e.g. 8471019962@ybl or username@upi)', 'error');
      return;
    }
    if (!enableUpiInput && !enableCodInput && !enableCardInput) {
      showToast('At least one payment option (UPI or COD) must remain active for customer checkout!', 'error');
      return;
    }

    updatePaymentSettings({
      upiId: cleanUpi,
      payeeName: payeeNameInput.trim() || 'Arun Prakash',
      merchantName: merchantNameInput.trim() || 'Bharat Kart Official',
      enableUpi: enableUpiInput,
      enableCod: enableCodInput,
      enableCardNetBanking: enableCardInput,
      customQrImageUrl: customQrImageInput.trim(),
    });
  };

  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP, etc.)', 'error');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      showToast('QR image file too large! Please choose an image under 4MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomQrImageInput(dataUrl);
        showToast('Fallback UPI QR code image uploaded! Click "Save Payment Settings" to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyPreviewUpi = () => {
    navigator.clipboard?.writeText(upiIdInput.trim());
    setCopiedPreviewUpi(true);
    showToast(`Copied UPI ID: ${upiIdInput.trim()}`);
    setTimeout(() => setCopiedPreviewUpi(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Manager Banner Header */}
      <div className="bg-gradient-to-r from-[#131921] via-slate-900 to-[#1b5cb8] text-white rounded-2xl p-6 shadow-xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Manager Profile Picture with Camera Upload Overlay */}
          <div className="relative group shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-slate-800 flex items-center justify-center">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'}
                alt={currentUser?.name || 'Arun Prakash'}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setProfileModalOpen(true)}
              className="absolute -bottom-1 -right-1 bg-amber-400 hover:bg-amber-300 text-blue-950 p-1.5 rounded-full shadow-lg transition transform hover:scale-110"
              title="Upload Manager Profile Picture"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="bg-amber-400 text-blue-950 text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sole Authorized Manager
              </span>
              <span className="text-xs text-amber-300 font-mono">
                ID: {MANAGER_CREDENTIALS.userId}
              </span>
              <button
                onClick={() => setProfileModalOpen(true)}
                className="text-[11px] text-amber-200 hover:text-white underline font-semibold flex items-center gap-1"
              >
                <Camera className="w-3 h-3" />
                <span>Upload Profile Picture</span>
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Manager Control Center • Arun Prakash
            </h1>
            <p className="text-xs text-gray-300 mt-0.5 max-w-xl">
              You hold exclusive administrator rights to add/remove products on the shopping website,
              create or remove employee credentials, and review orders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('shop')}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-lg border border-white/20 transition backdrop-blur-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>View Shopping Store</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">Live Products</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">{products.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Active in Catalog</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">Managed Employees</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">{employees.length}</p>
          <span className="text-[10px] text-blue-600 font-semibold">Authorized Staff</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">Customer Orders</span>
            <ShoppingBag className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">{orders.length}</p>
          <span className="text-[10px] text-gray-500">COD & UPI Transactions</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">Order Email Notification</span>
            <Mail className="w-4 h-4 text-[#FF7A00]" />
          </div>
          <p className="text-sm font-black font-mono text-gray-900 truncate">
            {MANAGER_CREDENTIALS.email}
          </p>
          <span className="text-[10px] text-[#138808] font-semibold">All Store Orders Sent to Email</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl px-2 pt-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'products'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'categories'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'banners'
              ? 'border-amber-500 text-amber-600 bg-amber-50/50 rounded-t-lg'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Ad Banners & Offers ({heroSlides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'payments'
              ? 'border-purple-600 text-purple-600 bg-purple-50/50 rounded-t-lg'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <CreditCard className="w-4 h-4 text-purple-600" />
          <span>Payment System & UPI</span>
        </button>

        <button
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'employees'
              ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Employee Credentials ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-amber-600 text-amber-600 bg-amber-50/50 rounded-t-lg'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Customer Orders Placed by Users ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'settings'
              ? 'border-purple-600 text-purple-600 bg-purple-50/50 rounded-t-lg'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store Settings & Configuration</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200">
            <div>
              <h2 className="text-base font-bold text-gray-900">Live Website Products</h2>
              <p className="text-xs text-gray-500">
                You have full rights to publish, modify or remove any product from Bharat Kart.
              </p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product to Store</span>
            </button>
          </div>

          {/* Product grid list */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price / MRP</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Added By</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-12 h-12 object-contain bg-white rounded border border-gray-200 p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate max-w-xs">{p.title}</p>
                          <span className="text-[10px] text-gray-400 uppercase">{p.brand}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-medium capitalize">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-gray-900">₹{p.price.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-gray-400 line-through">
                          ₹{p.mrp.toLocaleString('en-IN')}
                        </p>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3 text-gray-500 text-[11px]">
                        {p.addedBy || 'Arun Prakash'}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEditProduct(p)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition flex items-center gap-1 font-semibold text-[11px]"
                            title="Edit product details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: STORE CATEGORIES MANAGEMENT (MANAGER ONLY) */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">Store Categories & Catalog Architecture</h2>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Manager Privilege
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                As Store Manager Arun Prakash, you have exclusive rights to add and manage product categories. Any added category instantly reflects on the navigation ribbon, product forms, filters, and store footer.
              </p>
            </div>
            <button
              onClick={() => setAddCategoryModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const productCount =
                cat.id === 'all'
                  ? products.length
                  : products.filter((p) => p.category === cat.id).length;
              const isDefaultRoot = cat.id === 'all';
              const isCoreCategory = ['all', 'books', 'mobiles', 'electronics', 'fashion', 'home', 'grocery'].includes(cat.id);

              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col justify-between shadow-xs hover:border-indigo-300 transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Tag className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        id: {cat.id}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-gray-900 leading-tight">
                      {cat.name}
                    </h3>
                    {cat.nameHindi && (
                      <p className="text-xs text-indigo-700 font-medium mt-0.5">
                        {cat.nameHindi}
                      </p>
                    )}

                    {cat.description && (
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-1.5">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 text-[11px]">
                      <strong className="text-gray-900 font-bold">{productCount}</strong> products
                    </span>

                    {!isDefaultRoot && !isCoreCategory && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete category "${cat.name}"? Products in this category may become unassigned.`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        title="Delete this custom category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}

                    {isCoreCategory && (
                      <span className="text-[10px] text-gray-400 font-medium">Core Catalog</span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Quick Add Card */}
            <button
              onClick={() => setAddCategoryModalOpen(true)}
              className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-indigo-600 hover:text-indigo-800 bg-indigo-50/20 hover:bg-indigo-50/50 transition cursor-pointer min-h-[140px]"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Plus className="w-5 h-5 text-indigo-700" />
              </div>
              <span className="text-xs font-bold">+ Create Another Category</span>
              <span className="text-[10px] text-gray-500 text-center">Exclusive to Manager Arun Prakash</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB: AD BANNERS & PROMO OFFERS MANAGEMENT (MANAGER ONLY) */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          {/* Hero Banner Manager Overview Header */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">
                  Ad Banners & Promotional Campaigns
                </h2>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Manager Privilege
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-2xl">
                Only Store Manager Arun Prakash has permission to publish, edit, reorder, or toggle homepage advertising carousels and promotional deal strips. Changes save automatically and persist in real time.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <button
                onClick={() => {
                  setEditingHeroSlide(null);
                  setBannerEditorModalOpen(true);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Carousel Slide</span>
              </button>

              <button
                onClick={() => setPromoEditorModalOpen(true)}
                className="bg-[#071A33] hover:bg-[#0E284D] text-[#FFB703] font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Offer Strip</span>
              </button>
            </div>
          </div>

          {/* Section 1: Hero Carousel Slides */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-amber-600" />
                  <span>Hero Carousel Slides ({heroSlides.length})</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Slides rotate automatically every 6 seconds on the home storefront. You can reorder or toggle visibility.
                </p>
              </div>

              <span className="text-xs text-gray-400 font-medium">
                {heroSlides.filter((s) => s.active).length} Active
              </span>
            </div>

            <div className="space-y-3">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`bg-white rounded-xl border p-4 shadow-xs transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    slide.active ? 'border-gray-200' : 'border-gray-200 bg-gray-50/60 opacity-70'
                  }`}
                >
                  {/* Left: Reorder & Number */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveHeroSlide(slide.id, 'up')}
                        disabled={idx === 0}
                        className={`p-1 rounded hover:bg-gray-100 transition ${
                          idx === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 cursor-pointer'
                        }`}
                        title="Move Slide Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveHeroSlide(slide.id, 'down')}
                        disabled={idx === heroSlides.length - 1}
                        className={`p-1 rounded hover:bg-gray-100 transition ${
                          idx === heroSlides.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 cursor-pointer'
                        }`}
                        title="Move Slide Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-black text-xs flex items-center justify-center">
                      #{idx + 1}
                    </div>

                    {/* Mini Visual Palette Box */}
                    <div
                      className={`w-28 h-20 rounded-lg bg-gradient-to-r ${slide.bgGradient} p-2 text-white relative overflow-hidden shrink-0 flex flex-col justify-between shadow-xs`}
                    >
                      {slide.bgImage && (
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
                          style={{ backgroundImage: `url(${slide.bgImage})` }}
                        />
                      )}
                      <span className="text-[8px] font-black uppercase tracking-wider truncate block">
                        {slide.badge}
                      </span>
                      <span className="text-[9px] font-bold line-clamp-2 leading-tight">
                        {slide.title}
                      </span>
                      <span className="text-[8px] opacity-75 truncate">{slide.buttonText} →</span>
                    </div>

                    {/* Slide Information */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs ${
                            slide.badgeColor || 'bg-[#FFB703] text-[#071A33]'
                          }`}
                        >
                          {slide.badge}
                        </span>

                        {slide.tag && (
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                            {slide.tag}
                          </span>
                        )}

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            slide.active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {slide.active ? 'Active on Store' : 'Inactive / Hidden'}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-gray-900 leading-tight">
                        {slide.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 max-w-xl">
                        {slide.subtitle}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-gray-500 pt-0.5">
                        <span>
                          CTA: <strong className="text-gray-800">{slide.buttonText}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Action: <strong className="text-indigo-600">{slide.buttonActionType}</strong>{' '}
                          {slide.buttonActionValue ? `(${slide.buttonActionValue})` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Toggle Active, Edit, Delete */}
                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    <button
                      onClick={() => toggleHeroSlideActive(slide.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                        slide.active
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title="Toggle active status"
                    >
                      {slide.active ? 'Active' : 'Inactive'}
                    </button>

                    <button
                      onClick={() => {
                        setEditingHeroSlide(slide);
                        setBannerEditorModalOpen(true);
                      }}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Edit banner details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {heroSlides.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete slide "${slide.title}"?`)) {
                            deleteHeroSlide(slide.id);
                          }
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-2 rounded-lg text-xs transition cursor-pointer"
                        title="Delete this banner slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Promotional Offer Strip Settings */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-orange-600" />
                  <span>Highlight Offer & Coupon Strip (Under Carousel)</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Appears beneath the carousel to highlight active coupons (e.g. BHARAT100) and instant discounts.
                </p>
              </div>

              <button
                onClick={() => setPromoEditorModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Customize Offer Strip</span>
              </button>
            </div>

            {/* Offer Strip Preview */}
            <div
              className={`bg-gradient-to-r ${
                promoStrip?.bgGradient || 'from-amber-500 via-yellow-500 to-orange-500'
              } rounded-xl p-4 text-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-orange-600 flex items-center justify-center font-black text-lg shadow-xs shrink-0">
                  %
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base leading-tight">
                    {promoStrip?.title}
                  </h4>
                  <p className="text-xs text-orange-950 font-medium">
                    {promoStrip?.discountText}{' '}
                    {promoStrip?.couponCode && (
                      <span className="font-mono font-bold bg-white/30 px-1 py-0.5 rounded">
                        {promoStrip.couponCode}
                      </span>
                    )}{' '}
                    at checkout!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {promoStrip?.primaryButtonText && (
                  <span className="bg-white text-orange-900 font-black text-xs px-3 py-1.5 rounded-lg shadow-xs">
                    {promoStrip.primaryButtonText}
                  </span>
                )}
                {promoStrip?.secondaryButtonText && (
                  <span className="bg-orange-900/30 text-white font-semibold text-xs px-3 py-1.5 rounded-lg">
                    {promoStrip.secondaryButtonText}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span>
                Active Coupon Code:{' '}
                <strong className="font-mono text-gray-900">{promoStrip?.couponCode || 'NONE'}</strong>
              </span>
              <span>
                Visibility Status:{' '}
                <strong className={promoStrip?.active ? 'text-emerald-700' : 'text-red-600'}>
                  {promoStrip?.active ? 'Visible on Homepage' : 'Hidden'}
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PAYMENT CONFIGURATION & UPI SETTINGS (MANAGER ONLY) */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <span>Store Payment Gateway & UPI Settings</span>
                </h2>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Manager Exclusive
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-2xl">
                Configure store UPI ID, Payee Account name, toggle payment methods (Instant UPI, COD, Online Card), and manage fallback QR code. Customers at checkout will automatically see your active payment methods and scan the customized UPI QR code.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-gray-400 font-medium">
                Last updated:{' '}
                {paymentSettings.updatedAt
                  ? new Date(paymentSettings.updatedAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'short',
                    })
                  : 'Default'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Configuration Form (7 cols) */}
            <form onSubmit={handleSavePaymentSettings} className="lg:col-span-7 space-y-5">
              {/* Card 1: Store UPI ID & Payee Account */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-purple-600" />
                    <span>UPI ID & Merchant Details</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setUpiIdInput('8471019962@ybl');
                      setPayeeNameInput('Arun Prakash');
                      setMerchantNameInput('Bharat Kart & Arun Bookstores');
                      showToast('Reset to default store credentials.');
                    }}
                    className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Use Default (8471019962@ybl)</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Store UPI ID (Receiving Account) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={upiIdInput}
                      onChange={(e) => setUpiIdInput(e.target.value)}
                      placeholder="e.g. 8471019962@ybl or store@upi"
                      className="w-full text-xs font-mono font-bold p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                    <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
                      <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded">
                        Active for Checkout QR
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Customer payments sent to this Virtual Payment Address (VPA). Currently: <strong className="text-gray-700">{paymentSettings.upiId}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Payee / Account Holder Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={payeeNameInput}
                      onChange={(e) => setPayeeNameInput(e.target.value)}
                      placeholder="e.g. Arun Prakash"
                      className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      Displayed on customer UPI app prompt
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      UPI Merchant / Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={merchantNameInput}
                      onChange={(e) => setMerchantNameInput(e.target.value)}
                      placeholder="e.g. Bharat Kart Official"
                      className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      Shown on invoices & order confirmations
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Payment Methods Activation (Toggles) */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Customer Payment Methods (Toggle Switches)</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Enable or disable individual payment options. Disabled options are completely hidden from customer checkout.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Toggle 1: Instant UPI / QR */}
                  <div className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-4 ${
                    enableUpiInput ? 'bg-blue-50/40 border-blue-200' : 'bg-gray-50 border-gray-200 opacity-70'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${enableUpiInput ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-gray-900">
                            Instant UPI / Dynamic QR Code
                          </h4>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            enableUpiInput ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {enableUpiInput ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Allows Google Pay, PhonePe, Paytm, BHIM scanning with live generated QR code and UPI auto-fill deep links.
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={enableUpiInput}
                        onChange={(e) => setEnableUpiInput(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Toggle 2: Cash on Delivery (COD) */}
                  <div className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-4 ${
                    enableCodInput ? 'bg-emerald-50/40 border-emerald-200' : 'bg-gray-50 border-gray-200 opacity-70'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${enableCodInput ? 'bg-[#138808] text-white' : 'bg-gray-300 text-gray-600'}`}>
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-gray-900">
                            Cash on Delivery (COD)
                          </h4>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            enableCodInput ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {enableCodInput ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Customers pay cash or scan UPI upon doorstep delivery. If toggled off, COD is completely hidden at checkout.
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={enableCodInput}
                        onChange={(e) => setEnableCodInput(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* Toggle 3: Online Card / Net Banking */}
                  <div className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-4 ${
                    enableCardInput ? 'bg-amber-50/40 border-amber-200' : 'bg-gray-50 border-gray-200 opacity-70'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${enableCardInput ? 'bg-amber-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-gray-900">
                            Online Card / Net Banking (Optional Gateway)
                          </h4>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            enableCardInput ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {enableCardInput ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Enables direct Debit/Credit Card and Internet Banking selection at checkout.
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={enableCardInput}
                        onChange={(e) => setEnableCardInput(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Card 3: Static Fallback UPI QR Code Image */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                      <span>Optional Fallback Static UPI QR Code Image</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Upload an official printed store QR standee image (e.g. BharatPe, PhonePe QR).
                    </p>
                  </div>

                  {customQrImageInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomQrImageInput('');
                        showToast('Reverted to dynamic vector QR generator.');
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                    >
                      Clear & Use Dynamic QR
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Upload Custom QR Image File:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrImageUpload}
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Or Paste Image URL:
                    </label>
                    <input
                      type="url"
                      value={customQrImageInput}
                      onChange={(e) => setCustomQrImageInput(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white font-mono"
                    />
                  </div>

                  {customQrImageInput && (
                    <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-200 flex items-center gap-3">
                      <img
                        src={customQrImageInput}
                        alt="Fallback QR preview"
                        className="w-16 h-16 object-contain bg-white rounded border border-purple-200 p-1"
                      />
                      <div>
                        <p className="text-xs font-bold text-purple-900">Custom QR active</p>
                        <p className="text-[11px] text-purple-700">
                          This QR image will be served to customers at checkout.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">
                  Store Manager: <strong>{currentUser?.name || 'Arun Prakash'}</strong>
                </span>

                <button
                  type="submit"
                  className="bg-[#138808] hover:bg-[#0F6E06] text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save & Apply Payment Settings</span>
                </button>
              </div>
            </form>

            {/* Right Column: Live Customer Preview & QR Testing (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>Live Customer Checkout Preview</span>
                  </h3>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                    Real-time
                  </span>
                </div>

                {/* Simulated Customer QR Card */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center">
                  <div className="p-2 bg-white rounded-xl border-2 border-purple-400/50 shadow-xs relative">
                    <img
                      src={
                        customQrImageInput ||
                        `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                          `upi://pay?pa=${upiIdInput.trim() || '8471019962@ybl'}&pn=${encodeURIComponent(
                            payeeNameInput.trim() || 'Arun Prakash'
                          )}&am=500&cu=INR&tn=Store_Test_Payment`
                        )}&bgcolor=ffffff&color=111827&margin=1`
                      }
                      alt="UPI QR Code Live Preview"
                      className="w-44 h-44 object-contain rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-white shadow-md border border-purple-500 flex items-center justify-center">
                        <span className="text-[8px] font-black text-purple-700 italic">BK</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-gray-900 mt-2 text-center">
                    Pay to: {payeeNameInput.trim() || 'Arun Prakash'}
                  </p>
                  <p className="text-[11px] font-mono text-purple-800 font-bold">
                    {upiIdInput.trim() || '8471019962@ybl'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {merchantNameInput.trim() || 'Bharat Kart Official'}
                  </p>

                  <div className="mt-3 w-full bg-white p-2.5 rounded-lg border border-gray-200 text-xs">
                    <div className="flex items-center justify-between text-gray-600 mb-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400">UPI Intent Link:</span>
                      <button
                        type="button"
                        onClick={handleCopyPreviewUpi}
                        className="text-purple-600 hover:text-purple-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedPreviewUpi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedPreviewUpi ? 'Copied' : 'Copy UPI'}</span>
                      </button>
                    </div>
                    <code className="text-[10px] text-blue-900 break-all font-mono block bg-gray-50 p-1.5 rounded">
                      upi://pay?pa={upiIdInput.trim() || '8471019962@ybl'}&pn={encodeURIComponent(payeeNameInput.trim() || 'Arun Prakash')}
                    </code>
                  </div>
                </div>

                {/* Checkout Status Check */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Checkout Methods Status:
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="flex items-center gap-1.5 font-medium text-gray-800">
                        <QrCode className="w-3.5 h-3.5 text-blue-600" />
                        <span>Instant UPI QR</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        enableUpiInput ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {enableUpiInput ? 'Active on Checkout' : 'Hidden'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="flex items-center gap-1.5 font-medium text-gray-800">
                        <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cash on Delivery</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        enableCodInput ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {enableCodInput ? 'Active on Checkout' : 'Hidden from Checkout'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="flex items-center gap-1.5 font-medium text-gray-800">
                        <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                        <span>Cards & NetBanking</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        enableCardInput ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {enableCardInput ? 'Active on Checkout' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-[11px] text-purple-900 leading-snug">
                  <span className="font-bold block mb-0.5">🔒 Manager Security Notice:</span>
                  Regular customers, store visitors, and staff employees have zero access to modify these payment settings.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EMPLOYEE CREDENTIALS MANAGEMENT */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Employee Accounts Management
              </h2>
              <p className="text-xs text-gray-500">
                Employees can ONLY log in with an ID and password created by you. Add or remove employee logins below.
              </p>
            </div>
            <button
              onClick={() => setShowAddEmpModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Employee Login</span>
            </button>
          </div>

          {/* Employees list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        emp.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {emp.active ? 'Active & Authorized' : 'Deactivated'}
                    </span>
                    <button
                      onClick={() => removeEmployee(emp.id)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded transition"
                      title="Delete employee login"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
                      {emp.avatar ? (
                        <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-emerald-800 text-sm">{emp.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 leading-snug">{emp.name}</h3>
                      <p className="text-xs text-gray-500">{emp.department}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-sans">User ID:</span>
                      <span className="font-bold text-blue-800">{emp.employeeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-sans">Password:</span>
                      <span className="font-bold text-emerald-800">{emp.password}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400 text-[10px]">Created: {emp.createdAt}</span>
                  <button
                    onClick={() => toggleEmployeeStatus(emp.id)}
                    className="text-blue-600 hover:underline font-semibold text-xs"
                  >
                    {emp.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900">Store Orders (Placed by Users & Customers)</h2>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                {orders.length} Orders
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Real-time orders placed by registered users & guests via Online UPI ({MANAGER_CREDENTIALS.upiId}) or Cash on Delivery. Dispatched to Store Email ({MANAGER_CREDENTIALS.email}).
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 text-xs">
              <ShoppingBag className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="font-bold text-gray-700">No customer orders placed yet.</p>
              <p className="text-gray-400 mt-1">
                When users purchase items and scan your UPI QR code or choose COD, orders appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sm text-gray-900">
                        {ord.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ord.paymentMethod === 'ONLINE_UPI'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {ord.paymentMethod === 'ONLINE_UPI'
                          ? `Online UPI (${MANAGER_CREDENTIALS.upiId})`
                          : 'Cash on Delivery'}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(ord.createdAt).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <span>👤 Ordered by User:</span>
                        <strong className="text-blue-900">{ord.customerName}</strong>
                      </span>
                      <span className="text-xs text-gray-600">
                        ✉️ {ord.customerEmail || 'No email provided'}
                      </span>
                      <span className="text-xs text-gray-600">
                        📞 {ord.customerPhone}
                      </span>
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-1.5 py-0.5 rounded">
                        {ord.userId ? `User ID: ${ord.userId}` : 'Guest Checkout'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Address: {ord.address.houseNo}, {ord.address.area}, {ord.address.city} (
                      {ord.address.pincode})
                    </p>

                    {ord.address.location && (
                      <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50/70 p-1.5 rounded-lg border border-blue-100">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="font-semibold text-gray-700">Map Pin:</span>
                        <a
                          href={
                            ord.address.location.mapUrl ||
                            `https://www.openstreetmap.org/?mlat=${ord.address.location.latitude}&mlon=${ord.address.location.longitude}#map=17/${ord.address.location.latitude}/${ord.address.location.longitude}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-mono text-[11px] flex items-center gap-1"
                          title="Open precise customer location in OpenStreetMap"
                        >
                          <span>
                            Lat {ord.address.location.latitude.toFixed(4)}, Lon{' '}
                            {ord.address.location.longitude.toFixed(4)}
                          </span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <div className="pt-2 text-xs text-gray-700 space-y-1">
                      <p className="font-bold text-[11px] text-gray-600 uppercase">Items:</p>
                      {ord.items.map((it) => (
                        <p key={it.product.id} className="text-[11px] text-gray-600 pl-2">
                          • {it.product.title} x {it.quantity} (₹{it.product.price} each)
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-start md:items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                    <div>
                      <p className="text-xs text-gray-400 md:text-right">Total Amount</p>
                      <p className="text-xl font-black text-gray-900 md:text-right">
                        ₹{ord.finalAmount.toLocaleString('en-IN')}
                      </p>
                      {ord.lastUpdatedBy && (
                        <p className="text-[10px] text-gray-500 md:text-right mt-0.5">
                          Last update: <strong className="text-blue-800">{ord.lastUpdatedBy}</strong> ({ord.lastUpdatedByRole || 'Staff'})
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Update Status with Tracking Modal */}
                      <button
                        type="button"
                        onClick={() => setOrderToUpdateStatus(ord)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        title="Update order status, courier AWB, checkpoint location, and customer note"
                      >
                        <Truck className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Update Status & Tracking</span>
                      </button>

                      {/* View live timeline */}
                      <button
                        type="button"
                        onClick={() => {
                          setTrackingOrderNumber(ord.orderNumber);
                          setTrackOrderModalOpen(true);
                        }}
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-xs px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
                        title="View complete customer tracking timeline"
                      >
                        <Search className="w-3.5 h-3.5 text-blue-600" />
                        <span>Audit Trail</span>
                      </button>

                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          updateOrderStatus(ord.id, e.target.value as Order['orderStatus'])
                        }
                        className="text-xs border border-gray-300 rounded-lg p-1.5 bg-gray-50 font-medium"
                      >
                        <option value="Placed">Quick: Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>

                      <a
                        href={`mailto:${MANAGER_CREDENTIALS.email}?subject=${encodeURIComponent(
                          `🛍️ BHARAT KART STORE ORDER #${ord.orderNumber} - ₹${ord.finalAmount}`
                        )}&body=${encodeURIComponent(
                          `Order: #${ord.orderNumber}\n` +
                          `Customer: ${ord.customerName} (${ord.customerPhone})\n` +
                          `Address: ${ord.address.houseNo}, ${ord.address.area}, ${ord.address.city} (${ord.address.pincode})\n` +
                          (ord.address.location ? `Map Location: ${ord.address.location.mapUrl || `https://www.openstreetmap.org/?mlat=${ord.address.location.latitude}&mlon=${ord.address.location.longitude}`}\n` : '') +
                          `Items: ${ord.items.map(i => `${i.product.title} x ${i.quantity}`).join(', ')}\n` +
                          `Payment: ${ord.paymentMethod === 'ONLINE_UPI' ? `Online UPI (${MANAGER_CREDENTIALS.upiId})` : 'COD'}\n` +
                          `Total: ₹${ord.finalAmount}\n` +
                          `Status: ${ord.orderStatus}\n`
                        )}`}
                        className="bg-[#FF7A00] hover:bg-[#E86F00] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        title="Send Order Details to Store Email"
                      >
                        <Mail className="w-3.5 h-3.5 text-white" />
                        <span>Email Order</span>
                      </a>

                      <button
                        onClick={() => setOrderToDelete(ord)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        title="Delete customer order with warning"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STORE SETTINGS & CONFIGURATION */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Store & Payment Configuration
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Configured information as requested by Arun Prakash:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs">
                <span className="text-gray-400 block mb-1">Store Manager Email (Orders):</span>
                <span className="font-bold text-gray-900 text-sm font-mono">{MANAGER_CREDENTIALS.email}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs">
                <span className="text-gray-400 block mb-1">Contact & Support Email:</span>
                <span className="font-bold text-gray-900 text-sm">{MANAGER_CREDENTIALS.email}</span>
              </div>
              <div className="bg-purple-50/60 p-3 rounded-lg border border-purple-200 text-xs flex flex-col justify-between">
                <div>
                  <span className="text-purple-600 block mb-1 font-semibold">Active UPI ID for QR:</span>
                  <span className="font-bold text-purple-900 text-sm font-mono">{paymentSettings.upiId}</span>
                  <span className="text-[10px] text-purple-700 block mt-0.5">
                    Payee: {paymentSettings.payeeName} • COD: {paymentSettings.enableCod ? 'On' : 'Off'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('payments')}
                  className="mt-2 text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Configure Payment System →</span>
                </button>
              </div>
            </div>
          </div>

          {/* FOUNDER & CREATOR PROFILE MANAGEMENT CARD (ARUN PRAKASH) */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={creatorProfile.photoUrl}
                  alt={creatorProfile.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#FFB703] shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-gray-900">
                      Created by {creatorProfile.name}
                    </h3>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Manager Controlled
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Official bottom website showcase • Photo & contacts updated by Manager only
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditCreatorModalOpen(true)}
                className="bg-[#071A33] hover:bg-[#0E284D] text-[#FFB703] font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Update Photo & Details</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[11px] mb-0.5">Contact Email:</span>
                <a
                  href={`mailto:${creatorProfile.email}`}
                  className="font-bold text-orange-600 hover:underline break-all"
                >
                  {creatorProfile.email}
                </a>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[11px] mb-0.5">LinkedIn Profile:</span>
                <a
                  href={creatorProfile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 hover:underline truncate block"
                >
                  {creatorProfile.linkedin}
                </a>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[11px] mb-0.5">Instagram Handle:</span>
                <a
                  href={`https://www.instagram.com/${creatorProfile.instagram.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-rose-600 hover:underline"
                >
                  @{creatorProfile.instagram.replace(/^@/, '')}
                </a>
              </div>
            </div>
          </div>

          {/* STORE CATEGORIES QUICK MANAGEMENT CARD */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-gray-900">Product Categories</h3>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {categories.length} Categories Active
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                You have exclusive rights to add custom categories. They immediately appear in top ribbon navigation, filters, and product catalogs.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('categories')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
              >
                Manage All Categories
              </button>
              <button
                onClick={() => setAddCategoryModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
          </div>

          {/* AD BANNERS QUICK MANAGEMENT CARD */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-gray-900">Homepage Advertising Banners</h3>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {heroSlides.length} Carousel Slides
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                You hold exclusive privileges to publish, edit, or reorder top promotional banners and offer coupons (e.g. BHARAT100).
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('banners')}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer shadow-xs"
              >
                Manage Banners & Offers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT FORM */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                <Package className="w-5 h-5 text-blue-600" />
                <span>Add Product to Bharat Kart</span>
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Name / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NCERT Physics Class 12 Master Guide"
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setAddCategoryModalOpen(true)}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add New</span>
                    </button>
                  </div>
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
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
                    placeholder="499"
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
                    placeholder="799"
                    value={prodMrp}
                    onChange={(e) => setProdMrp(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Product Photo / Image *
                </label>

                {/* File upload from device box */}
                <div className="border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-xl p-3 bg-blue-50/40 text-center transition">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <label className="cursor-pointer font-bold text-blue-700 hover:text-blue-900 underline">
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
                      className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Quick preset images */}
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">Or choose a preset sample photo:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleImages.map((s) => (
                      <button
                        type="button"
                        key={s.label}
                        onClick={() => setProdImage(s.url)}
                        className="text-[10px] bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-2 py-0.5 rounded transition"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description & Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Features, specifications, details..."
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2 rounded-lg shadow"
                >
                  Publish to Bharat Kart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EMPLOYEE FORM */}
      {showAddEmpModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Create Employee Credentials</span>
              </h3>
              <button
                onClick={() => setShowAddEmpModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {empError && (
              <div className="p-2.5 mb-3 bg-red-50 text-red-700 rounded-lg text-xs font-medium border border-red-200">
                {empError}
              </div>
            )}

            <form onSubmit={handleCreateEmployee} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Employee Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Employee Login ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. emp.ramesh"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Assign Password *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh@2026"
                  value={empPassword}
                  onChange={(e) => setEmpPassword(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Department / Role
                </label>
                <input
                  type="text"
                  value={empDepartment}
                  onChange={(e) => setEmpDepartment(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-lg shadow"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT DETAILS */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                <Edit className="w-5 h-5 text-blue-600" />
                <span>Edit Product Details</span>
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
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setAddCategoryModalOpen(true)}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add New</span>
                    </button>
                  </div>
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

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Product Photo / Image *
                </label>

                {/* Upload from Device button */}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo from Device / Camera</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, true)}
                    />
                  </label>
                  <span className="text-[10px] text-gray-400">or paste URL below</span>
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
                  className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2 rounded-lg shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CUSTOMER ORDER WARNING */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Warning: Delete Customer Order?</h3>
                <p className="text-xs text-red-600 font-semibold">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs space-y-1.5 mb-5">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-mono font-bold text-gray-900">{orderToDelete.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Customer:</span>
                <span className="font-semibold text-gray-800">{orderToDelete.customerName} ({orderToDelete.customerPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-bold text-gray-900">₹{orderToDelete.finalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment:</span>
                <span className="font-medium text-gray-700">{orderToDelete.paymentMethod}</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              Are you sure you want to permanently remove this customer order from the Bharat Kart records?
            </p>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel / Keep Order
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteOrder(orderToDelete.id);
                  setOrderToDelete(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Order Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
