import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import GlobalStyle from './components/styles/GlobalStyle';
import { theme } from './components/styles/Theme';
import Navbar from './components/Navbar';
import Home from './pages/Navbar/Home';
import Products from './pages/Products/Products';
import ProductDetails from './pages/Products/ProductDetails';
import Cart from './pages/Cart/Cart';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import ForgotPassword from './pages/Auth/ForgotPassword';
import MyOrders from './pages/Navbar/MyOrders';
import Notifications from './pages/Navbar/Notifications';
import ClientDashboard from './client/page/Dashboard';
import Footer from './components/Footer';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';

// Layout component to conditionally render Navbar and Footer
const AppLayout = () => {
  const location = useLocation();
  const isClientRoute = location.pathname.startsWith('/client-dashboard');

  return (
    <>
      {!isClientRoute && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
        </Routes>
      </AnimatePresence>
      {!isClientRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ProductProvider>
        <CartProvider>
          <Router>
            <GlobalStyle />
            <AppLayout />
          </Router>
        </CartProvider>
      </ProductProvider>
    </ThemeProvider>
  );
}

export default App;
