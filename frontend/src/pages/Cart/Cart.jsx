import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import eventEmitter from '../../utils/event-emitter';
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { CartContext } from '../../context/CartContext';
import { StoreContext } from '../../context/StoreContext';
import { PRODUCT_ASSET_URL, API_BASE_URL } from '../../config';
import axios from 'axios';
import Checkout from '../../components/Checkout/Checkout';
import StoreLocation from '../../components/Cart/StoreLocation';
import CartSkeleton from '../../components/Skeletons/CartSkeleton';
import EmptyCart from '../../components/Cart/EmptyCart';
import CartItem from '../../components/Cart/CartItem';
import OrderSummary from '../../components/Cart/OrderSummary';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    total,
    totalItems: cartCount,
    loading: cartLoading,
    selectedItems,
    toggleItemSelection,
    toggleSelectAll,
  } = useContext(CartContext);

  const { stores, loading: storesLoading } = useContext(StoreContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingOption, setShippingOption] = useState('door_to_door');
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const formatPrice = (price) => {
    const numericPrice = Number(price) || 0;
    return numericPrice.toFixed(2);
  };

  const groupedCart = cartItems.reduce((acc, item) => {
    const storeId = item.store_id;
    if (!acc[storeId]) {
      const store = stores.find(s => s.id === storeId);
      acc[storeId] = {
        storeName: store ? store.name : 'Unknown Store',
        items: [],
      };
    }
    acc[storeId].items.push(item);
    return acc;
  }, {});

  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.cartItemId));

  const selectedGroupedCart = selectedCartItems.reduce((acc, item) => {
    const storeId = item.store_id;
    if (!acc[storeId]) {
      const store = stores.find(s => s.id === storeId);
      acc[storeId] = {
        storeName: store ? store.name : 'Unknown Store',
        items: [],
      };
    }
    acc[storeId].items.push(item);
    return acc;
  }, {});

  const selectedStoreIds = [...new Set(selectedCartItems.map(item => item.store_id))];
  const selectedStores = stores.filter(store => selectedStoreIds.includes(store.id));

  const shippingFee = shippingOption === 'door_to_door'
    ? selectedStores.reduce((acc, store) => acc + (Number(store.delivery_fee) || 0), 0)
    : 0.00;

  const checkoutTotal = total + shippingFee;
  const pickupStore = selectedStoreIds.length === 1 ? stores.find(s => s.id === parseInt(selectedStoreIds[0])) : null;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to place an order.');
      return;
    }
    if (selectedItems.length === 0) {
      toast.error('Please select items to checkout.');
      return;
    }
    if (shippingOption === 'door_to_door' && (!deliveryAddress || !deliveryAddress.line1)) {
      toast.error('Please provide a complete delivery address.');
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      userId: user.id,
      cartItems: selectedCartItems,
      shippingInfo: {
        ...deliveryAddress,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
      },
      payment_method: paymentMethod,
      shipping_method: shippingOption,
      shipping_fee: shippingFee,
      subtotal: subtotal,
      total: checkoutTotal,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
      if (response.data.success) {
        toast.success('Order placed successfully!');
        clearCart();
        eventEmitter.dispatch('newNotification');
        navigate('/my-orders');
      } else {
        toast.error(response.data.message || 'There was an error placing your order.');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartLoading || storesLoading) {
    return <CartSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {isCheckingOut ? (
        <Checkout
          user={user}
          groupedCart={selectedGroupedCart}
          subtotal={subtotal}
          shippingOption={shippingOption}
          setShippingOption={setShippingOption}
          deliveryAddress={deliveryAddress}
          setDeliveryAddress={setDeliveryAddress}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          handleCheckout={handleCheckout}
          isSubmitting={isSubmitting}
          setIsCheckingOut={setIsCheckingOut}
          checkoutTotal={checkoutTotal}
          formatPrice={formatPrice}
          pickupStore={pickupStore}
          selectedStores={selectedStores}
        />
      ) : cartCount === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4 md:mb-0">Your Shopping Cart</h1>
            <Link to="/stores" className="text-primary font-semibold hover:underline">
              Continue Shopping
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg">
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    checked={cartItems.length > 0 && selectedItems.length === cartItems.length}
                    onChange={toggleSelectAll}
                    id="select-all"
                  />
                  <label htmlFor="select-all" className="font-semibold text-gray-700 cursor-pointer">
                    Select All ({selectedItems.length} / {cartCount} items)
                  </label>
                </div>
                <button onClick={clearCart} className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors">
                  Clear All
                </button>
              </div>
              {Object.entries(groupedCart).map(([storeId, storeData]) => (
                <div key={storeId} className="p-4 border-b last:border-b-0">
                  <h3 className="font-bold text-lg text-gray-600 mb-3">{storeData.storeName}</h3>
                  <div className="divide-y divide-gray-200">
                    {storeData.items.map((item) => (
                      <CartItem
                        key={item.cartItemId}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                        onSelectItem={toggleItemSelection}
                        isSelected={selectedItems.includes(item.cartItemId)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <OrderSummary
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={checkoutTotal}
              onCheckout={() => setIsCheckingOut(true)}
              selectedItemCount={selectedItems.length}
            />
          </div>


        </>
      )}

    </motion.div>
  );
};

export default Cart;