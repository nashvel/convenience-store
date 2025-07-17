import React from 'react';
import { XIcon } from '@heroicons/react/solid';
import VariantItem from './VariantItem';

const MoreVariantsModal = ({ variants, isOpen, onClose, onUpdate, onDelete, onImageChange }) => {
  if (!isOpen) {
    return null;
  }



  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-4xl animate-fade-in-up relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
          <h2 className="text-xl font-bold text-gray-800">All Variants</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto pr-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {variants.map(variant => (
              <VariantItem 
                key={variant.id} 
                variant={variant} 
                onUpdate={onUpdate}
                onDelete={onDelete}
                onImageChange={onImageChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreVariantsModal;
