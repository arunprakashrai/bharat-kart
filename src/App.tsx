import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { BannerSlider } from './components/BannerSlider';
import { PromoStripBanner } from './components/PromoStripBanner';
import { ProductFeed } from './components/ProductFeed';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ManagerPortal } from './components/ManagerPortal';
import { EmployeePortal } from './components/EmployeePortal';
import { MyOrdersView } from './components/MyOrdersView';
import { ContactModal } from './components/ContactModal';
import { ProfileAvatarModal } from './components/ProfileAvatarModal';
import { OrderStatusUpdateModal } from './components/OrderStatusUpdateModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { EditCreatorProfileModal } from './components/EditCreatorProfileModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { BannerEditorModal } from './components/BannerEditorModal';
import { PromoOfferEditorModal } from './components/PromoOfferEditorModal';
import { Footer } from './components/Footer';
import { FloatingWidgets } from './components/FloatingWidgets';
import { Zap, ShieldCheck, Award, Sparkles, BookOpen } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    currentView,
    selectedProductForDetail,
    setSelectedProductForDetail,
    setSelectedCategory,
    setContactModalOpen,
  } = useApp();

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-gray-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Header />

      {/* Category Ribbon */}
      <CategoryNav />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'shop' && (
          <div>
            {/* Top Carousel Banner */}
            <BannerSlider />

            {/* Quick Value Deals Highlight Banner */}
            <PromoStripBanner />

            {/* Product Feed Grid with Filters */}
            <ProductFeed />
          </div>
        )}

        {currentView === 'manager-dashboard' && <ManagerPortal />}
        {currentView === 'employee-dashboard' && <EmployeePortal />}
        {currentView === 'my-orders' && <MyOrdersView />}
      </main>

      {/* Modals & Slide-overs */}
      <AuthModal />
      <CartDrawer />
      <CheckoutModal />
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          onClose={() => setSelectedProductForDetail(null)}
        />
      )}
      <ContactModal />
      <ProfileAvatarModal />
      <OrderStatusUpdateModal />
      <TrackOrderModal />
      <EditCreatorProfileModal />
      <AddCategoryModal />
      <BannerEditorModal />
      <PromoOfferEditorModal />

      {/* Floating Action Buttons & Toasts */}
      <FloatingWidgets />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
