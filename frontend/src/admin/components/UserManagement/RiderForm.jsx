import React, { useState } from 'react';
import {
  UserIcon,
  OfficeBuildingIcon,
  MailIcon,
  PhoneIcon,
  TruckIcon,
  LockClosedIcon,
  KeyIcon,
  BellIcon,
  BadgeCheckIcon,
  PlusCircleIcon
} from '@heroicons/react/outline';

const RiderForm = () => {
  const formStyles = {
    label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
    input: 'block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
    helperText: 'text-xs text-gray-500 dark:text-gray-400 mt-1',
    checkbox: 'h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500',
    select: 'block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
    button: 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    store: '',
    vehicleType: 'motorcycle',
    password: '',
    confirmPassword: '',
    notifyByEmail: false,
    status: 'active'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Submitting rider:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
          <h2 className="text-base font-semibold leading-7 text-blue-900 dark:text-blue-300">Rider Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">This information will be used for account creation and contact purposes.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="name" className={formStyles.label}>Rider Name</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={`${formStyles.input} pl-10`} placeholder="Enter rider name" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className={formStyles.label}>Email address</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className={`${formStyles.input} pl-10`} placeholder="rider@example.com" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone" className={formStyles.label}>Phone Number</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className={`${formStyles.input} pl-10`} placeholder="+1 234 567 8900" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
          <h2 className="text-base font-semibold leading-7 text-blue-900 dark:text-blue-300">Assignment Details</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Assign rider to a store and specify vehicle type.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="store" className={formStyles.label}>Assigned Store</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <OfficeBuildingIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="store" id="store" value={formData.store} onChange={handleChange} required className={`${formStyles.input} pl-10`} placeholder="Store name" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="vehicleType" className={formStyles.label}>Vehicle Type</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TruckIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select id="vehicleType" name="vehicleType" value={formData.vehicleType} onChange={handleChange} className={`${formStyles.select} pl-10`}>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="car">Car</option>
                  <option value="bicycle">Bicycle</option>
                </select>
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
                <select id="status" name="status" value={formData.status} onChange={handleChange} className={`${formStyles.select} pl-10`}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-duty">On Duty</option>
                  <option value="off-duty">Off Duty</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-12">
            <h2 className="text-base font-semibold leading-7 text-blue-900 dark:text-blue-300">Notifications</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">We'll always let you know about important changes, but you pick what else you want to hear about.</p>

            <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                        <input id="notifyByEmail" name="notifyByEmail" type="checkbox" checked={formData.notifyByEmail} onChange={handleChange} className={formStyles.checkbox} />
                    </div>
                    <div className="text-sm leading-6">
                        <label htmlFor="notifyByEmail" className="font-medium text-gray-900 dark:text-white">Email Notifications</label>
                        <p className="text-gray-500 dark:text-gray-400">Send an email with account credentials to the specified email address.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Cancel</button>
        <button type="submit" className={formStyles.button}>
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Rider
        </button>
      </div>
    </form>
  );
};

export default RiderForm;
