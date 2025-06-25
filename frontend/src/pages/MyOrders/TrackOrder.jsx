import React from 'react';
import { useParams, Link } from 'react-router-dom';

const TrackOrder = () => {
  const { id } = useParams();

  // Dummy data for prototype
  const trackingSteps = [
    { status: 'Order Placed', date: 'June 25, 2025', completed: true },
    { status: 'Processing', date: 'June 25, 2025', completed: true },
    { status: 'Shipped', date: 'June 26, 2025', completed: false },
    { status: 'Out for Delivery', date: '', completed: false },
    { status: 'Delivered', date: '', completed: false },
  ];

  return (
    <div className="max-w-3xl mx-auto my-20 p-8 bg-white rounded-xl shadow-lg">
      <Link to={`/my-orders/${id}`} className="inline-block mb-6 px-4 py-2 bg-gray-200 rounded-lg text-gray-600 hover:bg-gray-300 transition">
        ← Back to Order Details
      </Link>
      <h2 className="text-center text-3xl font-bold mb-8">Track Order #{id}</h2>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-300"></div>

        {trackingSteps.map((step, index) => (
          <div key={index} className="flex items-center mb-8">
            <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`}>
              {step.completed && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              )}
            </div>
            <div className="ml-6">
              <h4 className={`font-semibold ${step.completed ? 'text-gray-800' : 'text-gray-500'}`}>{step.status}</h4>
              {step.date && <p className="text-sm text-gray-500">{step.date}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackOrder;
