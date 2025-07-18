import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axios-config';
import toast from 'react-hot-toast';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  LockClosedIcon,
  KeyIcon,
  BellIcon,
  PlusCircleIcon,
  OfficeBuildingIcon
} from '@heroicons/react/outline';

const ClientForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formStyles = {
    label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
    input: 'block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
    helperText: 'text-xs text-gray-500 dark:text-gray-400 mt-1',
    checkbox: 'h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500',
    select: 'block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
    button: 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
  };
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    notifyByEmail: true,
    store_type: 'convenience'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating client...');

    try {
      await api.post('/admin/clients', formData);
      toast.success('Client created successfully!', { id: toastId });
      navigate('/admin/clients');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error(error.response.data.messages.error, { id: toastId });
      } else {
        toast.error('An unexpected error occurred.', { id: toastId });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
          <h2 className="text-base font-semibold leading-7 text-blue-900 dark:text-blue-300">Client Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">This information will be displayed publicly so be careful what you share.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="first_name" className={formStyles.label}>First Name</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleChange} required className={`${formStyles.input} pl-10`} placeholder="Enter first name" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="last_name" className={formStyles.label}>Last Name</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleChange} required className={`${formStyles.input} pl-10`} placeholder="Enter last name" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className={formStyles.label}>Email address</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className={`${formStyles.input} pl-10`} placeholder="client@example.com" />
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

            <div className="sm:col-span-3">
              <label htmlFor="store_type" className={formStyles.label}>Store Type</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <OfficeBuildingIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select id="store_type" name="store_type" value={formData.store_type} onChange={handleChange} required className={`${formStyles.select} pl-10`}>
                  <option value="convenience">Convenience</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
          <h2 className="text-base font-semibold leading-7 text-blue-900 dark:text-blue-300">Account Security</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Manage account credentials.</p>

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
        <button type="button" onClick={() => navigate('/admin/clients')} className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Cancel</button>
        <button 
          type="submit" 
          className={`${formStyles.button} disabled:opacity-50`}
          disabled={isSubmitting}
        >
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {isSubmitting ? 'Adding Client...' : 'Add Client'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
