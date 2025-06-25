import React, { useState } from 'react';
import { formStyles } from './styles';
import {
  UserIcon,
  OfficeBuildingIcon,
  MailIcon,
  PhoneIcon,
  TruckIcon,
  LockClosedIcon,
  KeyIcon,
  BellIcon,
  BadgeCheckIcon
} from '@heroicons/react/outline';

const RiderForm = () => {
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
    <div className={formStyles.container}>
      <form onSubmit={handleSubmit} className={formStyles.form}>
        <div className={formStyles.grid}>
          <div className="mb-6">
            <h2 className={formStyles.formHeader}>Add New Rider</h2>
            <p className={formStyles.helperText}>
              Create a new rider account with delivery capabilities
            </p>
          </div>
          <div className={formStyles.gridItem}>
            <label className={formStyles.label}>Rider Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`${formStyles.input} pl-10`} // Add padding for icon
                placeholder="Enter rider name"
              />
            </div>
            <p className={formStyles.helperText}>Full name of the rider</p>
          </div>
        </div>
        <div className={formStyles.gridItem}>
          <label className={formStyles.label}>Assigned Store</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <OfficeBuildingIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="store"
              value={formData.store}
              onChange={handleChange}
              required
              className={`${formStyles.input} pl-10`}
              placeholder="Store name"
            />
          </div>
          <p className={formStyles.helperText}>Store this rider is assigned to</p>
        </div>
        <div className={formStyles.gridItem}>
          <label className={formStyles.label}>Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`${formStyles.input} pl-10`} // Add padding for icon
              placeholder="rider@example.com"
            />
          </div>
          <p className={formStyles.helperText}>Primary contact email</p>
        </div>
        <div className={formStyles.gridItem}>
          <label className={formStyles.label}>Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={`${formStyles.input} pl-10`} // Add padding for icon
              placeholder="+1 234 567 8900"
            />
          </div>
          <p className={formStyles.helperText}>Primary contact phone number</p>
        </div>
        <div className={formStyles.gridItem}>
          <div className="flex items-center gap-3">
            <TruckIcon className="h-5 w-5 text-gray-400" />
            <label className={formStyles.label}>Vehicle Type</label>
          </div>
          <div className="flex items-center gap-2">
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className={formStyles.select}
            >
              <option value="motorcycle">Motorcycle</option>
              <option value="car">Car</option>
              <option value="bicycle">Bicycle</option>
            </select>
          </div>
          <p className={formStyles.helperText}>Type of vehicle the rider uses</p>
        </div>
        <div className={formStyles.gridItem}>
          <label className={formStyles.label}>Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`${formStyles.input} pl-10`} // Add padding for icon
              placeholder="Enter password"
            />
          </div>
          <p className={formStyles.helperText}>Password for the new account</p>
        </div>
        <div className={formStyles.gridItem}>
          <label className={formStyles.label}>Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`${formStyles.input} pl-10`} // Add padding for icon
              placeholder="Confirm password"
            />
          </div>
          <p className={formStyles.helperText}>Confirm the password</p>
        </div>
        <div className={formStyles.gridItem}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="notifyByEmail"
              checked={formData.notifyByEmail}
              onChange={handleChange}
              className={formStyles.checkbox}
            />
            <div className="flex items-center gap-3">
              <BellIcon className="h-5 w-5 text-gray-400" />
              <label className={formStyles.label} htmlFor="notifyByEmail">
                Send email notification with credentials
              </label>
            </div>
          </div>
          <p className={formStyles.helperText}>
            Send an email with account credentials to the specified email address
          </p>
        </div>
        <div className={formStyles.gridItem}>
          <div className="flex items-center gap-3">
            <BadgeCheckIcon className="h-5 w-5 text-gray-400" />
            <label className={formStyles.label}>Status</label>
          </div>
          <div className="flex items-center gap-2">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={formStyles.select}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-duty">On Duty</option>
              <option value="off-duty">Off Duty</option>
            </select>
          </div>
          <p className={formStyles.helperText}>Current status of the rider</p>
        </div>
        <div className="mt-8">
          <button
            type="submit"
            className={formStyles.button}
          >
            <span className="mr-2">✓</span>
            Add Rider
          </button>
        </div>
      </form>
    </div>
  );
};

export default RiderForm;
