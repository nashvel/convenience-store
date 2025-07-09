import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

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
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <button type="button" onClick={() => setIsPaymentModalOpen(true)} className="w-full p-4 border border-gray-300 rounded-lg text-left hover:border-primary">
                  <span className="font-semibold">{paymentMethod === 'cod' ? 'Cash on Delivery' : ''}</span>
                </button>
              </div>
            ) : null}
          </div>

          <div className="bg-gray-50 rounded-lg p-5 self-start sticky top-20">
            <h3 className="text-lg font-semibold mb-5">Order Summary</h3>
            <div className="mb-4 max-h-52 overflow-y-auto">
              {Object.entries(groupedCart).map(([storeId, group]) => (
                <div key={`store-${storeId}`} className="mb-4 last:mb-0">
                  <h4 className="text-base font-semibold mb-2">{group.storeName}</h4>
                  {group.items.map(item => (
                    <div key={`item-${item.id}`} className="flex justify-between py-2 border-b border-dashed border-gray-200 last:border-b-0">
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

              {shippingOption === 'door_to_door' && selectedStores && selectedStores.map(store => (
                <div key={store.id} className="flex justify-between">
                  <span>Shipping from {store.name}</span>
                                    <span className="font-medium text-gray-800">₱{formatPrice(Number(store.delivery_fee ?? 5.00))}</span>
                </div>
              ))}
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₱{formatPrice(total)}</span>
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
