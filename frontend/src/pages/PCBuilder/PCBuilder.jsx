import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDesktop, FaHdd, FaMemory, FaMicrochip, FaRegCheckCircle, FaShoppingCart } from 'react-icons/fa';

// --- Mock Data for PC Components ---
const components = {
  systemUnits: [
    { id: 'su-1', name: 'Stealth Gamer', price: 79950, image: '/images/pc/systemunit1.png', spec: 'Ryzen 5 7600X, RTX 4060, 16GB DDR5' },
    { id: 'su-2', name: 'Arctic Pro', price: 124950, image: '/images/pc/systemunit2.png', spec: 'Core i7-13700K, RX 7800 XT, 32GB DDR5' },
    { id: 'su-3', name: 'RGB Ultimate', price: 199950, image: '/images/pc/systemunit3.png', spec: 'Ryzen 9 7950X3D, RTX 4090, 64GB DDR5' },
  ],
  monitors: [
    { id: 'monitor-1', name: '27" 1440p 165Hz IPS', price: 14950, image: '/images/pc/monitor1.png' },
    { id: 'monitor-2', name: '34" Ultrawide 144Hz VA', price: 24950, image: '/images/pc/monitor2.png' },
    { id: 'monitor-3', name: '27" 4K 144Hz Mini-LED', price: 44950, image: '/images/pc/monitor3.png' },
  ],
};

const componentCategories = [
  { id: 'systemUnits', name: 'System Unit', icon: FaDesktop },
  { id: 'monitors', name: 'Monitor', icon: FaDesktop },
];

const PCBuilder = () => {
  const [selected, setSelected] = useState({
    systemUnits: components.systemUnits[0],
    monitors: components.monitors[0],
  });

  const [activeCategory, setActiveCategory] = useState('systemUnits');

  const handleSelect = (category, item) => {
    setSelected(prev => ({ ...prev, [category]: item }));
  };

  const totalPrice = Object.values(selected).reduce((acc, item) => acc + (item?.price || 0), 0);

  const selectedSystemUnit = selected.systemUnits;
  const selectedMonitor = selected.monitors;

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <div className="flex flex-col lg:flex-row">
        {/* Visualizer Column */}
        <div className="lg:w-2/3 bg-white flex items-center justify-center p-8 relative overflow-hidden">
          <div className="flex justify-center items-center gap-6 w-full">
            {/* Monitor Container */}
            <div className="w-1/2 flex justify-end pr-3">
              <AnimatePresence mode="wait">
                {selectedMonitor && (
                  <motion.img
                    key={selectedMonitor.id}
                    src={selectedMonitor.image}
                    alt={selectedMonitor.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="max-h-[45vh] object-contain"
                  />
                )}
              </AnimatePresence>
            </div>

            {/* System Unit Container */}
            <div className="w-1/2 flex justify-start pl-3">
              <AnimatePresence mode="wait">
                {selectedSystemUnit && (
                  <motion.img
                    key={selectedSystemUnit.id}
                    src={selectedSystemUnit.image}
                    alt={selectedSystemUnit.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="max-h-[25vh] object-contain"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Configurator Column */}
        <div className="lg:w-1/3 bg-white p-8 flex flex-col h-full overflow-y-auto shadow-2xl z-20">
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Build Your Dream PC</h1>
            <p className="text-gray-500 mb-8">Select components to see your build come to life.</p>

            <div className="mb-6">
              {componentCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 mr-2 mb-2 rounded-lg transition-all duration-200 font-semibold ${
                    activeCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <cat.icon className="inline mr-2" />
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {components[activeCategory].map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(activeCategory, item)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center shadow-sm ${
                        selected[activeCategory]?.id === item.id
                          ? 'bg-blue-500/10 border-blue-500'
                          : 'bg-white border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      {item.image && <img src={item.image} alt={item.name} className="w-16 h-14 rounded-md mr-4 object-contain"/>}
                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                        {item.spec && <p className="text-sm text-gray-500">{item.spec}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">+₱{item.price.toLocaleString()}</p>
                        {selected[activeCategory]?.id === item.id && (
                          <FaRegCheckCircle className="text-green-500 mt-1 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer with Price and CTA */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200 sticky bottom-0 bg-white">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg text-gray-600">Total Price:</p>
              <p className="text-3xl font-bold text-blue-600">₱{totalPrice.toLocaleString()}</p>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 rounded-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center shadow-lg">
              <FaShoppingCart className="mr-3" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCBuilder;
