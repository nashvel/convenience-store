import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import useAddressModal from '../../hooks/useAddressModal';
import AddressSelectorModal from './AddressSelectorModal';
import MapModal from './MapModal';
import AddressModalHeader from '../AddressModal/AddressModalHeader';
import AddressMethodSelector from '../AddressModal/AddressMethodSelector';
import AddressFormFields from '../AddressModal/AddressFormFields';
import AddressModalFooter from '../AddressModal/AddressModalFooter';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AddressModal = ({ isOpen, onClose, onSave, initialAddress, addressLabel }) => {
  const {
    address,
    isLocating,
    isSaving,
    searchQuery,
    isSearching,
    mapCenter,
    selectedPosition,
    addressSelectionMethod,
    showAddressSelector,
    selectedAddressData,
    showMapModal,
    setShowAddressSelector,
    setShowMapModal,
    handleAddressMethodSelect,
    handleAddressSelectorSave,
    handleChange,
    handleLocateMe,
    handleMapLocationSelect,
    handleSearchInputChange,
    handleSave,
    handleMapSave,
    searchResults,
    handleSuggestionClick,
  } = useAddressModal(initialAddress, isOpen, onSave);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: '-50%', opacity: 0 },
    visible: { y: '0', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { y: '50%', opacity: 0 },
  };

  return (
    <>
      {ReactDOM.createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={onClose}
            >
              <motion.div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 relative overflow-hidden"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
              >
                <AddressModalHeader addressLabel={addressLabel} onClose={onClose} />
                
                <div className="p-6">
                  <div className="space-y-4">
                    <AddressMethodSelector 
                      addressSelectionMethod={addressSelectionMethod} 
                      handleAddressMethodSelect={handleAddressMethodSelect} 
                    />
                    <AddressFormFields 
                      address={address} 
                      handleChange={handleChange} 
                      selectedAddressData={selectedAddressData} 
                    />
                  </div>

                  <AddressModalFooter 
                    onClose={onClose} 
                    handleSave={handleSave} 
                    isSaving={isSaving} 
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
      
      {/* Address Selector Modal */}
      <AddressSelectorModal
        isOpen={showAddressSelector}
        onClose={() => setShowAddressSelector(false)}
        onSave={handleAddressSelectorSave}
      />

      <MapModal 
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onSave={handleMapSave}
        mapState={{
          address,
          isLocating,
          searchQuery,
          isSearching,
          mapCenter,
          selectedPosition,
          handleLocateMe,
          handleMapLocationSelect,
          handleSearchInputChange,
          handleSuggestionClick,
          searchResults,
        }}
      />
    </>
  );
};

export default AddressModal;
