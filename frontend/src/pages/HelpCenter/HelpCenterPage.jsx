import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuestionCircle, FaUndo, FaRegTimesCircle, FaHeadset, FaChevronDown, FaBook, FaSearch } from 'react-icons/fa';

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
        q: 'How do I use a discount code?',
        a: 'You can apply your discount code at the checkout page. Enter the code in the designated field, and the discount will be applied to your total.',
      },
    ],
  },
];

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full py-4 text-left font-medium text-gray-700 hover:text-gray-900"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <FaChevronDown className={`text-gray-500 transition-colors ${isOpen ? 'text-blue-600' : ''}`} />
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
            <p className="pb-4 pr-8 text-gray-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HelpCenterPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const contentSections = [
    {
      id: 'returns',
      icon: <FaUndo className="text-blue-500" />,
      title: 'Returns Policy',
      content: [
        'You can return eligible items within 6 days of receiving your order. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.',
        'Several types of goods are exempt from being returned, such as perishable goods, intimate or sanitary goods, hazardous materials, or flammable liquids or gases.',
        'To complete your return, we require a receipt or proof of purchase. Please do not send your purchase back to the manufacturer.',
      ],
    },
    {
      id: 'cancellation',
      icon: <FaRegTimesCircle className="text-blue-500" />,
      title: 'Easy Cancellation',
      content: [
        'You can cancel your order for any reason before it has been marked as \'Ready to Ship\' by the seller. Once an order is ready for shipment, it can no longer be canceled.',
        'To cancel an order, go to your \'My Orders\' page, find the order you wish to cancel, and click the \'Cancel Order\' button. If the button is not available, it means the order is past the cancellation window.',
      ],
    },
    {
      id: 'support',
      icon: <FaHeadset className="text-blue-500" />,
      title: 'EcomXpert Support',
      content: [
        'Our dedicated Customer Service team is here to ensure you have a great shopping experience. We are available 24/7 to assist you with any questions or concerns.',
        'You can reach us through the in-app chat, by emailing support@ecomxpert.com, or by calling our toll-free number at 1-800-ECOM-XPT.',
      ],
    },
  ];

  const filteredFaqData = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) || q.a.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(category => category.questions.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="text-center mb-16">
        <FaQuestionCircle className="mx-auto text-5xl text-blue-600 mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Help Center</h1>
        <p className="mt-4 text-lg text-gray-600">Your questions, answered. We are here to help you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-12 gap-y-8">
        <aside className="lg:col-span-1 lg:sticky top-24 self-start">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[...contentSections, {id: 'faq', icon: <FaBook className="text-blue-500"/>, title: 'FAQs'}].map(section => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="flex items-center gap-3 text-gray-600 hover:text-blue-600 font-medium transition-colors">
                    <div className="flex-shrink-0">{section.icon}</div>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="space-y-16">
            {contentSections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl text-blue-500">{section.icon}</div>
                  <h2 className="text-3xl font-bold text-gray-800">{section.title}</h2>
                </div>
                <div className="prose max-w-none text-gray-600 leading-relaxed space-y-4">
                  {section.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
              </section>
            ))}

            <section id="faq" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl text-blue-500"><FaBook /></div>
                <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
              </div>
              <div className="relative mb-6">
                <input 
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="space-y-6">
                {filteredFaqData.length > 0 ? filteredFaqData.map((cat) => (
                  <div key={cat.category}>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">{cat.category}</h3>
                    <div className="border border-gray-200 rounded-lg p-2 bg-white">
                      {cat.questions.map((item, index) => (
                        <AccordionItem
                          key={index}
                          question={item.q}
                          answer={item.a}
                          isOpen={openFaq === `${cat.category}-${index}`}
                          onClick={() => setOpenFaq(openFaq === `${cat.category}-${index}` ? null : `${cat.category}-${index}`)}
                        />
                      ))}
                    </div>
                  </div>
                )) : <p className="text-gray-500 text-center py-4">No questions found matching your search.</p>}
              </div>
            </section>
          </div>
        </main>
      </div>
    </motion.div>
  );
};

export default HelpCenterPage;
