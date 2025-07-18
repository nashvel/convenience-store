import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaMinus, FaPlus } from 'react-icons/fa';
import { StoreContext } from '../../context/StoreContext';
import { PRODUCT_ASSET_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import ImageViewerModal from './ImageViewerModal';

const VariantSelectionModal = ({ isOpen, onClose, product }) => {
  const { addToCart: addToCartContext } = useContext(StoreContext);
  const navigate = useNavigate();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isImageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      console.log('VariantSelectionModal product data:', product);
    }
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setQuantity(1); // Reset quantity when modal opens or product changes
  }, [product, isOpen]);

  if (!product) return null;

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when variant changes
  };

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => {
      const newQuantity = prev + amount;
      const stock = selectedVariant ? selectedVariant.stock : product.stock;
      if (newQuantity < 1) return 1;
      if (newQuantity > stock) return stock;
      return newQuantity;
    });
  };

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      price: selectedVariant.price,
      stock: selectedVariant.stock,
      image: selectedVariant.image || product.image,
      variant_id: selectedVariant.id,
      attributes: selectedVariant.attributes,
    };
    addToCartContext(itemToAdd, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    const itemToBuy = {
      ...product,
      price: selectedVariant.price,
      stock: selectedVariant.stock,
      image: selectedVariant.image || product.image,
      variant_id: selectedVariant.id,
      attributes: selectedVariant.attributes,
    };
    addToCartContext(itemToBuy, quantity);
    navigate('/checkout');
  };

  const getPrice = (price) => {
    const num = parseFloat(price);
    return isNaN(num) ? null : num;
  };

  const displayPrice = getPrice(selectedVariant ? selectedVariant.price : product.price);
  const originalPrice = getPrice(selectedVariant?.original_price);
  const displayStock = selectedVariant ? selectedVariant.stock : product.stock;
  const displayImage = selectedVariant?.image ? `${PRODUCT_ASSET_URL}/${selectedVariant.image}` : `${PRODUCT_ASSET_URL}/${product.image}`;

  const isOutOfStock = displayStock === 0;

  const handleImageClick = () => {
    setSelectedImageUrl(displayImage);
    setImageViewerOpen(true);
  };

  return (
    <>
      <ImageViewerModal
        isOpen={isImageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        imageUrl={selectedImageUrl}
      />
      <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white w-full max-w-lg rounded-2xl p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <FaTimes size={20} />
            </button>

            <div className="flex items-start space-x-4 mb-4">
                            <div className="w-24 h-24 cursor-pointer" onClick={handleImageClick}>
                <img src={displayImage} alt={product.name} className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="pt-4">
                <div className="flex items-baseline space-x-2">
                  {displayPrice !== null && <p className="text-xl font-bold text-blue-600">₱{displayPrice.toFixed(2)}</p>}
                  {originalPrice !== null && (
                    <p className="text-sm text-gray-500 line-through">₱{originalPrice.toFixed(2)}</p>
                  )}
                </div>
                <p className="text-sm text-gray-500">Stock: {displayStock}</p>
                {selectedVariant && (
                  <>
                    <p className="text-sm text-gray-500 mt-1">SKU: {selectedVariant.sku || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Size: {selectedVariant.attributes?.Size || 'N/A'}</p>
                  </>
                )}
              </div>
            </div>

            {product.product_type === 'variable' && product.variants && (
              <div className="mb-4">
                <h3 className="text-md font-semibold mb-2">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      onClick={() => handleVariantSelect(variant)}
                      className={`cursor-pointer border-2 p-2 rounded-lg flex flex-col items-center ${selectedVariant?.id === variant.id ? 'border-blue-500' : 'border-transparent'}`}
                      style={{ opacity: variant.stock === 0 ? 0.5 : 1 }}
                    >
                      <img 
                        src={`${PRODUCT_ASSET_URL}/${variant.image || product.image}`}
                        alt={variant.attributes?.Color || 'Variant'}
                        className="w-16 h-16 object-cover rounded-md mb-2"
                      />
                      <p className="text-sm text-center">
                        {variant.attributes?.Color || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-md font-semibold">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => handleQuantityChange(-1)} className="p-2 text-gray-600"><FaMinus /></button>
                <span className="px-4 py-1 font-semibold">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="p-2 text-gray-600"><FaPlus /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="w-full py-3 bg-blue-100 text-blue-600 font-semibold rounded-lg disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    Add to Cart
                </button>
                <button 
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Buy Now
                </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default VariantSelectionModal;

