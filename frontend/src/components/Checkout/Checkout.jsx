import React, { useState } from 'react';
import { FaSpinner, FaMapMarkerAlt, FaTruck, FaCreditCard, FaShoppingBag, FaChevronRight, FaCheckCircle, FaStore, FaUtensils } from 'react-icons/fa';
import { PRODUCT_ASSET_URL, ADDON_ASSET_URL } from '../../config';

import ShippingModal from '../Modals/ShippingModal';
import PaymentModal from '../Modals/PaymentModal';
import AddressSelector from './AddressSelector';

const Checkout = ({
  user,
  groupedCart,
  subtotal,
  shippingOption,
  setShippingOption,
  deliveryAddress,
  setDeliveryAddress,
  paymentMethod,
  setPaymentMethod,
  handleCheckout,
  isSubmitting,
  setIsCheckingOut,

  formatPrice,
  pickupStore,
  selectedStores = []
}) => {
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const shippingFee = shippingOption === 'door_to_door'
    ? selectedStores.reduce((acc, store) => acc + Number(store.delivery_fee ?? 5.00), 0)
    : 0.00;

  const total = Number(subtotal) + shippingFee;
  // Check completion status for progress indicators
  const isAddressComplete = deliveryAddress && deliveryAddress.id;
  const isShippingComplete = shippingOption;
  const isPaymentComplete = shippingOption === 'pickup' || paymentMethod;

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Compact Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Checkout</h1>
            
            {/* Compact Progress Indicator */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  isAddressComplete 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                    : 'bg-blue-500'
                }`}>
                  {isAddressComplete ? 
                    <FaCheckCircle className="text-white text-sm" /> : 
                    <FaMapMarkerAlt className="text-white text-sm" />
                  }
                </div>
                <span className={`text-sm font-medium ${
                  isAddressComplete ? 'text-purple-600' : 'text-blue-600'
                }`}>
                  Address
                </span>
              </div>
              
              <div className={`h-0.5 w-8 ${
                isAddressComplete ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gray-300'
              }`}></div>
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  isShippingComplete 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                    : 'bg-blue-500'
                }`}>
                  {isShippingComplete ? 
                    <FaCheckCircle className="text-white text-sm" /> : 
                    <FaTruck className="text-white text-sm" />
                  }
                </div>
                <span className={`text-sm font-medium ${
                  isShippingComplete ? 'text-purple-600' : 'text-blue-600'
                }`}>
                  Shipping
                </span>
              </div>
              
              <div className={`h-0.5 w-8 ${
                isShippingComplete ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gray-300'
              }`}></div>
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  isPaymentComplete 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                    : 'bg-blue-500'
                }`}>
                  {isPaymentComplete ? 
                    <FaCheckCircle className="text-white text-sm" /> : 
                    <FaCreditCard className="text-white text-sm" />
                  }
                </div>
                <span className={`text-sm font-medium ${
                  isPaymentComplete ? 'text-purple-600' : 'text-blue-600'
                }`}>
                  Payment
                </span>
              </div>
            </div>
          </div>

          <form className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6" onSubmit={handleCheckout}>
          
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Address Section */}
              <div className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition-all duration-300 ${isAddressComplete ? 'border-purple-300 bg-blue-50/50' : 'border-gray-200 hover:border-blue-400'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className={`text-xl mr-3 ${isAddressComplete ? 'text-purple-600' : 'text-blue-600'}`} />
                    <h3 className="text-xl font-bold text-gray-800">Delivery Address</h3>
                  </div>
                  {isAddressComplete && <FaCheckCircle className="text-purple-600 text-lg" />}
                </div>
                <AddressSelector user={user} onSelectAddress={setDeliveryAddress} />
              </div>

              {/* Shipping Section */}
              <div className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition-all duration-300 ${isShippingComplete ? 'border-purple-300 bg-blue-50/50' : 'border-gray-200 hover:border-blue-400'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaTruck className={`text-xl mr-3 ${isShippingComplete ? 'text-purple-600' : 'text-blue-600'}`} />
                    <h3 className="text-xl font-bold text-gray-800">Shipping Option</h3>
                  </div>
                  {isShippingComplete && <FaCheckCircle className="text-purple-600 text-lg" />}
                </div>
                <button type="button" onClick={() => setIsShippingModalOpen(true)} className="w-full p-5 border-2 border-gray-200 rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group hover:shadow-md transform hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {shippingOption === 'door_to_door' ? 
                        <FaTruck className="text-blue-600 text-lg mr-3" /> : 
                        <FaStore className="text-blue-600 text-lg mr-3" />
                      }
                      <div>
                        <span className="text-base font-semibold text-gray-700 block">{shippingOption === 'door_to_door' ? 'Door-to-door Delivery' : 'Pick-up at Store'}</span>
                        <p className="text-sm text-gray-500 mt-1">Click to change shipping method</p>
                      </div>
                    </div>
                    <FaChevronRight className="text-gray-400 group-hover:text-blue-500 transition-all duration-200 group-hover:translate-x-1" />
                  </div>
                </button>
              </div>

              {/* Payment Section */}
              {shippingOption === 'door_to_door' && (
                <div className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition-all duration-300 animate-fadeIn ${isPaymentComplete ? 'border-purple-300 bg-blue-50/50' : 'border-gray-200 hover:border-blue-400'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FaCreditCard className={`text-xl mr-3 ${isPaymentComplete ? 'text-purple-600' : 'text-blue-600'}`} />
                      <h3 className="text-xl font-bold text-gray-800">Payment Method</h3>
                    </div>
                    {isPaymentComplete && <FaCheckCircle className="text-purple-600 text-lg" />}
                  </div>
                  <button type="button" onClick={() => setIsPaymentModalOpen(true)} className="w-full p-5 border-2 border-gray-200 rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group hover:shadow-md transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaCreditCard className="text-blue-600 text-lg mr-3" />
                        <div>
                          <span className="text-base font-semibold text-gray-700 block">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                          <p className="text-sm text-gray-500 mt-1">Click to change payment method</p>
                        </div>
                      </div>
                      <FaChevronRight className="text-gray-400 group-hover:text-blue-500 transition-all duration-200 group-hover:translate-x-1" />
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <FaShoppingBag className="text-blue-600 text-xl mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
                </div>
                <div className="mb-6 max-h-64 overflow-y-auto pr-2 space-y-4">
                  {Object.entries(groupedCart).map(([storeId, group]) => (
                    <div key={`store-${storeId}`} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <FaUtensils className="text-orange-500 mr-2" />
                        <h4 className="text-md font-semibold text-gray-700">{group.storeName}</h4>
                      </div>
                      <div className="space-y-3">
                        {group.items.map((item, itemIndex) => (
                          <div key={`item-${item.product_id || item.id || itemIndex}-${itemIndex}`} className="bg-white rounded-md">
                            {/* Main Item */}
                            <div className="flex justify-between items-center py-2 px-3">
                              <div className="flex items-center flex-1">
{item.image && (
                                  <img 
                                    src={`${PRODUCT_ASSET_URL}/${item.image}`} 
                                    alt={item.name}
                                    className="w-10 h-10 rounded-md object-cover mr-3 border border-gray-200"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                )}
                                <div className="flex-1">
                                  <span className="text-gray-700 font-medium text-sm">{item.name}</span>
                                  <span className="text-gray-500 text-xs ml-2">&times; {item.quantity}</span>
                                </div>
                              </div>
                              <span className="font-semibold text-gray-800 text-sm">₱{formatPrice(item.price * item.quantity)}</span>
                            </div>
                            
                            {/* Add-ons */}
                            {item.addOns && item.addOns.length > 0 && (
                              <div className="px-3 pb-2">
                                <div className="border-l-2 border-blue-200 pl-3 ml-2 space-y-1">
                                  {item.addOns.map((addOn, index) => {
                                    const addonName = addOn.addon_name || addOn.name || 'Add-on';
                                    const variantValue = addOn.variant_value || addOn.variant_name || '';
                                    const displayName = variantValue ? `${addonName} - ${variantValue}` : addonName;
                                    const addonPrice = parseFloat(addOn.price || 0);
                                    const addonQuantity = parseInt(addOn.quantity || 1);
                                    
                                    // Add-on images aren't included in cart API response yet
                                    // TODO: Backend needs to include add-on image data in cart response
                                    const addonImage = addOn.addon_image || addOn.image;
                                    
                                    return (
                                      <div key={`addon-${item.product_id || item.id || itemIndex}-${index}`} className="flex justify-between items-center py-1">
                                        <div className="flex items-center flex-1">
                                          {addonImage && (
                                            <img 
                                              src={`${ADDON_ASSET_URL}/${addonImage}`} 
                                              alt={addonName}
                                              className="w-6 h-6 rounded object-cover mr-2 border border-gray-200"
                                              onError={(e) => {
                                                e.target.style.display = 'none';
                                              }}
                                            />
                                          )}
                                          <div className="flex-1">
                                            <span className="text-gray-600 text-xs font-medium">+ {displayName}</span>
                                            <span className="text-gray-400 text-xs ml-1">&times; {addonQuantity}</span>
                                          </div>
                                        </div>
                                        <span className="text-gray-600 text-xs font-medium">₱{formatPrice(addonPrice)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-dashed border-gray-200 my-6"></div>
                <div className="space-y-4">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">₱{formatPrice(subtotal)}</span>
                  </div>

                  {shippingOption === 'door_to_door' && selectedStores && selectedStores.map(store => (
                    <div key={store.id} className="flex justify-between text-sm bg-blue-50 px-3 py-2 rounded-md">
                      <span className="text-gray-600 flex items-center">
                        <FaTruck className="mr-2 text-blue-500" />
                        Shipping from {store.name}
                      </span>
                      <span className="font-medium text-gray-800">₱{formatPrice(Number(store.delivery_fee ?? 5.00))}</span>
                    </div>
                  ))}
                  
                  <div className="border-t-2 border-dashed border-gray-200 my-4"></div>
                  <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl">₱{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          
            {/* Bottom Buttons */}
            <div className="lg:col-span-3 flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t-2 border-gray-200 gap-4">
              <button type="button" onClick={() => setIsCheckingOut(false)} className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 hover:border-gray-400 hover:shadow-md transform hover:-translate-y-0.5">
                Back to Cart
              </button>
              <button 
                type="submit" 
                className={`w-full sm:w-auto flex items-center justify-center px-10 py-4 rounded-xl font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-lg transform hover:-translate-y-1 hover:shadow-xl ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : (isAddressComplete && isShippingComplete && isPaymentComplete)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white hover:from-blue-700 hover:to-purple-800'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-3" />
                    Placing Order...
                  </> 
                ) : (
                  <>
                    {(isAddressComplete && isShippingComplete && isPaymentComplete) && <FaCheckCircle className="mr-3" />}
                    Place Order
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

        <ShippingModal 
          isOpen={isShippingModalOpen} 
          onClose={() => setIsShippingModalOpen(false)} 
          selectedOption={shippingOption}
          onSelect={setShippingOption}
        />

        <PaymentModal 
          isOpen={isPaymentModalOpen} 
          onClose={() => setIsPaymentModalOpen(false)} 
          selectedOption={paymentMethod}
          onSelect={setPaymentMethod}
        />


    </>
  );
};

export default Checkout;
