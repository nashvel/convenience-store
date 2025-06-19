import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import eventEmitter from '../../utils/event-emitter';
import { FaTrash, FaArrowLeft, FaShoppingCart, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { CartContext } from '../../context/CartContext';
import { StoreContext } from '../../context/StoreContext';
import { PRODUCT_ASSET_URL } from '../../config';
import axios from 'axios';

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
  const [isLocating, setIsLocating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  useEffect(() => {
    if (user) {
      const firstName = localStorage.getItem('firstName') || '';
      const lastName = localStorage.getItem('lastName') || '';
      const fullName = `${firstName} ${lastName}`.trim();

      setFormData(prev => ({
        ...prev,
        name: fullName || user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to place an order.');
      return;
    }

    setIsCheckingOut(true);

    const orderData = {
      userId: user.id, 
      cartItems: cartItems,
      shippingInfo: formData,
      subtotal: subtotal,
      tax: tax,
      total: total
    };

    try {
      const response = await axios.post('http://localhost:8080/api/orders', orderData);

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
      setIsCheckingOut(false);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          if (data && data.address) {
            const { quarter, town, state, postcode } = data.address;
            const street = quarter || '';
            const cityValue = town || state || '';
            
            setFormData(prev => ({
              ...prev,
              address: street,
              city: cityValue,
              zipCode: postcode || ''
            }));
            toast.success("Address located successfully!");
          } else {
            toast.error("Could not find address details for your location.");
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          toast.error("An error occurred while fetching your address.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Unable to retrieve your location. Please check your browser permissions.");
        setIsLocating(false);
      }
    );
  };

  if (cartItems.length === 0) {
    return (
      <motion.div 
        className="max-w-7xl mx-auto px-5 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2.5">Your Cart</h1>
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl shadow-lg text-center min-h-[400px]">
          <div className="text-6xl text-gray-200 mb-5">
            <FaShoppingCart />
          </div>
          <h2 className="text-2xl font-semibold mb-2.5">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="inline-block bg-primary text-white px-6 py-3 rounded-md font-semibold no-underline transition-all duration-300 ease-in-out hover:brightness-110">Continue Shopping</Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-5 lg:px-20 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-2.5">Your Cart</h1>
      
      {!isCheckingOut ? (
        <>
          <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 mb-8 font-medium transition-colors duration-200 ease-in-out hover:text-primary">
            <FaArrowLeft /> Continue Shopping
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
            <div className="space-y-8">
              {Object.entries(groupedCart).map(([storeId, group]) => (
                <div key={storeId} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <h2 className="text-2xl font-semibold p-5 text-primary border-b border-gray-200">{group.storeName}</h2>
                  <div className="hidden md:flex p-2.5 px-5 bg-gray-50 border-b border-gray-200 font-semibold text-gray-500 text-xs uppercase">
                    <div className="flex-[3]">Product</div>
                    <div className="flex-1">Price</div>
                    <div className="flex-1 text-center">Quantity</div>
                    <div className="flex-1 text-right">Total</div>
                    <div className="flex-[0.5]"></div>
                  </div>
                  {group.items.map(item => {
                    const basePrice = parseFloat(item.price) || 0;
                    const discount = parseFloat(item.discount) || 0;
                    const finalPrice = (discount > 0 && discount < 100) ? basePrice * (1 - discount / 100) : basePrice;
                    const itemTotal = finalPrice * item.quantity;

                    return (
                      <div key={item.id} className="flex flex-wrap md:flex-nowrap items-center p-5 border-b border-gray-200 last:border-b-0 relative gap-y-4">
                        <div className="flex items-center gap-4 w-full md:flex-[3]">
                          <img src={`${PRODUCT_ASSET_URL}/${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                          <div className="flex flex-col gap-1">
                            <Link to={`/products/${item.id}`} className="font-medium text-gray-800 no-underline hover:text-primary">{item.name}</Link>
                            {discount > 0 && (
                              <span className="inline-block bg-red-600 text-white px-1.5 py-0.5 rounded text-xs font-semibold">{discount}% OFF</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-start font-medium flex-1 md:flex-1">
                          {discount > 0 ? (
                            <>
                              <span>₱{formatPrice(finalPrice)}</span>
                              <span className="line-through text-gray-500 text-sm">₱{formatPrice(basePrice)}</span>
                            </>
                          ) : (
                            <span>₱{formatPrice(basePrice)}</span>
                          )}
                        </div>
                        <div className="flex justify-center items-center flex-1 md:flex-1">
                          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                            <button 
                              className="w-8 h-8 bg-transparent border-none text-xl cursor-pointer transition-colors duration-200 ease-in-out hover:enabled:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center border-l border-r border-gray-200">{item.quantity}</span>
                            <button 
                              className="w-8 h-8 bg-transparent border-none text-xl cursor-pointer transition-colors duration-200 ease-in-out hover:enabled:bg-gray-200"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="font-semibold text-right flex-1 md:flex-1">
                          <strong>₱{formatPrice(itemTotal)}</strong>
                        </div>
                        <div className="text-center absolute top-5 right-5 md:relative md:top-auto md:right-auto md:flex-[0.5]">
                          <button onClick={() => removeFromCart(item.id)} className="bg-transparent border-none text-gray-500 text-base cursor-pointer hover:text-red-600">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="flex justify-end p-5">
                <button onClick={clearCart} className="bg-transparent border border-gray-200 text-gray-500 px-4 py-2 rounded-md cursor-pointer inline-flex items-center gap-2 hover:bg-gray-200 hover:text-gray-800">
                  <FaTrash /> Clear Cart
                </button>
              </div>
            </div>
            
            <div className="sticky top-20">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-5">Order Summary</h2>
                <div className="flex justify-between mb-3 text-gray-500">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-medium text-gray-800">₱{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between mb-3 text-gray-500">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-800">Free</span>
                </div>
                <div className="flex justify-between mb-3 text-gray-500">
                  <span>Tax (10%)</span>
                  <span className="font-medium text-gray-800">₱{formatPrice(tax)}</span>
                </div>
                <hr className="border-none border-t border-gray-200 my-4" />
                <div className="flex justify-between font-bold text-lg text-gray-800">
                  <span>Total</span>
                  <span className="text-primary">₱{formatPrice(total)}</span>
                </div>
                {user ? (
                  <button onClick={() => setIsCheckingOut(true)} className="w-full flex items-center justify-center gap-2.5 bg-primary text-white border-none rounded-md p-3 font-semibold mt-5 cursor-pointer transition-all duration-300 ease-in-out hover:brightness-110">
                    <FaCreditCard /> Proceed to Checkout
                  </button>
                ) : (
                  <p className="text-center mt-5 text-gray-500 text-base">
                    Please <Link to="/signin" className="text-primary font-semibold no-underline hover:underline">log in</Link> to proceed to checkout.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-5">Shipping Information</h3>
              <div className="mb-4">
                <label className="block mb-1.5 text-sm text-gray-500">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:border-primary" required />
              </div>
              <div className="mb-4">
                <label className="block mb-1.5 text-sm text-gray-500">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:border-primary" required />
              </div>
              <div className="mb-4">
                <label className="block mb-1.5 text-sm text-gray-500">Address</label>
                <div className="flex items-center gap-2.5">
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="flex-grow p-2.5 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:border-primary" placeholder="Street Address" required />
                  <button type="button" onClick={handleLocateMe} className="px-4 py-2.5 bg-gray-500 text-white border-none rounded-md cursor-pointer flex items-center gap-2 whitespace-nowrap transition-all duration-200 ease-in-out hover:enabled:bg-gray-600 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed" disabled={isLocating}>
                    <FaMapMarkerAlt /> {isLocating ? 'Locating...' : 'Locate Me'}
                  </button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block mb-1.5 text-sm text-gray-500">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:border-primary" required />
                </div>
                <div className="flex-1">
                  <label className="block mb-1.5 text-sm text-gray-500">ZIP Code</label>
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:border-primary" required />
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-5 mt-6">Payment Information</h3>
              <div className="mb-4">
                <label className="block mb-1.5 text-sm text-gray-500">Card Number</label>
                <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:border-primary" placeholder="1234 5678 9012 3456" required />
              </div>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block mb-1.5 text-sm text-gray-500">Expiry Date</label>
                  <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:border-primary" placeholder="MM/YY" required />
                </div>
                <div className="flex-1">
                  <label className="block mb-1.5 text-sm text-gray-500">CVV</label>
                  <input type="text" name="cardCvv" value={formData.cardCvv} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:border-primary" placeholder="123" required />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 self-start sticky top-20">
              <h3 className="text-lg font-semibold mb-5">Order Summary</h3>
              <div className="mb-4 max-h-52 overflow-y-auto">
                {Object.entries(groupedCart).map(([storeId, group]) => (
                  <div key={storeId} className="mb-4 last:mb-0">
                    <h4 className="text-base font-semibold mb-2">{group.storeName}</h4>
                    {group.items.map(item => (
                      <div key={item.id} className="flex justify-between py-2 border-b border-dashed border-gray-200 last:border-b-0">
                        <span>{item.name} &times; {item.quantity}</span>
                        <span>₱{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <hr className="border-none border-t border-gray-200 my-4" />
              <div className="flex justify-between mb-3 text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-800">₱{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between mb-3 text-gray-500">
                <span>Tax</span>
                <span className="font-medium text-gray-800">₱{formatPrice(tax)}</span>
              </div>
              <hr className="border-none border-t border-gray-200 my-4" />
              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span className="text-primary">₱{formatPrice(total)}</span>
              </div>
            </div>
            
            <div className="col-span-full flex justify-between mt-5">
              <button type="button" onClick={() => setIsCheckingOut(false)} className="px-6 py-3 bg-white border border-gray-200 rounded-md font-medium cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-200">
                Back to Cart
              </button>
              <button type="submit" className="px-6 py-3 bg-primary text-white border-none rounded-md font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:brightness-110">
                Place Order
              </button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;