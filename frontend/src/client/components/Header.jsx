import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaBell, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: ${({ theme }) => theme.body};
  height: 100px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  width: 350px;
  ${({ theme }) => theme.neumorphismPressed('15px')};

  svg {
    color: ${({ theme }) => theme.textSecondary};
    margin-right: 10px;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
  width: 100%;
  font-size: 1rem;
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconButton = styled.button`
  ${({ theme }) => theme.neumorphism(false, '50%')};
  border: none;
  cursor: pointer;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1.2rem;
  position: relative;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }

  &:active {
    ${({ theme }) => theme.neumorphismPressed('50%')};
    color: ${({ theme }) => theme.primary};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const UserMenu = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 65px;
  right: 0;
  width: 220px;
  z-index: 1000;
  ${({ theme }) => theme.neumorphism(false, '15px')};
  padding: 10px 0;
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '-10px')});
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
`;

const DropdownItem = styled.a`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  font-size: 0.95rem;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <HeaderContainer>
      <SearchBar>
        <FaSearch />
        <SearchInput placeholder="Search..." />
      </SearchBar>
      <UserActions>
        <IconButton>
          <FaBell />
          <NotificationBadge>3</NotificationBadge>
        </IconButton>
        <UserMenu ref={dropdownRef}>
          <IconButton onClick={() => setDropdownOpen(!isDropdownOpen)}>
            <FaUserCircle />
          </IconButton>
          <DropdownMenu $isOpen={isDropdownOpen}>
            <DropdownItem href="#">
              <FaUserCircle /> Profile
            </DropdownItem>
            <DropdownItem href="#">
              <FaCog /> Settings
            </DropdownItem>
            <DropdownItem href="#">
              <FaSignOutAlt /> Logout
            </DropdownItem>
          </DropdownMenu>
        </UserMenu>
      </UserActions>
    </HeaderContainer>
  );
};

export default Header;
