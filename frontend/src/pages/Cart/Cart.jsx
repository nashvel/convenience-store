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
import './Cart.css';

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

  // Helper to ensure price is a number and format it
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

  // Effect to pre-fill form when user is logged in
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
        className="cart-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="page-title">Your Cart</h1>
        <div className="empty-cart-container">
          <div className="empty-cart-icon">
            <FaShoppingCart />
          </div>
          <h2 className="empty-cart-message">Your cart is empty</h2>
          <p className="empty-cart-subtext">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="shop-now-button">Continue Shopping</Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="cart-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="page-title">Your Cart</h1>
      
      {!isCheckingOut ? (
        <>
          <Link to="/products" className="back-link">
            <FaArrowLeft /> Continue Shopping
          </Link>
          <div className="cart-content">
            <div className="cart-items-section">
              {Object.entries(groupedCart).map(([storeId, group]) => (
                <div key={storeId} className="store-group">
                  <h2 className="store-name">{group.storeName}</h2>
                  <div className="cart-header">
                    <div className="header-product">Product</div>
                    <div className="header-price">Price</div>
                    <div className="header-quantity">Quantity</div>
                    <div className="header-total">Total</div>
                    <div className="header-remove"></div>
                  </div>
                  {group.items.map(item => {
                    const basePrice = parseFloat(item.price) || 0;
                    const discount = parseFloat(item.discount) || 0;
                    const finalPrice = (discount > 0 && discount < 100) ? basePrice * (1 - discount / 100) : basePrice;
                    const itemTotal = finalPrice * item.quantity;

                    return (
                      <div key={item.id} className="cart-item-row">
                        <div className="cart-item-info">
                          <img src={`${PRODUCT_ASSET_URL}/${item.image}`} alt={item.name} className="cart-item-image" />
                          <div className="cart-item-details">
                            <Link to={`/products/${item.id}`} className="cart-item-name">{item.name}</Link>
                            {discount > 0 && (
                              <span className="discount-badge">{discount}% OFF</span>
                            )}
                          </div>
                        </div>
                        <div className="cart-item-price">
                          {discount > 0 ? (
                            <>
                              <span>₱{formatPrice(finalPrice)}</span>
                              <span className="original-price">₱{formatPrice(basePrice)}</span>
                            </>
                          ) : (
                            <span>₱{formatPrice(basePrice)}</span>
                          )}
                        </div>
                        <div className="cart-item-quantity">
                          <div className="quantity-control">
                            <button 
                              className="quantity-button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="quantity-value">{item.quantity}</span>
                            <button 
                              className="quantity-button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="cart-item-total">
                          <strong>₱{formatPrice(itemTotal)}</strong>
                        </div>
                        <div className="cart-item-remove">
                          <button onClick={() => removeFromCart(item.id)} className="remove-button">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="cart-actions">
                <button onClick={clearCart} className="clear-cart-button">
                  <FaTrash /> Clear Cart
                </button>
              </div>
            </div>
            
            <div className="cart-summary-section">
              <div className="summary-card">
                <h2 className="summary-title">Order Summary</h2>
                <div className="summary-row">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="summary-value">₱{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="summary-value">Free</span>
                </div>
                <div className="summary-row">
                  <span>Tax (10%)</span>
                  <span className="summary-value">₱{formatPrice(tax)}</span>
                </div>
                <hr className="divider" />
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span className="summary-value">₱{formatPrice(total)}</span>
                </div>
                {user ? (
                  <button onClick={() => setIsCheckingOut(true)} className="checkout-button">
                    <FaCreditCard /> Proceed to Checkout
                  </button>
                ) : (
                  <p className="login-prompt">
                    Please <Link to="/signin">log in</Link> to proceed to checkout.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="checkout-container">
          <form onSubmit={handleCheckout} className="checkout-form">
            <div className="shipping-details">
              <h3 className="section-title">Shipping Information</h3>
              <div className="form-group full-width">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" required />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" required />
              </div>
                            <div className="form-group full-width">
                <label className="form-label">Address</label>
                <div className="address-input-group">
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="form-input" placeholder="Street Address" required />
                  <button type="button" onClick={handleLocateMe} className="locate-me-button" disabled={isLocating}>
                    <FaMapMarkerAlt /> {isLocating ? 'Locating...' : 'Locate Me'}
                  </button>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="form-input" required />
                </div>
              </div>

              <h3 className="section-title">Payment Information</h3>
              <div className="form-group full-width">
                <label className="form-label">Card Number</label>
                <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className="form-input" placeholder="1234 5678 9012 3456" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} className="form-input" placeholder="MM/YY" required />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input type="text" name="cardCvv" value={formData.cardCvv} onChange={handleInputChange} className="form-input" placeholder="123" required />
                </div>
              </div>
            </div>

            <div className="checkout-order-summary">
              <h3 className="section-title">Order Summary</h3>
              <div className="summary-items">
                {Object.entries(groupedCart).map(([storeId, group]) => (
                  <div key={storeId} className="summary-store-group">
                    <h4 className="summary-store-name">{group.storeName}</h4>
                    {group.items.map(item => (
                      <div key={item.id} className="summary-item">
                        <span>{item.name} &times; {item.quantity}</span>
                        <span>₱{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <hr className="divider" />
              <div className="summary-row">
                <span>Subtotal</span>
                <span className="summary-value">₱{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span className="summary-value">₱{formatPrice(tax)}</span>
              </div>
              <hr className="divider" />
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="summary-value">₱{formatPrice(total)}</span>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={() => setIsCheckingOut(false)} className="back-button">
                Back to Cart
              </button>
              <button type="submit" className="place-order-button">
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