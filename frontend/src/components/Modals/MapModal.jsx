import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MapSection from '../AddressModal/MapSection';
import AddressModalHeader from '../AddressModal/AddressModalHeader';
import AddressModalFooter from '../AddressModal/AddressModalFooter';

const MapModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  mapState 
}) => {

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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 relative overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <AddressModalHeader addressLabel="Point Location on Map" onClose={onClose} />
            
            <div className="p-6">
              <MapSection 
                showMap={true} 
                handleLocateMe={mapState.handleLocateMe} 
                isLocating={mapState.isLocating} 
                searchQuery={mapState.searchQuery} 
                handleSearchInputChange={mapState.handleSearchInputChange} 
                isSearching={mapState.isSearching} 
                mapCenter={mapState.mapCenter} 
                selectedPosition={mapState.selectedPosition} 
                handleMapLocationSelect={mapState.handleMapLocationSelect}
                address={mapState.address}
                searchResults={mapState.searchResults}
                handleSuggestionClick={mapState.handleSuggestionClick}
              />
              <AddressModalFooter 
                onClose={onClose} 
                handleSave={onSave} 
                isSaving={mapState.isSaving} 
                saveLabel="Confirm Location"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MapModal;
