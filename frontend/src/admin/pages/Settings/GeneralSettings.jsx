import React, { useState } from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { UploadIcon } from '@heroicons/react/outline';

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'E-commerce Platform',
    tagline: 'Your one-stop shop for everything',
    siteDescription: 'A premier e-commerce platform offering a wide variety of products.',
    storeAddress: '123 Market St, San Francisco, CA 94103',
    contactEmail: 'contact@example.com',
    contactPhone: '+1 (123) 456-7890',
    currency: 'USD',
    timezone: 'UTC-8:00 Pacific Time (US & Canada)',
    maintenanceMode: false,
    maintenanceMessage: 'Our site is currently down for maintenance. We will be back shortly. Thank you for your patience.',
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fileType === 'logo') setLogoPreview(reader.result);
        if (fileType === 'favicon') setFaviconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings saved:', settings);
    // Add logic to save settings to the backend
  };

  const FormRow = ({ label, children, description }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4">
      <div className="md:col-span-1">
        <h4 className="font-semibold text-gray-800 dark:text-white">{label}</h4>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
      </div>
      <div className="md:col-span-2">{children}</div>
    </div>
  );

  return (
    <>
      <PageMeta
        title="General Settings | Admin Dashboard"
        description="Manage general site settings"
      />
      <PageBreadcrumb pageTitle="General Settings" />
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Site Details Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Site Details</h3>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <FormRow label="Site Name">
                <input type="text" name="siteName" value={settings.siteName} onChange={handleInputChange} className="w-full form-input" />
              </FormRow>
              <FormRow label="Tagline">
                <input type="text" name="tagline" value={settings.tagline} onChange={handleInputChange} className="w-full form-input" />
              </FormRow>
              <FormRow label="Site Description">
                <textarea name="siteDescription" value={settings.siteDescription} onChange={handleInputChange} rows="3" className="w-full form-textarea"></textarea>
              </FormRow>
            </div>
          </div>

          {/* Store Information Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Store Information</h3>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <FormRow label="Store Address">
                <input type="text" name="storeAddress" value={settings.storeAddress} onChange={handleInputChange} className="w-full form-input" />
              </FormRow>
              <FormRow label="Contact Email">
                <input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleInputChange} className="w-full form-input" />
              </FormRow>
              <FormRow label="Contact Phone">
                <input type="tel" name="contactPhone" value={settings.contactPhone} onChange={handleInputChange} className="w-full form-input" />
              </FormRow>
            </div>
          </div>

          {/* Branding Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Branding</h3>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <FormRow label="Site Logo" description="Upload your logo. Recommended size: 200x50px.">
                <div className="flex items-center gap-4">
                  {logoPreview && <img src={logoPreview} alt="Logo Preview" className="h-12 bg-gray-200 p-1 rounded" />}
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                    <UploadIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                    <span>Upload</span>
                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'logo')} accept="image/*" />
                  </label>
                </div>
              </FormRow>
              <FormRow label="Favicon" description="Upload a 32x32px .ico or .png file.">
                <div className="flex items-center gap-4">
                  {faviconPreview && <img src={faviconPreview} alt="Favicon Preview" className="h-8 w-8" />}
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                    <UploadIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                    <span>Upload</span>
                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'favicon')} accept=".ico,.png" />
                  </label>
                </div>
              </FormRow>
            </div>
          </div>

          {/* Localization Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Localization</h3>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <FormRow label="Currency">
                <select name="currency" value={settings.currency} onChange={handleInputChange} className="form-select">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </FormRow>
              <FormRow label="Timezone">
                <select name="timezone" value={settings.timezone} onChange={handleInputChange} className="form-select">
                  <option>UTC-8:00 Pacific Time (US & Canada)</option>
                  <option>UTC+1:00 Central European Time</option>
                  <option>UTC+0:00 Greenwich Mean Time</option>
                </select>
              </FormRow>
            </div>
          </div>

          {/* Maintenance Mode Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Maintenance Mode</h3>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <FormRow label="Enable Maintenance Mode" description="Puts the storefront in maintenance mode. Admins can still access the site.">
                <label htmlFor="maintenanceMode" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" id="maintenanceMode" name="maintenanceMode" className="sr-only" checked={settings.maintenanceMode} onChange={handleInputChange} />
                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${settings.maintenanceMode ? 'translate-x-6 bg-blue-500' : ''}`}></div>
                  </div>
                </label>
              </FormRow>
              {settings.maintenanceMode && (
                <FormRow label="Maintenance Message">
                  <textarea name="maintenanceMessage" value={settings.maintenanceMessage} onChange={handleInputChange} rows="3" className="w-full form-textarea"></textarea>
                </FormRow>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Save All Settings
          </button>
        </div>
      </form>
    </>
  );
};

export default GeneralSettings;
