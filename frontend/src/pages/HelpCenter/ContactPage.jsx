import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Contact Us</h1>
          <p className="mt-4 text-xl text-gray-500">We'd love to hear from you. Get in touch with us.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 lg:col-span-1">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaMapMarkerAlt className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Our Address</h3>
                <p className="mt-1 text-gray-600">123 Innovation Drive, Tech City, 12345</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaEnvelope className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                <a href="mailto:support@ecomxpert.com" className="mt-1 text-gray-600 hover:text-primary">support@ecomxpert.com</a>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaPhoneAlt className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                <a href="tel:+1234567890" className="mt-1 text-gray-600 hover:text-primary">+1 (234) 567-890</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label htmlFor="full-name" className="sr-only">Full Name</label>
                <input
                  type="text"
                  name="full-name"
                  id="full-name"
                  autoComplete="name"
                  placeholder="Full Name"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email Address"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="sr-only">Phone</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  autoComplete="tel"
                  placeholder="Phone Number (Optional)"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Your Message"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                  required
                ></textarea>
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
