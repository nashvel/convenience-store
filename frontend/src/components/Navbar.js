import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaShoppingCart, FaHome, FaStore, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { totalItems } = useContext(CartContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <NavContainer 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      $isScrolled={isScrolled}
    >
      <NavContent>
        <LogoContainer to="/">
          <LogoText>Quick<LogoSpan>Mart</LogoSpan></LogoText>
        </LogoContainer>

        <NavLinks $mobileMenuOpen={mobileMenuOpen}>
          <NavLink 
            to="/"
            $isActive={location.pathname === '/'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHome /> <span>Home</span>
          </NavLink>
          <NavLink 
            to="/products"
            $isActive={location.pathname === '/products'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaStore /> <span>Products</span>
          </NavLink>
          <NavLink 
            to="/account"
            $isActive={location.pathname === '/account'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUser /> <span>Account</span>
          </NavLink>
        </NavLinks>

        <NavActions>
          <IconButton 
            onClick={() => setSearchOpen(!searchOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaSearch />
          </IconButton>
          <CartButton 
            to="/cart"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaShoppingCart />
            {totalItems > 0 && <CartBadge>{totalItems}</CartBadge>}
          </CartButton>
          <MobileMenuButton 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </MobileMenuButton>
        </NavActions>
      </NavContent>

      <AnimatePresence>
        {searchOpen && (
          <SearchContainer
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <SearchForm onSubmit={handleSearchSubmit}>
              <SearchInput 
                type="text" 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <SearchButton type="submit">
                <FaSearch />
              </SearchButton>
            </SearchForm>
          </SearchContainer>
        )}
      </AnimatePresence>
    </NavContainer>
  );
};

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.navHeight};
  background-color: ${({ theme, $isScrolled }) => 
    $isScrolled ? theme.background : 'transparent'};
  box-shadow: ${({ theme, $isScrolled }) => 
    $isScrolled ? theme.shadow : 'none'};
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: ${({ $isScrolled }) => 
    $isScrolled ? 'blur(10px)' : 'none'};
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogoContainer = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin: 0;
`;

const LogoSpan = styled.span`
  color: ${({ theme }) => theme.secondary};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    position: absolute;
    top: ${({ theme }) => theme.navHeight};
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: ${({ theme }) => theme.background};
    box-shadow: ${({ theme }) => theme.shadow};
    padding: 20px;
    gap: 15px;
    transform: ${({ $mobileMenuOpen }) => 
      $mobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)'}
    opacity: ${({ $mobileMenuOpen }) => 
      $mobileMenuOpen ? '1' : '0'};
    visibility: ${({ $mobileMenuOpen }) => 
      $mobileMenuOpen ? 'visible' : 'hidden'};
    transition: transform 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
    z-index: -1;
  }
`;

const NavLink = styled(motion(Link))`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.primary : theme.text};
  text-decoration: none;
  font-weight: ${({ $isActive }) => 
    $isActive ? '600' : '400'};
  padding: 5px 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${({ $isActive }) => 
      $isActive ? '100%' : '0'};
    height: 2px;
    background-color: ${({ theme }) => theme.primary};
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
  
  @media (max-width: 768px) {
    padding: 10px 0;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const IconButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

const CartButton = styled(motion(Link))`
  position: relative;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  text-decoration: none;
`;

const CartBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileMenuButton = styled(IconButton)`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const SearchContainer = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.background};
  padding: 15px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const SearchForm = styled.form`
  display: flex;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const SearchButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 0 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    filter: brightness(1.1);
  }
`;

export default Navbar;