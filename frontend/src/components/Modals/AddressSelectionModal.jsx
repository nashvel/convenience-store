import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const AddressSelectionModal = ({
  isOpen,
  onClose,
  addresses,
  onSelectAddress,
  onAddNewAddress,
  onEditAddress,
  onDeleteAddress,
  selectedAddress,
}) => {
  const handleSelect = (address) => {
    onSelectAddress(address);
    onClose();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: '-50%', opacity: 0 },
    visible: { y: '0', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { y: '50%', opacity: 0 },
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Select a Delivery Address</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 border rounded-lg flex justify-between items-start ${selectedAddress?.id === address.id ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}
                >
                  <div>
                    <p className="font-semibold">{address.label || 'Address'}</p>
                    <p className="text-sm text-gray-600">{address.full_name}</p>
                    <p className="text-sm text-gray-600">{`${address.province}, ${address.city}, ${address.zip_code}`}</p>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                    <button onClick={() => handleSelect(address)} className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-primary-dark">Select</button>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); onEditAddress(address); }} className="text-gray-500 hover:text-primary"><FaEdit /></button>
                      <button onClick={(e) => { e.stopPropagation(); onDeleteAddress(address.id); }} className="text-gray-500 hover:text-red-500"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onAddNewAddress}
              className="w-full flex items-center justify-center gap-2 p-3 mt-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-all"
            >
              <FaPlus /> Add New Address
            </button>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AddressSelectionModal;
