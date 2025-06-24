import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

import ShippingModal from '../Modals/ShippingModal';
import AddressSelector from './AddressSelector';

const Checkout = ({
  user,
  groupedCart,
  subtotal,
  tax,
  shippingOption,
  setShippingOption,
  deliveryAddress,
  setDeliveryAddress,
  paymentDetails,
  handlePaymentInputChange,
  handleCheckout,
  isSubmitting,
  setIsCheckingOut,
  checkoutTotal,
  formatPrice,
  pickupStore
}) => {
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-8" onSubmit={handleCheckout}>
          <div className="md:col-span-2 p-6 space-y-6">

            <AddressSelector user={user} onSelectAddress={setDeliveryAddress} />

            <div>
              <h3 className="text-lg font-semibold mb-4">Shipping Option</h3>
              <button type="button" onClick={() => setIsShippingModalOpen(true)} className="w-full p-4 border border-gray-300 rounded-lg text-left hover:border-primary">
                <span className="font-semibold">{shippingOption === 'door_to_door' ? 'Door-to-door Delivery' : 'Pick-up at Store'}</span>
              </button>
            </div>

            {shippingOption === 'door_to_door' ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="mb-4">
                  <label className="block mb-1.5 text-sm text-gray-500">Card Number</label>
                  <input type="text" name="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentInputChange} className="w-full p-2.5 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:border-primary" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block mb-1.5 text-sm text-gray-500">Expiry Date</label>
                    <input type="text" name="cardExpiry" value={paymentDetails.cardExpiry} onChange={handlePaymentInputChange} className="w-full p-2.5 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:border-primary" placeholder="MM/YY" required />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1.5 text-sm text-gray-500">CVV</label>
                    <input type="text" name="cardCvv" value={paymentDetails.cardCvv} onChange={handlePaymentInputChange} className="w-full p-2.5 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:border-primary" placeholder="123" required />
                  </div>
                </div>
              </div>
            ) : null}
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
            <hr className="border-t border-gray-200 my-4" />
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-800">₱{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium text-gray-800">₱{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-medium text-gray-800">₱{formatPrice(shippingOption === 'door_to_door' ? 5.00 : 0.00)}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₱{formatPrice(checkoutTotal)}</span>
              </div>
            </div>
          </div>
          
          <div className="col-span-full flex justify-between mt-5">
            <button type="button" onClick={() => setIsCheckingOut(false)} className="px-6 py-3 bg-white border border-gray-200 rounded-md font-medium cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-200">
              Back to Cart
            </button>
            <button 
              type="submit" 
              className="flex items-center justify-center px-6 py-3 bg-primary text-white border-none rounded-md font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Placing Order...
                </> 
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </form>
      </div>

      <ShippingModal 
        isOpen={isShippingModalOpen} 
        onClose={() => setIsShippingModalOpen(false)} 
        selectedOption={shippingOption}
        onSelect={setShippingOption}
      />
    </>
  );
};

export default Checkout;
