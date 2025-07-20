import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTimes, FaShoppingBag, FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';



const Footer = () => {
  const { settings } = useSettings();

  const socialLinks = [
    { name: 'Facebook', key: 'facebook_url', icon: FaFacebook, color: 'text-blue-600' },
    { name: 'Instagram', key: 'instagram_url', icon: FaInstagram, color: 'text-pink-500' },
    { name: 'X', key: 'twitter_url', icon: FaTimes, color: 'text-gray-800' },
  ];

  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      
      <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <FaShoppingBag className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {settings.app_name || 'EcomXpert'}
                </h3>
                <p className="text-gray-600 text-sm">Your Premium Shopping Experience</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed max-w-md">
              {settings.app_description || 'Discover amazing products from trusted stores. Fast delivery, secure payments, and exceptional customer service - all in one place.'}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <FaPhone className="text-blue-600 text-sm" />
                </div>
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                  <FaEnvelope className="text-purple-600 text-sm" />
                </div>
                <span className="text-sm">support@ecomxpert.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                  <FaMapMarkerAlt className="text-green-600 text-sm" />
                </div>
                <span className="text-sm">123 Commerce St, City, State 12345</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <h4 className="text-xl font-bold text-gray-800">Quick Links</h4>
            </div>
            <ul className="space-y-4">
              <li>
                <Link to="/products" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-all duration-200 group">
                  <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors"></div>
                  <span className="group-hover:translate-x-1 transition-transform">All Products</span>
                </Link>
              </li>
              <li>
                <Link to="/stores" className="flex items-center gap-3 text-gray-600 hover:text-purple-600 transition-all duration-200 group">
                  <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:bg-purple-600 transition-colors"></div>
                  <span className="group-hover:translate-x-1 transition-transform">Stores</span>
                </Link>
              </li>
              <li>
                <Link to="/promotions" className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition-all duration-200 group">
                  <div className="w-2 h-2 bg-green-500 rounded-full group-hover:bg-green-600 transition-colors"></div>
                  <span className="group-hover:translate-x-1 transition-transform">Promotions</span>
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="flex items-center gap-3 text-gray-600 hover:text-yellow-600 transition-all duration-200 group">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full group-hover:bg-yellow-600 transition-colors"></div>
                  <span className="group-hover:translate-x-1 transition-transform">My Orders</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Social */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
              <h4 className="text-xl font-bold text-gray-800">Connect</h4>
            </div>
            
            {/* Support Links */}
            <ul className="space-y-4">
              <li>
                <Link to="/contact" className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition-all duration-200 group">
                  <div className="w-2 h-2 bg-red-500 rounded-full group-hover:bg-red-600 transition-colors"></div>
                  <span className="group-hover:translate-x-1 transition-transform">Contact Us</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="flex items-center gap-3 text-gray-600 hover:text-indigo-600 transition-all duration-200 group">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full group-hover:bg-indigo-600 transition-colors"></div>
                  <span className="group-hover:translate-x-1 transition-transform">FAQ</span>
                </Link>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-gray-700">Follow Us</h5>
              <div className="flex gap-4">
                {socialLinks.map((link) => {
                  const url = settings[link.key];
                  const isEnabled = !!url && url !== '#';
                  if (!isEnabled) return null;

                  return (
                    <a
                      key={link.name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit our ${link.name} page`}
                      className="p-3 bg-white border border-gray-200 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:border-transparent rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                    >
                      <link.icon className="text-gray-600 group-hover:text-white text-xl" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <FaHeart className="text-red-500 text-sm" />
              <span className="text-sm">
                Made with love for amazing shopping experiences
              </span>
            </div>
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} {settings.app_name || 'EcomXpert'}. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer
