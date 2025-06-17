import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

import GlobalStyle from './components/styles/GlobalStyle';
import { theme as customerTheme } from './components/styles/Theme';
import { neumorphicTheme } from './client/styles/neumorphicTheme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Navbar/Home';
import Products from './pages/Products/Products';
import ProductDetails from './pages/Products/ProductDetails';
import Cart from './pages/Cart/Cart';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import ForgotPassword from './pages/Auth/ForgotPassword';
import MyOrders from './pages/Navbar/MyOrders';
import Notifications from './pages/Navbar/Notifications';
import StoresListPage from './pages/Stores/StoresListPage';
import StorePage from './pages/Stores/StorePage';
import SellerDashboard from './seller/SellerDashboard';
import Partners from './pages/Partners/Partners';


import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';

const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    ${({ theme }) => (theme.neumorphism ? theme.neumorphism(false, '15px') : '')};
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-weight: 600;
    border-radius: 15px;
  }

  .Toastify__progress-bar {
    background: ${({ theme }) => theme.primary};
  }

  .Toastify__close-button {
    color: ${({ theme }) => theme.text};
  }
`;

const AppContent = () => {
  const location = useLocation();
  const isSellerRoute = location.pathname.startsWith('/seller/dashboard');
  const theme = isSellerRoute ? neumorphicTheme : customerTheme;

  return (
    <AuthProvider>
      <CartProvider>
        <StoreProvider>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <StyledToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            {!isSellerRoute && <Navbar />}
            <AnimatePresence mode="wait">
              <Routes>
                {/* Client Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/stores" element={<StoresListPage />} />
                <Route path="/stores/:storeId" element={<StorePage />} />
                <Route path="/partners" element={<Partners />} />

                {/* User Authentication Routes */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* User Profile Routes */}
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/notifications" element={<Notifications />} />

                {/* Seller Dashboard Routes */}
                <Route path="/seller/dashboard/*" element={<SellerDashboard />} />
              </Routes>
            </AnimatePresence>
            {!isSellerRoute && <Footer />}
          </ThemeProvider>
        </StoreProvider>
      </CartProvider>
    </AuthProvider>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
