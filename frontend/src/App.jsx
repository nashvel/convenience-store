import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import ScrollToTop from './utils/ScrollToTop';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import CategorySidebar from './components/Category/CategorySidebar';
import CategoryNavbar from './components/Category/CategoryNavbar';

import Home from './pages/Navbar/Home';
import Products from './pages/Products/Products';
import ProductDetails from './pages/Products/ProductDetails';
import Cart from './pages/Cart/Cart';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import ForgotPassword from './pages/Auth/ForgotPassword';

import StoresListPage from './pages/Stores/StoresListPage';
import RestaurantsPage from './pages/Restaurants/Restaurants';
import Appliances from './pages/Appliances/Appliances';
import PCBuilder from './pages/PCBuilder/PCBuilder';
import StorePage from './pages/Stores/StorePage';
import SellerLayout from './seller/SellerLayout';
import SellerDashboard from './seller/home/SellerDashboard';
import ManageProducts from './seller/components/product/ManageProducts';
import AddProduct from './seller/components/product/AddProduct';
import Orders from './seller/components/orders/Orders';
import Reviews from './seller/components/reviews/Reviews';
import Chat from './seller/components/chat/Chat';
import ManageStore from './seller/components/store/ManageStore';
import AdminApp from './admin/AdminApp';
import Partners from './pages/Partners/Partners';
import Settings from './pages/Profile/Settings';
import MyOrdersList from './pages/MyOrders/MyOrdersList';
import MyOrderDetail from './pages/MyOrders/MyOrders';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
import TrackOrder from './pages/MyOrders/TrackOrder';
import NotFound from './pages/NotFound';
import PromotionsPage from './pages/Promotions/PromotionsPage';
import RiderPanel from './rider/Home/RiderPanel.jsx';
import PatchNotes from './pages/PatchNotes/PatchNotes';
import FAQPage from './pages/HelpCenter/FAQPage';
import ContactPage from './pages/HelpCenter/ContactPage';
import HelpCenterPage from './pages/HelpCenter/HelpCenterPage';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { NotificationProvider } from './context/NotificationContext';
import { UIProvider } from './context/UIContext';
import { ChatProvider, useChat } from './context/ChatContext';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import ChatPopup from './components/Chat/ChatPopup';
import ProductLoader from './components/ProductLoader';



const MainLayout = () => {
  const { openChats, closeChat, toggleMinimizeChat } = useChat();
  const { user } = useAuth();
  const location = useLocation();
  const showSidebar = location.pathname.startsWith('/products');
  const showCategoryNavbar = location.pathname.startsWith('/products');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">

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
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
      {/* Only show chat heads when user is logged in */}
      {user && (
        <div className="fixed bottom-2 right-2 flex flex-row-reverse items-end gap-4 z-50">
          {Object.values(openChats).map((chat, index) => (
            <ChatPopup key={chat.id || index} chat={chat} onClose={closeChat} onToggleMinimize={toggleMinimizeChat} />
          ))}
        </div>
      )}
    </div>
  );
};



const App = () => (
  <Router>
    <ScrollToTop />
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <StoreProvider>
              <ProductLoader />
              <NotificationProvider>
                <UIProvider>
                  <ChatProvider>
                    <AnimatePresence mode="wait">
                      <Routes>
                        <Route element={<MainLayout />}>
                          <Route path="/" element={<Home />} />
                          <Route path="/patch-notes" element={<PatchNotes />} />
                          <Route path="/faq" element={<FAQPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/help-center" element={<HelpCenterPage />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/product/:id/:productName" element={<ProductDetails />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/stores" element={<StoresListPage />} />
                          <Route path="/stores/:storeId/:storeName" element={<StorePage />} />
                          <Route path="/restaurants" element={<RestaurantsPage />} />
                          <Route path="/appliances" element={<Appliances />} />
                          <Route path="/pc-builder" element={<PCBuilder />} />
                          <Route path="/promotions" element={<PromotionsPage />} />
                          <Route path="/partners" element={<Partners />} />
                          <Route path="/login" element={<SignIn />} />
                          <Route path="/signup" element={<SignUp />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                          <Route path="/my-orders" element={<MyOrdersList />} />
                          <Route path="/my-orders/:id" element={<MyOrderDetail />} />
                          <Route path="/track-order/:id" element={<TrackOrder />} />
                          <Route path="/order-success" element={<OrderSuccess />} />
                          <Route path="/profile/settings" element={<Settings />} />
                        </Route>

                        <Route path="/seller" element={<SellerLayout />}>
                          <Route path="dashboard" element={<SellerDashboard />} />
                          <Route path="products/manage" element={<ManageProducts />} />
                          <Route path="products/add" element={<AddProduct />} />
                          <Route path="orders" element={<Orders />} />
                          <Route path="reviews" element={<Reviews />} />
                          <Route path="chat" element={<Chat />} />
                          <Route path="manage-store" element={<ManageStore />} />
                        </Route>
                        <Route path="/admin/*" element={<AdminApp />} />
                        <Route path="/rider/*" element={<RiderPanel />} />
                        
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AnimatePresence>
                  </ChatProvider>
                </UIProvider>
              </NotificationProvider>
            </StoreProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
      
      {/* Hot Toast with Blue Theme */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#3B82F6',
            color: '#FFFFFF',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#FFFFFF',
              secondary: '#3B82F6',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: '#FFFFFF',
            },
            iconTheme: {
              primary: '#FFFFFF',
              secondary: '#EF4444',
            },
          },
        }}
      />
    </ThemeProvider>
  </Router>
);







export default App;
