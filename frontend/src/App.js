import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import GlobalStyle from './components/styles/GlobalStyle';
import { theme } from './components/styles/Theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ProductProvider>
        <CartProvider>
          <Router>
            <GlobalStyle />
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
            </AnimatePresence>
          </Router>
        </CartProvider>
      </ProductProvider>
    </ThemeProvider>
  );
}

export default App;
