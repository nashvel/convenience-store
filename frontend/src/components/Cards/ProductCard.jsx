import React from 'react';
import { Link } from 'react-router-dom';

const PRODUCT_ASSET_URL = process.env.REACT_APP_PRODUCT_ASSET_URL || 'http://localhost:8080/uploads/products';

const getStockStatus = (stock) => {
  if (stock > 10) return { text: 'In Stock', className: 'bg-green-100 text-green-800' };
  if (stock > 0) return { text: 'Low Stock', className: 'bg-yellow-100 text-yellow-800' };
  return { text: 'Out of Stock', className: 'bg-red-100 text-red-800' };
};

const calculateTotalStock = (product) => {
  const { stock, product_type, variants } = product;
  
  // For variable products, calculate total stock from variants
  if (product_type === 'variable' && variants && variants.length > 0) {
    return variants.reduce((total, variant) => {
      const variantStock = parseInt(variant.stock) || 0;
      return total + variantStock;
    }, 0);
  }
  
  // For single products, use the main stock value
  return parseInt(stock) || 0;
};

const ProductCard = ({ product, size = 'normal' }) => {
  if (!product) {
    return null; 
  }

  const { id, name, price, image, stock, store_name, product_type, variant_count, variants } = product;
  const totalStock = calculateTotalStock(product);
  const stockStatus = getStockStatus(totalStock);

  const isSmall = size === 'small';

  const slug = name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-');

  // Calculate display price for variable products
  const getDisplayPrice = () => {
    if (product_type === 'variable' && variants && variants.length > 0) {
      const prices = variants.map(v => parseFloat(v.price)).filter(p => !isNaN(p));
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        if (minPrice === maxPrice) {
          return `₱${minPrice.toFixed(2)}`;
        } else {
          return `₱${minPrice.toFixed(2)} - ₱${maxPrice.toFixed(2)}`;
        }
      }
    }
    
    // For single products or fallback
    const productPrice = parseFloat(price);
    if (!isNaN(productPrice)) {
      return `₱${productPrice.toFixed(2)}`;
    }
    
    return 'Price not available';
  };

  return (
    <Link to={`/product/${id}/${slug}`} className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl flex flex-col ${isSmall ? 'w-full' : 'max-w-sm'}`}>
      {store_name && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
          {store_name}
        </div>
      )}
      <div className={`relative ${isSmall ? 'h-32' : 'h-48'}`}>
        <img 
          className="w-full h-full object-cover"
          src={`${PRODUCT_ASSET_URL}/${image || 'default.png'}`}
          alt={name}
        />
      </div>
      <div className={`p-4 flex flex-col flex-grow ${isSmall ? 'p-3' : 'p-5'}`}>
        <h3 className={`font-semibold text-gray-800 dark:text-white truncate ${isSmall ? 'text-sm' : 'text-lg'}`}>
          {name}
        </h3>
        <div className="mt-auto pt-3">
          <p className={`font-bold text-gray-900 dark:text-white ${isSmall ? 'text-base' : 'text-xl'}`}>
            {product_type === 'variable' && variants && variants.length > 0 && <span className="text-sm font-normal">From </span>}
            {getDisplayPrice()}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {product_type === 'variable' && variant_count > 0 && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-800 whitespace-nowrap">
                {variant_count} variants
              </span>
            )}
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stockStatus.className} whitespace-nowrap`}>
              {stockStatus.text}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;