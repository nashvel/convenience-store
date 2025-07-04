import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';
import ScrollToTop from './utils/ScrollToTop';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CategorySidebar from './components/CategorySidebar';
import CategoryNavbar from './components/CategoryNavbar';

import Home from './pages/Navbar/Home';
import Products from './pages/Products/Products';
import ProductDetails from './pages/Products/ProductDetails';
import Cart from './pages/Cart/Cart';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import ForgotPassword from './pages/Auth/ForgotPassword';

import StoresListPage from './pages/Stores/StoresListPage';
import RestaurantsPage from './pages/Restaurants/Restaurants';
import StorePage from './pages/Stores/StorePage';
import SellerDashboard from './seller/SellerDashboard';
import AdminApp from './admin/AdminApp';
import Partners from './pages/Partners/Partners';
import Settings from './pages/Profile/Settings';
import MyOrdersList from './pages/MyOrders/MyOrdersList';
import MyOrderDetail from './pages/MyOrders/MyOrders';
import TrackOrder from './pages/MyOrders/TrackOrder';
import PromotionsPage from './pages/Promotions/PromotionsPage';
import PatchNotes from './pages/PatchNotes';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { NotificationProvider } from './context/NotificationContext';
import { UIProvider } from './context/UIContext';
import { ChatProvider, useChat } from './context/ChatContext';
import ChatPopup from './components/ChatPopup';

const AllRoutes = () => (
  <AnimatePresence mode="wait">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/patch-notes" element={<PatchNotes />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id/:productName" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/stores" element={<StoresListPage />} />
      <Route path="/stores/:storeId/:storeName" element={<StorePage />} />
      <Route path="/restaurants" element={<RestaurantsPage />} />
      <Route path="/promotions" element={<PromotionsPage />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/my-orders" element={<MyOrdersList />} />
      <Route path="/my-orders/:id" element={<MyOrderDetail />} />
      <Route path="/track-order/:id" element={<TrackOrder />} />

      <Route path="/profile/settings" element={<Settings />} />
      <Route path="/seller/dashboard/*" element={<SellerDashboard />} />
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  </AnimatePresence>
);

const MainLayout = ({ children }) => {
  const { openChats, closeChat, toggleMinimizeChat } = useChat();
  const location = useLocation();
  const showSidebar = location.pathname.startsWith('/products');
  const showCategoryNavbar = location.pathname.startsWith('/products');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="bg-white text-gray-800 font-semibold rounded-xl shadow-lg"
        progressClassName="bg-red-500"
      />
      <Navbar />
      {showCategoryNavbar && <CategoryNavbar />}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1">
          {showSidebar && (
            <aside className="w-80 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-6 border-r border-gray-200">
              <CategorySidebar />
            </aside>
          )}
          <main className={`flex-1 ${showSidebar ? 'pl-6' : ''}`}>
            {children}
          </main>
        </div>
      </div>
      <Footer />
      <div className="fixed bottom-0 right-4 flex flex-row-reverse items-end gap-4 z-50">
        {Object.values(openChats).map(chat => (
          <ChatPopup key={chat.id} chat={chat} onClose={closeChat} onToggleMinimize={toggleMinimizeChat} />
        ))}
      </div>
    </div>
  );
};

const AppLayout = () => {
  const location = useLocation();
  const isSellerRoute = location.pathname.startsWith('/seller/dashboard');
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isSellerRoute || isAdminRoute) {
    return (
      <main className="flex-1">
        <AllRoutes />
      </main>
    );
  }

  return (
    <MainLayout>
      <AllRoutes />
    </MainLayout>
  );
};

const AppContent = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <StoreProvider>
            <UIProvider>
              <ChatProvider>
                <AppLayout />
              </ChatProvider>
            </UIProvider>
          </StoreProvider>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
};

const App = () => (
  <Router>
    <ScrollToTop />
    <AppContent />
  </Router>
);

export default App;
