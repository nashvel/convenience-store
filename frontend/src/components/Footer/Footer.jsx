import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTimes } from 'react-icons/fa'; // Using FaTimes for X/Twitter for consistency
import { useSettings } from '../../context/SettingsContext';



const Footer = () => {
  const { settings } = useSettings();

  const socialLinks = [
    { name: 'Facebook', key: 'facebook_url', icon: FaFacebook, color: 'text-blue-600' },
    { name: 'Instagram', key: 'instagram_url', icon: FaInstagram, color: 'text-pink-500' },
    { name: 'X', key: 'twitter_url', icon: FaTimes, color: 'text-gray-800' },
  ];

  return (
    <footer className="bg-gray-50 text-gray-600">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">{settings.app_name || 'EcomXpert'}</h3>
            <p className="text-sm">
              {settings.app_description || 'Your one-stop shop for quick and convenient shopping. Delivering quality products right to your doorstep.'}
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-gray-800 tracking-wider uppercase">Shop</h4>
            <ul className="mt-4 space-y-3">
              <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/stores" className="hover:text-primary transition-colors">Stores</Link></li>
              <li><Link to="/promotions" className="hover:text-primary transition-colors">Promotions</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-gray-800 tracking-wider uppercase">Support</h4>
            <ul className="mt-4 space-y-3">
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/my-orders" className="hover:text-primary transition-colors">My Orders</Link></li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h4 className="font-semibold text-gray-800 tracking-wider uppercase">Follow Us</h4>
            <div className="flex mt-4 space-x-5">
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
                    className={`${link.color} transition-all duration-300 hover:opacity-80`}
                  >
                    <link.icon size={22} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} {settings.app_name || 'EcomXpert'}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer
