import React from 'react';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: #2c3e50; /* Dark blue-gray */
  color: #ecf0f1; /* Light gray */
  padding: 3rem 2rem;
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SocialLinks = styled.div`
  margin-bottom: 1.5rem;
  
  a {
    color: #ecf0f1;
    font-size: 1.8rem;
    margin: 0 1rem;
    transition: color 0.3s ease;

    &:hover {
      color: #3498db; /* Bright blue */
    }
  }
`;

const CopyrightText = styled.p`
  font-size: 0.9rem;
  color: #bdc3c7; /* Medium gray */
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <SocialLinks>
          <a href="#" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
        </SocialLinks>
        <CopyrightText>
          © {new Date().getFullYear()} NashQuickMart. All Rights Reserved.
        </CopyrightText>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
