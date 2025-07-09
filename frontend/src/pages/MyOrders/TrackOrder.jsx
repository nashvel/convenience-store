import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios-config';
import OrderTrackingMap from './OrderTrackingMap';
import OrderTrackingSkeleton from '../../components/Skeletons/OrderTrackingSkeleton';

// --- Icon Components ---
const ShoppingBagIcon = () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>;
const CogIcon = () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const TruckIcon = () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM5 16l-2-2"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h2a1 1 0 001-1V7.57c0-.53-.21-1.04-.59-1.41l-2.83-2.83A1 1 0 0012.17 3H12M17 16h2"></path></svg>;
const HomeIcon = () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const ClockIcon = () => <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const ReceiptIcon = () => <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;

const MapPlaceholder = ({ message }) => (
  <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500 rounded-lg"><p className="text-lg">{message}</p></div>
);

const TimeAgo = ({ timestamp }) => {
    const [time, setTime] = useState('just now');
    useEffect(() => {
        const update = () => {
            const seconds = Math.floor((Date.now() - timestamp) / 1000);
            if (seconds < 5) setTime('just now');
            else if (seconds < 60) setTime(`${seconds}s ago`);
            else setTime(`${Math.floor(seconds / 60)}m ago`);
        };
        update();
        const interval = setInterval(update, 5000);
        return () => clearInterval(interval);
    }, [timestamp]);
    return <span className="text-xs text-gray-400 font-normal">updated {time}</span>;
};

const OrderSummaryCard = ({ items }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!items || items.length === 0 || (items.length === 1 && items[0] && !items[0].name)) {
        return null; // Don't render if items are not available
    }

    const total = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

    return (
        <div className="mt-6 pt-6 border-t border-gray-200">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
                <h3 className="font-semibold text-gray-800 flex items-center"><ReceiptIcon /> Order Summary</h3>
                <svg className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="mt-4 pl-2 space-y-2 text-sm">
                    {items.map((item, i) => (
                        <div key={i} className="flex justify-between">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>₱{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span>₱{total.toFixed(2)}</span></div>
                </div>
            )}
        </div>
    );
};

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/orders/track/${id}`);
        setOrder(response.data);
        setLastUpdated(Date.now());
        setError(null);
      } catch (err) {
        setError('Failed to fetch order details. Please try again.');
      } finally {
        if (loading) setLoading(false);
      }
    };

    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 10000);
    return () => clearInterval(interval);
  }, [id, loading]);

  const getTrackingSteps = () => {
    if (!order) return [];
    const { status, created_at } = order;
    const steps = [
      { name: 'Order Placed', date: created_at, icon: ShoppingBagIcon, isCompleted: true },
      { name: 'Processing', icon: CogIcon, isCompleted: ['processing', 'accepted', 'in_transit', 'delivered'].includes(status) },
      { name: 'In Transit', icon: TruckIcon, isCompleted: ['in_transit', 'delivered'].includes(status) },
      { name: 'Delivered', icon: HomeIcon, isCompleted: status === 'delivered' },
    ];
    return steps;
  };

  if (loading) return <OrderTrackingSkeleton />;
  if (error) return <div className="text-center p-10 text-red-500 bg-red-100 rounded-lg">{error}</div>;
  if (!order) return <div className="text-center p-10">No order data available.</div>;

  const trackingSteps = getTrackingSteps();
  const hasCustomerLocation = order.customer && order.customer.latitude && order.customer.longitude;

  const riderStatusMessage = () => {
    if (!hasCustomerLocation) return 'Customer location is not available.';
    if (order.status === 'in_transit' && order.rider) return 'Rider is on the way!';
    if (order.status === 'in_transit' && !order.rider) return 'Searching for a nearby rider...';
    if (order.status === 'accepted') return 'Waiting for the store to prepare your order.';
    return 'Map is not available for this order.';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              &larr; Back
            </button>
            <div className="text-right">
                <p className="text-lg font-semibold text-gray-800">Order ID: <span className="text-blue-600">#{order.id}</span></p>
                {lastUpdated && <TimeAgo timestamp={lastUpdated} />}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Map */}
          <div className="h-96 rounded-xl shadow-md overflow-hidden border border-gray-200">
            {hasCustomerLocation ? <OrderTrackingMap order={order} /> : <MapPlaceholder message={riderStatusMessage()} />}
          </div>

          {/* Right Column: Details */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 space-y-4">
            {/* Estimated Delivery */}
            <div className="flex items-center">
                <ClockIcon />
                <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-700">Estimated Delivery</p>
                    <p className="text-lg font-bold text-blue-600">
                        {order.estimated_delivery_time ? new Date(order.estimated_delivery_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </p>
                </div>
            </div>

            {/* Order Status Timeline */}
            <div>
                <h2 className="text-base font-bold text-gray-800 mb-3">Order Status</h2>
                <div className="relative pl-4">
                  <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gray-200" style={{ left: '0.875rem' }}></div>
                  {trackingSteps.map((step) => (
                    <div key={step.name} className="flex items-start mb-4 relative">
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 z-10 ${step.isCompleted ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <step.icon />
                      </div>
                      <div className="ml-3">
                        <h4 className={`font-semibold text-sm ${step.isCompleted ? 'text-gray-800' : 'text-gray-500'}`}>{step.name}</h4>
                        {step.date && <p className="text-xs text-gray-500">{new Date(step.date).toLocaleString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
            </div>

            {/* Rider Info */}
            {order.status === 'in_transit' && order.rider && (
                <div className="p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                        <img src={`https://i.pravatar.cc/60?u=${order.rider.name}`} alt="Rider" className="w-8 h-8 rounded-full mr-3" />
                        <div>
                            <p className="font-semibold text-sm text-gray-800">{order.rider.name || 'Your Rider'}</p>
                            <p className="text-gray-600 text-xs">Is on the way!</p>
                        </div>
                    </div>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-blue-700 transition">Call</button>
                </div>
            )}

            <OrderSummaryCard items={order.items} />
            
            {/* Help Section */}
            <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-sm text-gray-800">Need Help?</h3>
                <button className="mt-2 w-full bg-gray-800 text-white py-1.5 rounded-md hover:bg-gray-700 transition text-sm">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
