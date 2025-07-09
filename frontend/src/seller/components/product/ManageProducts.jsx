import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrash, FaPlus, FaMinus, FaEllipsisV, FaStar } from 'react-icons/fa';
import ProductReviewsModal from '../modals/ProductReviewsModal';
import { fetchAllProducts } from '../../../api/productApi';
import Loading from '../animation/Loading';

const DropdownItem = ({ icon, label, onClick, className }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${className}`}>
    {icon}
    <span>{label}</span>
  </button>
);

const ProductCard = ({ product, onStockChange, onDelete, onOpenMenu, openMenuId, onOpenReviews }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onOpenMenu]);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col relative transition-shadow duration-300 hover:shadow-xl">
      <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 truncate">{product.name}</h3>
        <p className="text-primary font-semibold text-md mt-1">${product.price.toFixed(2)}</p>
      </div>
      <div className="px-5 pb-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => onStockChange(product.id, -1)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center"><FaMinus /></button>
          <span className="font-bold text-lg text-gray-800">{product.stock}</span>
          <button onClick={() => onStockChange(product.id, 1)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center"><FaPlus /></button>
        </div>
        <div className="relative" ref={menuRef}>
          <button onClick={() => onOpenMenu(product.id)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
            <FaEllipsisV />
          </button>
          {openMenuId === product.id && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-20 py-1">
              <DropdownItem icon={<FaEdit />} label="Edit" />
              <DropdownItem icon={<FaStar />} label="View Reviews" onClick={() => onOpenReviews(product)} />
              <div className="my-1 border-t border-gray-100"></div>
              <DropdownItem icon={<FaTrash />} label="Delete" onClick={() => onDelete(product.id)} className="text-red-600 hover:bg-red-50" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardSize, setCardSize] = useState(280);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [viewingReviewsFor, setViewingReviewsFor] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const fetchedProducts = await fetchAllProducts();
        setProducts(fetchedProducts.map(p => ({ ...p, imageUrl: p.image })));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleStockChange = (id, amount) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p));
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
    setOpenMenuId(null);
  };

  const handleOpenMenu = (id) => {
    setOpenMenuId(prevId => (prevId === id ? null : id));
  };

  const handleOpenReviews = (product) => {
    setViewingReviewsFor(product);
    setOpenMenuId(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-8">
      <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
        <div className="flex items-center gap-4">
          <label htmlFor="size-slider" className="font-semibold text-gray-600">Card Size</label>
          <input 
            id="size-slider" 
            type="range" 
            min="250" 
            max="400" 
            value={cardSize} 
            onChange={(e) => setCardSize(e.target.value)} 
            className="w-40 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </header>
      <div 
        className="grid gap-8"
        style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${cardSize}px, 1fr))` }}>
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            onStockChange={handleStockChange}
            onDelete={handleDelete}
            onOpenMenu={handleOpenMenu}
            openMenuId={openMenuId}
            onOpenReviews={handleOpenReviews}
          />
        ))}
      </div>
      {viewingReviewsFor && 
        <ProductReviewsModal 
          product={viewingReviewsFor} 
          onClose={() => setViewingReviewsFor(null)} 
        />
      }
    </div>
  );
};

export default ManageProducts;
