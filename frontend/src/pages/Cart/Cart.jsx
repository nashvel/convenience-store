import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import eventEmitter from '../../utils/event-emitter';
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { CartContext } from '../../context/CartContext';
import { StoreContext } from '../../context/StoreContext';
import { PRODUCT_ASSET_URL } from '../../config';
import api from '../../api/axios-config';
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

  // Get fetchCart function from CartContext for refreshing cart after add-ons edit
  const cartContext = useContext(CartContext);
  const fetchCart = cartContext.fetchCart || (() => window.location.reload());

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
    if (shippingOption === 'door_to_door' && (!deliveryAddress || !deliveryAddress.id)) {
      toast.error('Please select a valid delivery address.');
      return;
    }

    setIsSubmitting(true);

    // Calculate totals at the time of submission to prevent stale state issues
    const currentShippingFee = shippingOption === 'door_to_door'
      ? selectedStores.reduce((acc, store) => acc + (Number(store.delivery_fee) || 0), 0)
      : 0.00;
    const currentCheckoutTotal = Number(subtotal) + currentShippingFee;

    const orderData = {
      userId: user.id,
      cartItems: selectedCartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        store_id: item.store_id,
        name: item.name,
        addons: item.addOns || [],
      })),
      shippingInfo: {
        id: deliveryAddress.id,
      },
      payment_method: paymentMethod,
      shipping_fee: currentShippingFee,
    };


    try {
      const response = await api.post('/orders', orderData);
      if (response.data.success) {
        toast.success('Order placed successfully!');
        clearCart();
        eventEmitter.dispatch('newNotification');
        navigate('/order-success');
      } else {
        toast.error(response.data.message || 'There was an error placing your order.');
      }
    } catch (error) {
      console.error('Order submission error:', error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.messages?.error || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
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
          formatPrice={formatPrice}
          pickupStore={pickupStore}
          selectedStores={selectedStores}
        />
      ) : cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <FaShoppingCart className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
                <p className="text-gray-600 text-sm">{cartCount} items in your cart</p>
              </div>
            </div>
            <Link
              to="/stores"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaArrowLeft className="text-sm" />
              Continue Shopping
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all"
                        checked={cartItems.length > 0 && selectedItems.length === cartItems.length}
                        onChange={toggleSelectAll}
                        id="select-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="select-all" className="font-bold text-gray-800 cursor-pointer text-lg">
                        Select All
                      </label>
                      <p className="text-sm text-gray-600">{selectedItems.length} of {cartCount} items selected</p>
                    </div>
                  </div>
                  <button 
                    onClick={clearCart} 
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 hover:text-red-700 transition-all duration-200 border border-red-200"
                  >
                    <FaTrash className="text-sm" />
                    Clear All
                  </button>
                </div>
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
                        onRefreshCart={fetchCart}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <OrderSummary
              subtotal={subtotal}
              shippingFee={shippingFee}
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