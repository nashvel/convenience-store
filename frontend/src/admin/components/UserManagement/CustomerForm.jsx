import React, { useState } from 'react';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  LocationMarkerIcon,
  LockClosedIcon,
  KeyIcon,
  BadgeCheckIcon,
  PlusCircleIcon
} from '@heroicons/react/outline';

const CustomerForm = () => {
  const formStyles = {
    label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
    input: 'block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
    button: 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    status: 'active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting customer:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
          <h2 className="text-base font-semibold leading-7 text-blue-900 dark:text-blue-300">Personal Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">This information will be used for account and delivery purposes.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="firstName" className={formStyles.label}>First Name</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} required className={`${formStyles.input} pl-10`} placeholder="Enter first name" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="lastName" className={formStyles.label}>Last Name</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} required className={`${formStyles.input} pl-10`} placeholder="Enter last name" />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className={formStyles.label}>Email address</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className={`${formStyles.input} pl-10`} placeholder="customer@example.com" />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="address" className={formStyles.label}>Street address</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LocationMarkerIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className={`${formStyles.input} pl-10`} placeholder="123 Main St, Anytown, USA" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
          <h2 className="text-base font-semibold leading-7 text-blue-900 dark:text-blue-300">Account Security</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Manage account credentials and status.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="password" className={formStyles.label}>Password</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required className={`${formStyles.input} pl-10`} placeholder="Enter password" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="confirmPassword" className={formStyles.label}>Confirm Password</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className={`${formStyles.input} pl-10`} placeholder="Confirm password" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="status" className={formStyles.label}>Status</label>
              <div className="mt-2 relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BadgeCheckIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className={`${formStyles.input} pl-10`}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Cancel</button>
        <button type="submit" className={formStyles.button}>
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Customer
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
