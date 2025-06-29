import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const Footer = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_URL}/public-settings`);
        setSettings(response.data);
      } catch (error) {
        console.error('Failed to fetch public settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const socialLinks = [
    { name: 'Facebook', key: 'facebook_url', icon: FaFacebook },
    { name: 'Twitter', key: 'twitter_url', icon: FaTwitter },
    { name: 'Instagram', key: 'instagram_url', icon: FaInstagram },
    { name: 'LinkedIn', key: 'linkedin_url', icon: FaLinkedin },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold text-blue-500">{settings.app_name || 'NashQuickMart'}</h3>
            <p className="text-gray-400 text-sm" style={{ whiteSpace: 'pre-line' }}>
              {settings.app_description || 'Your one-stop shop for quick and convenient shopping. Delivering quality products right to your doorstep.'}
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-md font-semibold tracking-wider uppercase text-gray-400">Quick Links</h4>
            <ul className="mt-4 space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/stores" className="text-gray-400 hover:text-white transition-colors">Stores</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h4 className="text-md font-semibold tracking-wider uppercase text-gray-400">Legal</h4>
            <ul className="mt-4 space-y-3">
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-400 hover:text-white transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h4 className="text-md font-semibold tracking-wider uppercase text-gray-400">Follow Us</h4>
            <div className="flex mt-4 space-x-5">
              {socialLinks.map(({ name, key, icon: Icon }) => {
                const url = settings[key];
                const isEnabled = !!url;
                return (
                  <a
                    key={name}
                    href={isEnabled ? url : '#'}
                    target={isEnabled ? '_blank' : '_self'}
                    rel={isEnabled ? 'noopener noreferrer' : undefined}
                    aria-label={name}
                    className={`transition-colors ${
                      isEnabled
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 cursor-not-allowed opacity-50'
                    }`}
                    onClick={!isEnabled ? (e) => e.preventDefault() : undefined}
                  >
                    <Icon size={22} />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} NashQuickMart. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
