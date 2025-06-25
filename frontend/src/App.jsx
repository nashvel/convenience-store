import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';



import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Navbar/Home';
import Products from './pages/Products/Products';
import ProductDetails from './pages/Products/ProductDetails';
import Cart from './pages/Cart/Cart';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Notifications from './pages/Navbar/Notifications';
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


import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { NotificationProvider } from './context/NotificationContext';





const AppContent = () => {
  const location = useLocation();
  const isSellerRoute = location.pathname.startsWith('/seller/dashboard');
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <StoreProvider>
          <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              toastClassName="bg-white text-gray-800 font-semibold rounded-xl shadow-lg"
              progressClassName="bg-blue-600"
            />
            {!isSellerRoute && !isAdminRoute && <Navbar />}
            <div className={location.pathname.startsWith('/products') ? 'h-28' : 'h-16'} />
            <main className="flex-1">
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Client Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id/:productName" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/stores" element={<StoresListPage />} />
                  <Route path="/stores/:storeId/:storeName" element={<StorePage />} />
                  <Route path="/restaurants" element={<RestaurantsPage />} />
                  <Route path="/partners" element={<Partners />} />

                  {/* User Authentication Routes */}
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* User Profile Routes */}
                  <Route path="/my-orders" element={<MyOrdersList />} />
                  <Route path="/my-orders/:id" element={<MyOrderDetail />} />
                  <Route path="/track-order/:id" element={<TrackOrder />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/profile/settings" element={<Settings />} />

                  {/* Seller Dashboard Routes */}
                  <Route path="/seller/dashboard/*" element={<SellerDashboard />} />

                  {/* Admin Dashboard Routes */}
                  <Route path="/admin/*" element={<AdminApp />} />
                </Routes>
              </AnimatePresence>
            </main>
            {!isSellerRoute && !isAdminRoute && <Footer />}
          </div>
        </StoreProvider>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

// Forcing a full re-compile to fix a caching issue.
const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
