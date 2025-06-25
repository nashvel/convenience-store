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
import { API_BASE_URL } from '../../config';
import axios from 'axios';
import AddressModal from '../../components/Modals/AddressModal';
import Checkout from '../../components/Checkout/Checkout';
import StoreLocation from '../../components/Cart/StoreLocation';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    subtotal,
    tax,
    total,
    totalItems: cartCount 
  } = useContext(CartContext);

  const formatPrice = (price) => {
    const numericPrice = Number(price) || 0;
    return numericPrice.toFixed(2);
  };

  const { stores } = useContext(StoreContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingOption, setShippingOption] = useState('door_to_door');
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const groupedCart = cartItems.reduce((acc, item) => {
    const storeId = item.store_id;
    if (!acc[storeId]) {
      const store = stores.find(s => s.id === storeId);
      acc[storeId] = {
        storeName: store ? store.name : 'Unknown Store',
        items: []
      };
    }
    acc[storeId].items.push(item);
    return acc;
  }, {});

  const storeIds = Object.keys(groupedCart);
  const pickupStore = storeIds.length === 1 ? stores.find(s => s.id === parseInt(storeIds[0])) : null;




  
  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to place an order.');
      return;
    }

    setIsSubmitting(true);

    if (shippingOption === 'door_to_door' && (!deliveryAddress || (!deliveryAddress.province && !deliveryAddress.line1))) {
      toast.error('Please provide a delivery address for door-to-door shipping.');
      setIsSubmitting(false);
      return;
    }

    const shippingFee = shippingOption === 'door_to_door' ? 5.00 : 0.00;
    const finalTotal = total + shippingFee;

    const orderData = {
      userId: user.id,
      cartItems: cartItems,
      shippingInfo: {
        ...deliveryAddress,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
      },
      payment_method: paymentMethod,
      shipping_method: shippingOption,
      shipping_fee: shippingFee,
      subtotal: subtotal,
      tax: tax,
      total: finalTotal,
    };

    try {
            const response = await axios.post(`${API_BASE_URL}/orders`, orderData);

      if (response.data.success) {
        toast.success('Order placed successfully! Thank you for your purchase.');
        clearCart();
        eventEmitter.dispatch('newNotification');
        navigate('/my-orders');
      } else {
        toast.error(response.data.message || 'An error occurred while placing your order.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'An error occurred while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkoutTotal = total + (shippingOption === 'door_to_door' ? 5.00 : 0.00);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto mt-10 mb-20 p-4 md:p-8"
    >
      <h1 className="text-4xl font-bold text-center mb-10">Your Shopping Cart</h1>

      {cartCount === 0 && !isCheckingOut ? (
        <div className="text-center">
          <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-6">Your cart is empty.</p>
          <Link to="/stores" className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-dark transition-all">
            Continue Shopping
          </Link>
        </div>
      ) : !isCheckingOut ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
              {Object.entries(groupedCart).map(([storeId, group]) => (
                <div key={storeId} className="p-6 border-b last:border-b-0">
                  <h3 className="text-xl font-semibold mb-4">{group.storeName}</h3>
                  {group.items.map(item => (
                    <div key={item.cartItemId} className="flex items-center gap-4 py-4 border-b last:border-b-0">
                      <img src={`${PRODUCT_ASSET_URL}/${item.image}`} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                      <div className="flex-grow">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-500">Price: ₱{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                                                <button onClick={() => updateQuantity(item.cartItemId, Number(item.quantity) - 1)} className="px-2 py-1 border rounded-md">-</button>
                        <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.cartItemId, Number(item.quantity) + 1)} className="px-2 py-1 border rounded-md">+</button>
                      </div>
                      <p className="font-semibold w-24 text-right">₱{formatPrice(item.price * item.quantity)}</p>
                      <button onClick={() => removeFromCart(item.cartItemId)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-800">₱{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-medium text-gray-800">₱{formatPrice(tax)}</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₱{formatPrice(total)}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsCheckingOut(true)} 
                className="w-full mt-6 bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary-dark transition-all disabled:opacity-50"
                disabled={cartCount === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
          <div className="mt-8 flex justify-between">
            <Link to="/stores" className="flex items-center gap-2 text-primary hover:underline">
              <FaArrowLeft />
              Continue Shopping
            </Link>
            <button onClick={clearCart} className="text-red-500 hover:underline">Clear Cart</button>
          </div>
        </>
      ) : (
        <>
          {shippingOption === 'pick_up' && (
            <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
              <StoreLocation store={pickupStore} />
            </div>
          )}
          <Checkout 
            user={user}
            groupedCart={groupedCart}
            subtotal={subtotal}
            tax={tax}
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
          />
        </>
      )}

    </motion.div>
  );
};

export default Cart;