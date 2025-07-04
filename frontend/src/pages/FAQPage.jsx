import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaSearch } from 'react-icons/fa';

const faqData = [
  {
    category: 'Account Management',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'You can create an account by clicking the "Sign In" button in the navbar, then selecting "Create Account." Fill in your details, and you\'re all set!',
      },
      {
        q: 'How do I reset my password?',
        a: 'On the Sign In page, click the "Forgot Password?" link. Enter your email address, and we will send you instructions to reset your password.',
      },
      {
        q: 'How can I update my profile information?',
        a: 'Once logged in, go to your profile page by clicking the user icon in the navbar. From there, you can edit your name, address, and other personal details.',
      },
    ],
  },
  {
    category: 'Ordering & Payment',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and other secure payment gateways.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'You can cancel your order within 30 minutes of placing it. After that, it may have already been processed. Please visit the "My Orders" page to see the status of your order or contact our support team.',
      },
      {
        q: 'How do I use a discount code?',
        a: 'You can apply your discount code at the checkout page. Enter the code in the designated field, and the discount will be applied to your total.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    questions: [
      {
        q: 'What are your shipping options?',
        a: 'We offer standard, expedited, and next-day shipping options. Costs and delivery times vary based on your location and the selected option. You can see the details at checkout.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order has shipped, you will receive an email with a tracking number. You can use this number on the carrier\'s website or on our "My Orders" page to track your delivery.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently, we only ship within the country. We are working on expanding our shipping options to include international destinations in the near future.',
      },
    ],
  },
];

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full py-5 text-left text-lg font-medium text-gray-800"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown className="text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-8 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqData = faqData
    .map(category => ({
      ...category,
      questions: category.questions.filter(
        q =>
          q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.a.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(category => category.questions.length > 0);

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Can't find the answer you're looking for? We're here to help.
          </p>
        </div>

        <div className="mt-12">
          <div className="relative">
            <input
              type="search"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              aria-label="Search FAQ"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
          </div>
        </div>

        <div className="mt-16">
          {filteredFaqData.map(category => (
            <div key={category.category} className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-6">{category.category}</h2>
              <div className="space-y-1">
                {category.questions.map((item, index) => (
                  <AccordionItem
                    key={index}
                    question={item.q}
                    answer={item.a}
                    isOpen={openIndex === `${category.category}-${index}`}
                    onClick={() => setOpenIndex(openIndex === `${category.category}-${index}` ? null : `${category.category}-${index}`)}
                  />
                ))}
              </div>
            </div>
          ))}

          {filteredFaqData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No questions found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
