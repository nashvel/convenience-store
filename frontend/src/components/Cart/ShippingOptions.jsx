import React from 'react';
import { FaTruck, FaStore, FaWallet } from 'react-icons/fa';

const ShippingOptions = ({ selected, onChange }) => {
  const options = [
    {
      id: 'door_to_door',
      name: 'Door-to-door',
      description: 'Delivered right to your doorstep.',
      icon: <FaTruck className="text-xl" />,
      disabled: false,
    },
    {
      id: 'pick_up',
      name: 'Pick-up',
      description: 'Collect from the store.',
      icon: <FaStore className="text-xl" />,
      disabled: false,
    },
    {
      id: 'ewallet',
      name: 'eWallet',
      description: 'Coming soon!',
      icon: <FaWallet className="text-xl" />,
      disabled: true,
    },
  ];

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <label
          key={option.id}
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selected === option.id ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200'} ${option.disabled ? 'cursor-not-allowed bg-gray-100 opacity-60' : 'hover:border-primary-300'}`}>
          <input
            type="radio"
            name="shippingOption"
            value={option.id}
            checked={selected === option.id}
            onChange={onChange}
            disabled={option.disabled}
            className="sr-only"
          />
          <div className={`mr-4 ${selected === option.id ? 'text-primary-600' : 'text-gray-500'}`}>
            {option.icon}
          </div>
          <div className="flex-grow">
            <p className="font-semibold text-gray-800">{option.name}</p>
            <p className="text-sm text-gray-500">{option.description}</p>
          </div>
        </label>
      ))
      }
    </div >
  );
};

export default ShippingOptions;
